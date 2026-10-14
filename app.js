/**
 * Practice Metronome
 *
 * Timing model:
 *  - A lookahead scheduler (timer fires every ~25ms) queues clicks on the
 *    AudioContext timeline up to ~120ms ahead. Each click is an OscillatorNode
 *    started/stopped at an exact AudioContext time, so timing is sample-accurate
 *    and independent of JS timer jitter.
 *  - The visual beat indicator is driven from a queue of {time, beat} events
 *    that are drawn when the audio clock reaches them.
 */

(() => {
  "use strict";

  /* ============================================================
   * Constants & configuration
   * ============================================================ */
  const CONFIG = Object.freeze({
    MIN_BPM: 30,
    MAX_BPM: 300,
    DEFAULT_BPM: 120,
    DEFAULT_BEATS: 4,
    SCHEDULE_AHEAD: 0.12,      // seconds of audio queued in advance
    SCHEDULER_INTERVAL: 25,    // ms between scheduler wakeups
    CLICK_DURATION: 0.045,     // seconds
    CLICK_FREQ_DOWN: 1600,     // Hz, accented downbeat
    CLICK_FREQ_UP: 1000,       // Hz, other beats
    CLICK_PEAK: 0.9,
    CLICK_PEAK_UP: 0.55,
    TAP_WINDOW_MS: 2000,       // taps older than this reset the sequence
    TAP_MAX_SAMPLES: 6,
    TAP_MIN_SAMPLES: 2,
    COUNTIN_LABEL_MS: 0,
  });

  const MODES = Object.freeze({ METRONOME: "metronome", SPEEDLOOP: "speedloop" });

  /* ============================================================
   * Utilities
   * ============================================================ */
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const toInt = (value, fallback) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : fallback;
  };
  const formatTime = (totalSeconds) => {
    const s = Math.max(0, Math.ceil(totalSeconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  };
  const { AudioEngine, Scheduler } = window.createMetronomeAudio({ CONFIG, clamp });

  /* ============================================================
   * Visual sync: plays beat events at the moment the audio sounds
   * ============================================================ */
  class BeatVisualizer {
    constructor(container, onBeatDraw = () => {}) {
      this.container = container;
      this.onBeatDraw = onBeatDraw;
      this.dots = [];
      this.queue = [];
      this.rafId = null;
      this.engine = null;
    }

    attach(engine) {
      this.engine = engine;
    }

    rebuild(count) {
      this.container.textContent = "";
      this.dots = [];
      for (let i = 0; i < count; i++) {
        const dot = document.createElement("div");
        dot.className = "beat-dot" + (i === 0 ? " downbeat" : "");
        this.container.appendChild(dot);
        this.dots.push(dot);
      }
      this.queue.length = 0;
    }

    /** Queue a beat event to be drawn when audio time reaches it. */
    enqueue(beatIndex, time, count) {
      if (this.dots.length !== count) this.rebuild(count);
      this.queue.push({ beatIndex, time });
      if (!this.rafId) this.loop();
    }

    loop = () => {
      const now = this.engine.now;
      let latest = null;
      while (this.queue.length && this.queue[0].time <= now) {
        latest = this.queue.shift();
      }
      if (latest) {
        this.draw(latest.beatIndex);
        this.onBeatDraw(latest.beatIndex, latest.time);
      }
      if (this.queue.length || latest) {
        this.rafId = requestAnimationFrame(this.loop);
      } else {
        this.rafId = null;
      }
    };

    draw(index) {
      this.dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      this.container.setAttribute("aria-label", `Beat ${index + 1} of ${this.dots.length}`);
    }

    clear() {
      this.queue.length = 0;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.dots.forEach((d) => d.classList.remove("active"));
    }
  }

  /* ============================================================
   * Tap tempo
   * ============================================================ */
  class TapTempo {
    constructor(onTempo) {
      this.onTempo = onTempo;
      this.taps = [];
    }

    tap(now = performance.now()) {
      if (this.taps.length && now - this.taps[this.taps.length - 1] > CONFIG.TAP_WINDOW_MS) {
        this.taps = [];
      }
      this.taps.push(now);
      if (this.taps.length > CONFIG.TAP_MAX_SAMPLES + 1) {
        this.taps.shift();
      }
      if (this.taps.length < CONFIG.TAP_MIN_SAMPLES + 1) return null;

      const intervals = [];
      for (let i = 1; i < this.taps.length; i++) {
        intervals.push(this.taps[i] - this.taps[i - 1]);
      }
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgMs);
      const clamped = clamp(bpm, CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      this.onTempo(clamped);
      return clamped;
    }

    reset() {
      this.taps = [];
    }
  }

  /* ============================================================
   * Speed loop (ramp) controller
   * ============================================================ */
  /**
   * Computes the tempo as a function of elapsed time. Linear ramp from start
   * to target over the configured duration; after the ramp it holds the
   * target indefinitely (never stops on its own).
   */
  class SpeedRamp {
    constructor() {
      this.start = CONFIG.DEFAULT_BPM;
      this.target = CONFIG.DEFAULT_BPM;
      this.durationSec = 600;
      this.startedAt = 0;
    }

    configure({ start, target, minutes }) {
      this.start = clamp(start, CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      this.target = clamp(target, CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      this.durationSec = Math.max(1, minutes) * 60;
    }

    begin(atTime) {
      this.startedAt = atTime;
    }

    /** Returns { bpm, progress 0..1, rampDone } for an audio-clock time. */
    sample(atTime) {
      const elapsed = Math.max(0, atTime - this.startedAt);
      const progress = clamp(elapsed / this.durationSec, 0, 1);
      const bpm = this.start + (this.target - this.start) * progress;
      return { bpm: Math.round(bpm), progress, rampDone: progress >= 1 };
    }
  }

  /* ============================================================
   * Application controller
   * ============================================================ */
  class MetronomeApp {
    constructor() {
      this.state = window.MetronomeStorage.load();
      this.engine = new AudioEngine();

      // DOM refs
      this.el = {
        bpmValue: document.getElementById("bpmValue"),
        slider: document.getElementById("tempoSlider"),
        minus5: document.getElementById("minus5"),
        minus1: document.getElementById("minus1"),
        plus1: document.getElementById("plus1"),
        plus5: document.getElementById("plus5"),
        playBtn: document.getElementById("playBtn"),
        playLabel: document.getElementById("playLabel"),
        tapBtn: document.getElementById("tapBtn"),
        beatRow: document.getElementById("beatRow"),
        meterLabel: document.getElementById("meterLabel"),
        statusLine: document.getElementById("statusLine"),
        readout: document.getElementById("readout"),
        beatsPerBar: document.getElementById("beatsPerBar"),
        timerEnabled: document.getElementById("timerEnabled"),
        timerFields: document.getElementById("timerFields"),
        timerMinutes: document.getElementById("timerMinutes"),
        clickTone: document.getElementById("clickTone"),
        volume: document.getElementById("volume"),
        volumeValue: document.getElementById("volumeValue"),
        countdownEnabled: document.getElementById("countdownEnabled"),
        countdownFields: document.getElementById("countdownFields"),
        countdownBeats: document.getElementById("countdownBeats"),
        speedloopFields: document.getElementById("speedloopFields"),
        loopStart: document.getElementById("loopStart"),
        loopTarget: document.getElementById("loopTarget"),
        loopMinutes: document.getElementById("loopMinutes"),
        loopBars: document.getElementById("loopBars"),
        loopHint: document.getElementById("loopHint"),
        loopProgress: document.getElementById("loopProgress"),
        progressFill: document.getElementById("progressFill"),
        progressTrack: document.getElementById("progressTrack"),
        progressText: document.getElementById("progressText"),
        phraseLabel: document.getElementById("phraseLabel"),
        settingsPanel: document.getElementById("settingsPanel"),
        wakeLockEnabled: document.getElementById("wakeLockEnabled"),
        wakeLockStatus: document.getElementById("wakeLockStatus"),
        settingsHint: document.getElementById("settingsHint"),
        themeToggle: document.getElementById("themeToggle"),
        themeLabel: document.getElementById("themeLabel"),
        tabs: Array.from(document.querySelectorAll(".tab")),
      };

      this.visualizer = new BeatVisualizer(this.el.beatRow, (beatIndex, time) => {
        this.updatePhraseIndicator(beatIndex, time);
      });
      this.visualizer.attach(this.engine);

      this.scheduler = new Scheduler(this.engine, (beatIndex, time, count) => {
        this.visualizer.enqueue(beatIndex, time, count);
        this.handleScheduledBeat(time, count);
      });

      this.tap = new TapTempo((bpm) => this.setBpm(bpm, { fromTap: true }));
      this.ramp = new SpeedRamp();

      this.running = false;
      this.phase = "idle";          // idle | countin | playing
      this.sessionStartTime = 0;    // audio-clock time main session started
      this.speedLoopBeatCount = 0;
      this.speedLoopBar = 0;
      this.pendingSpeedLoopBeats = [];
      this.timerEndTime = null;     // audio-clock time when timer expires
      this.countInEndTime = null;
      this.wakeLock = null;
      this.wakeLockPending = false;
      this.rafId = null;
      this.alertShown = false;

      this.bindEvents();
      this.applyStateToUI();
      this.applyTheme(this.state.theme);
      this.visualizer.rebuild(this.state.beatsPerBar);
      this.updateBeatCounter();
    }

    /* -------------------- State & persistence -------------------- */
    persist() {
      window.MetronomeStorage.save(this.state);
    }

    /* -------------------- Event binding -------------------- */
    bindEvents() {
      const e = this.el;

      e.playBtn.addEventListener("click", () => this.toggle());
      e.tapBtn.addEventListener("click", () => this.handleTap());
      e.themeToggle.addEventListener("click", () => {
        this.state.theme = this.state.theme === "dark" ? "light" : "dark";
        this.applyTheme(this.state.theme);
        this.persist();
      });

      e.minus5.addEventListener("click", () => this.nudge(-5));
      e.minus1.addEventListener("click", () => this.nudge(-1));
      e.plus1.addEventListener("click", () => this.nudge(1));
      e.plus5.addEventListener("click", () => this.nudge(5));

      e.slider.addEventListener("input", () => {
        this.setBpm(toInt(e.slider.value, this.state.bpm));
      });

      e.beatsPerBar.addEventListener("change", () => {
        if (this.running) return;
        this.state.beatsPerBar = toInt(e.beatsPerBar.value, CONFIG.DEFAULT_BEATS);
        this.scheduler.setBeatsPerBar(this.state.beatsPerBar);
        this.visualizer.rebuild(this.state.beatsPerBar);
        this.updateBeatCounter();
        this.persist();
      });

      e.timerEnabled.addEventListener("change", () => {
        this.state.timerEnabled = e.timerEnabled.checked;
        e.timerFields.hidden = !this.state.timerEnabled;
        this.persist();
      });

      e.timerMinutes.addEventListener("change", () => {
        this.state.timerMinutes = clamp(toInt(e.timerMinutes.value, 5), 1, 180);
        e.timerMinutes.value = this.state.timerMinutes;
        this.persist();
      });

      e.clickTone.addEventListener("change", () => {
        this.state.clickTone = e.clickTone.value;
        this.engine.setClickTone(this.state.clickTone);
        this.persist();
      });

      e.volume.addEventListener("input", () => {
        this.state.volume = Number(e.volume.value);
        this.el.volumeValue.value = `${Math.round(this.state.volume * 100)}%`;
        this.engine.setVolume(this.state.volume);
        this.persist();
      });

      e.countdownEnabled.addEventListener("change", () => {
        this.state.countdownEnabled = e.countdownEnabled.checked;
        e.countdownFields.hidden = !this.state.countdownEnabled;
        this.persist();
      });

      e.countdownBeats.addEventListener("change", () => {
        this.state.countdownBeats = toInt(e.countdownBeats.value, 4);
        this.persist();
      });

      e.wakeLockEnabled.addEventListener("change", () => {
        this.state.wakeLockEnabled = e.wakeLockEnabled.checked;
        this.persist();
        if (!this.state.wakeLockEnabled) this.releaseWakeLock();
        else if (this.running) this.acquireWakeLock();
      });

      const loopInputs = [
        [e.loopStart, "loopStart", 30, 300],
        [e.loopTarget, "loopTarget", 30, 300],
        [e.loopMinutes, "loopMinutes", 1, 120],
        [e.loopBars, "loopBars", 1, 32],
      ];
      loopInputs.forEach(([input, key, min, max]) => {
        input.addEventListener("change", () => {
          this.state[key] = clamp(toInt(input.value, this.state[key]), min, max);
          input.value = this.state[key];
          if (key === "loopBars") this.updateLoopPhraseText();
          this.persist();
        });
      });

      e.tabs.forEach((tab) => {
        tab.addEventListener("click", () => this.setMode(tab.dataset.mode));
      });
      e.tabs.forEach((tab, index) => {
        tab.addEventListener("keydown", (ev) => {
          let nextIndex;
          if (ev.key === "ArrowRight" || ev.key === "ArrowDown") nextIndex = (index + 1) % e.tabs.length;
          else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") nextIndex = (index - 1 + e.tabs.length) % e.tabs.length;
          else if (ev.key === "Home") nextIndex = 0;
          else if (ev.key === "End") nextIndex = e.tabs.length - 1;
          else return;
          ev.preventDefault();
          e.tabs[nextIndex].focus();
          e.tabs[nextIndex].click();
        });
      });

      // Keyboard: space toggles, arrows nudge, T taps.
      document.addEventListener("keydown", (ev) => {
        if (ev.repeat && (ev.code === "Space" || ev.key.toLowerCase() === "t")) return;
        if (ev.target instanceof HTMLElement && ev.target.closest("button, input, select, textarea, [contenteditable='true']")) return;
        if (ev.code === "Space") {
          ev.preventDefault();
          this.toggle();
        } else if (ev.code === "ArrowUp") {
          ev.preventDefault();
          this.nudge(ev.shiftKey ? 5 : 1);
        } else if (ev.code === "ArrowDown") {
          ev.preventDefault();
          this.nudge(ev.shiftKey ? -5 : -1);
        } else if (ev.key.toLowerCase() === "t") {
          this.handleTap();
        }
      });

      // Resume audio context if the page was backgrounded/suspended by the OS.
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && this.running && this.engine.ctx?.state === "suspended") {
          this.engine.resume().catch((error) => {
            console.warn("Audio could not resume after returning to the app.", error);
            this.setStatus("Audio paused. Tap Start to resume playback.");
          });
        }
        if (!document.hidden && this.running && this.state.wakeLockEnabled) this.acquireWakeLock();
      });
    }

    /* -------------------- UI application -------------------- */
    applyStateToUI() {
      const s = this.state;
      this.el.beatsPerBar.value = String(s.beatsPerBar);
      this.el.timerEnabled.checked = s.timerEnabled;
      this.el.timerFields.hidden = !s.timerEnabled;
      this.el.timerMinutes.value = s.timerMinutes;
      this.el.clickTone.value = s.clickTone;
      this.el.volume.value = String(s.volume);
      this.el.volumeValue.value = `${Math.round(s.volume * 100)}%`;
      this.engine.setClickTone(s.clickTone);
      this.engine.setVolume(s.volume);
      this.el.countdownEnabled.checked = s.countdownEnabled;
      this.el.countdownFields.hidden = !s.countdownEnabled;
      this.el.countdownBeats.value = String(s.countdownBeats);
      this.el.wakeLockEnabled.checked = s.wakeLockEnabled;
      this.el.wakeLockEnabled.disabled = this.running || !("wakeLock" in navigator);
      if (!("wakeLock" in navigator)) this.el.wakeLockStatus.textContent = "Screen wake lock is not supported by this browser.";
      this.el.loopStart.value = s.loopStart;
      this.el.loopTarget.value = s.loopTarget;
      this.el.loopMinutes.value = s.loopMinutes;
      this.el.loopBars.value = s.loopBars;
      this.updateLoopPhraseText();

      this.scheduler.setBpm(s.bpm);
      this.scheduler.setBeatsPerBar(s.beatsPerBar);
      this.renderBpm();
      this.setMode(s.mode, { persistChange: false });
    }

    applyTheme(theme) {
      const value = theme === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = value;
      const label = value === "dark" ? "Light mode" : "Dark mode";
      this.el.themeLabel.textContent = label;
      this.el.themeToggle.setAttribute("aria-label", `Switch to ${label.toLowerCase()}`);
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content",
        value === "dark" ? "#101114" : "#f3f5f8"
      );
    }

    renderBpm() {
      const bpm = this.state.bpm;
      this.el.bpmValue.textContent = String(bpm);
      this.el.slider.value = String(bpm);
      const fill = ((bpm - CONFIG.MIN_BPM) / (CONFIG.MAX_BPM - CONFIG.MIN_BPM)) * 100;
      this.el.slider.style.setProperty("--fill", `${fill}%`);
      this.el.slider.setAttribute("aria-valuetext", `${bpm} beats per minute`);
    }

    updateTempoControlAvailability() {
      const locked = this.running && this.state.mode === MODES.SPEEDLOOP;
      [this.el.slider, this.el.minus5, this.el.minus1, this.el.plus1, this.el.plus5, this.el.tapBtn]
        .forEach((control) => { control.disabled = locked; });
      [
        this.el.beatsPerBar, this.el.timerEnabled, this.el.timerMinutes,
        this.el.clickTone, this.el.volume, this.el.countdownEnabled,
        this.el.countdownBeats, this.el.wakeLockEnabled, this.el.loopStart,
        this.el.loopTarget, this.el.loopMinutes, this.el.loopBars,
      ].forEach((control) => { control.disabled = this.running; });
      this.el.wakeLockEnabled.disabled = this.running || !("wakeLock" in navigator);
      this.el.tabs.forEach((tab) => {
        tab.disabled = this.running;
        tab.title = this.running ? "Stop playback to change mode" : "";
      });
      this.el.settingsHint.hidden = !this.running;
    }

    updateBeatCounter() {
      this.el.meterLabel.textContent = `${this.state.beatsPerBar}/4`;
    }

    setMode(mode, { persistChange = true } = {}) {
      if (!Object.values(MODES).includes(mode)) return;
      this.state.mode = mode;
      this.el.tabs.forEach((t) => {
        const active = t.dataset.mode === mode;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
        t.tabIndex = active ? 0 : -1;
      });
      this.el.speedloopFields.hidden = mode !== MODES.SPEEDLOOP;
      this.el.settingsPanel?.setAttribute("aria-labelledby", mode === MODES.SPEEDLOOP ? "speedloopTab" : "metronomeTab");
      this.updateTempoControlAvailability();
      if (persistChange) this.persist();
    }

    /* -------------------- Tempo -------------------- */
    setBpm(bpm, { fromTap = false } = {}) {
      if (this.running && this.state.mode === MODES.SPEEDLOOP) return;
      const value = clamp(Math.round(bpm), CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      this.state.bpm = value;
      this.scheduler.setBpm(value); // takes effect on next scheduled beat
      this.renderBpm();
      this.persist();
      if (fromTap) this.flashTap();
    }

    nudge(delta) {
      if (this.state.mode === MODES.SPEEDLOOP && this.running) return; // ramp owns tempo
      this.setBpm(this.state.bpm + delta);
      this.pulsePlay();
    }

    handleTap() {
      if (this.running && this.state.mode === MODES.SPEEDLOOP) return;
      const bpm = this.tap.tap(performance.now());
      if (bpm !== null) this.flashTap();
      this.setStatus(bpm !== null ? `Tap: ${bpm} BPM` : "Keep tapping…");
    }

    flashTap() {
      this.el.tapBtn.classList.add("flash");
      setTimeout(() => this.el.tapBtn.classList.remove("flash"), 90);
    }

    pulsePlay() {
      const btn = this.el.playBtn;
      btn.classList.remove("pulse");
      void btn.offsetWidth; // restart animation
      btn.classList.add("pulse");
    }

    /* -------------------- Transport -------------------- */
    async toggle() {
      if (this.running) {
        this.stop();
      } else {
        await this.start();
      }
    }

    async start() {
      try {
        await this.engine.resume(); // satisfies autoplay policy on user gesture
      } catch (err) {
        console.warn("Audio could not start.", err);
        this.setStatus(err instanceof Error && err.message.includes("not supported")
          ? "Audio is not supported in this browser. Try a current browser with Web Audio support."
          : "Audio couldn't start. Check browser audio permissions, then tap Start to try again.");
        return;
      }

      this.running = true;
      this.updateTempoControlAvailability();
      if (this.state.wakeLockEnabled) this.acquireWakeLock();
      this.alertShown = false;
      this.el.playBtn.setAttribute("aria-pressed", "true");
      this.el.playBtn.classList.add("running");
      this.tap.reset();

      const now = this.engine.now;
      const leadIn = 0.08;
      const useCountIn = this.state.countdownEnabled;

      this.scheduler.setBeatsPerBar(this.state.beatsPerBar);
      this.state.bpm = this.currentBpm();
      this.scheduler.setBpm(this.state.bpm);
      this.renderBpm();

      if (useCountIn) {
        this.phase = "countin";
        const beats = this.state.countdownBeats;
        const spb = 60 / this.currentBpm();
        this.countInEndTime = now + leadIn + beats * spb;
        this.setStatus("Count-in");
        this.el.playLabel.textContent = "Stop";
        this.scheduler.start(now + leadIn);
        this.scheduleCountInTicks(now + leadIn, beats, spb);
      } else {
        this.beginMainSession(now + leadIn);
      }

      this.startFrameLoop();
    }

    /** Beat-by-beat count-in readout (no-op audio beyond the metronome clicks). */
    scheduleCountInTicks(startTime, beats, spb) {
      this.countInRemaining = beats;
      const update = () => {
        if (!this.running || this.phase !== "countin") return;
        const remaining = Math.ceil((this.countInEndTime - this.engine.now) / spb);
        if (remaining <= 0) {
          this.beginMainSession(this.countInEndTime);
          return;
        }
        this.setStatus(`Count-in: ${remaining}`);
        setTimeout(update, 40);
      };
      update();
    }

    beginMainSession(atTime) {
      this.phase = "playing";
      this.sessionStartTime = atTime;
      this.setStatus("");
      this.el.playLabel.textContent = "Stop";

      const mode = this.state.mode;
      if (mode === MODES.SPEEDLOOP) {
        this.speedLoopBeatCount = 0;
        this.speedLoopBar = 0;
        this.el.phraseLabel.hidden = false;
        this.el.phraseLabel.textContent = `Bar 1 of ${this.state.loopBars}`;
        this.ramp.configure({
          start: this.state.loopStart,
          target: this.state.loopTarget,
          minutes: this.state.loopMinutes,
        });
        this.ramp.begin(atTime);
        this.updateLoopPhraseText();
        this.state.bpm = this.ramp.start;
        this.scheduler.setBpm(this.ramp.start);
        this.renderBpm();
        this.el.loopProgress.hidden = false;
        const pendingBeats = this.pendingSpeedLoopBeats;
        this.pendingSpeedLoopBeats = [];
        pendingBeats.forEach(({ time, beatsPerBar }) => this.advanceSpeedLoop(time, beatsPerBar));
      } else {
        this.pendingSpeedLoopBeats = [];
        this.el.phraseLabel.hidden = true;
        this.el.loopProgress.hidden = true;
      }

      if (this.state.timerEnabled) {
        this.timerEndTime = atTime + this.state.timerMinutes * 60;
      } else {
        this.timerEndTime = null;
      }

      if (!this.scheduler.running) {
        this.scheduler.start(atTime);
      }
    }

    currentBpm() {
      if (this.state.mode === MODES.SPEEDLOOP) {
        return clamp(this.state.loopStart, CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      }
      return this.state.bpm;
    }

    handleScheduledBeat(time, beatsPerBar) {
      if (this.state.mode !== MODES.SPEEDLOOP) return;

      if (this.phase === "countin" && time >= this.countInEndTime) {
        this.pendingSpeedLoopBeats.push({ time, beatsPerBar });
        return;
      }
      if (this.phase !== "playing" || time < this.sessionStartTime) return;

      this.advanceSpeedLoop(time, beatsPerBar);
    }

    advanceSpeedLoop(time, beatsPerBar) {
      this.speedLoopBeatCount += 1;
      const beatsPerPhrase = beatsPerBar * this.state.loopBars;
      if (this.speedLoopBeatCount <= 1 || (this.speedLoopBeatCount - 1) % beatsPerPhrase !== 0) return;

      const { bpm } = this.ramp.sample(time);
      if (bpm !== this.state.bpm) {
        this.state.bpm = bpm;
        this.scheduler.setBpm(bpm);
        this.renderBpm();
      }
    }

    updatePhraseIndicator(beatIndex, time) {
      if (
        this.phase !== "playing" ||
        this.state.mode !== MODES.SPEEDLOOP ||
        time < this.sessionStartTime ||
        beatIndex !== 0
      ) return;
      this.speedLoopBar = (this.speedLoopBar % this.state.loopBars) + 1;
      this.el.phraseLabel.textContent = `Bar ${this.speedLoopBar} of ${this.state.loopBars}`;
    }

    nextSpeedLoopBpm(now) {
      if (this.speedLoopBeatCount < 1) return this.ramp.sample(now).bpm;
      const phraseBeats = this.state.beatsPerBar * this.state.loopBars;
      const beatsUntilBoundary = phraseBeats - ((this.speedLoopBeatCount - 1) % phraseBeats);
      const boundaryTime = this.scheduler.nextNoteTime +
        (beatsUntilBoundary - 1) * (60 / Math.max(CONFIG.MIN_BPM, this.state.bpm));
      return this.ramp.sample(Math.max(now, boundaryTime)).bpm;
    }

    stop({ preserveReadout = false } = {}) {
      this.running = false;
      this.updateTempoControlAvailability();
      this.releaseWakeLock();
      this.phase = "idle";
      this.pendingSpeedLoopBeats = [];
      this.el.phraseLabel.hidden = true;
      this.scheduler.stop();
      this.visualizer.clear();
      this.el.playBtn.classList.remove("running");
      this.el.playBtn.setAttribute("aria-pressed", "false");
      this.el.playLabel.textContent = "Start";
      this.el.loopProgress.hidden = true;
      this.el.progressFill.style.width = "0%";
      this.el.progressTrack.setAttribute("aria-valuenow", "0");
      this.el.progressText.textContent = "0%";
      if (!preserveReadout) {
        this.el.readout.classList.remove("alert");
        this.el.readout.textContent = "";
      }
      this.setStatus("");
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.timerEndTime = null;
      this.countInEndTime = null;
      this.persist();
    }

    /* -------------------- Frame loop (UI sync only) -------------------- */
    startFrameLoop() {
      if (this.rafId) return;
      const frame = () => {
        if (!this.running) {
          this.rafId = null;
          return;
        }
        this.updateFrame();
        this.rafId = requestAnimationFrame(frame);
      };
      this.rafId = requestAnimationFrame(frame);
    }

    updateFrame() {
      const now = this.engine.now;

      // Speed loop: drive tempo from the audio clock.
      if (this.phase === "playing" && this.state.mode === MODES.SPEEDLOOP) {
        const { progress, rampDone } = this.ramp.sample(now);
        const pct = Math.round(progress * 100);
        this.el.progressFill.style.width = `${pct}%`;
        this.el.progressTrack.setAttribute("aria-valuenow", String(pct));
        this.el.progressText.textContent = rampDone
          ? this.state.bpm === this.ramp.target
            ? `${this.state.bpm} BPM · target reached, holding`
            : `${this.state.bpm} BPM now · next phrase ${this.nextSpeedLoopBpm(now)} BPM`
          : `${this.state.bpm} BPM now · next phrase ${this.nextSpeedLoopBpm(now)} BPM · ${pct}% · ${formatTime(this.ramp.durationSec - (now - this.ramp.startedAt))} left`;
        // Ramp finishes and holds at target indefinitely; no stop.
      }

      // Practice timer.
      if (this.phase === "playing" && this.timerEndTime !== null) {
        const remaining = this.timerEndTime - now;
        this.el.readout.textContent = `Time left ${formatTime(remaining)}`;
        if (remaining <= 0 && !this.alertShown) {
          this.alertShown = true;
          this.fireTimerAlert(now);
          this.stop({ preserveReadout: true });
        }
      } else if (this.phase === "playing" && this.state.mode === MODES.SPEEDLOOP) {
        // Show elapsed time in speed loop mode.
        const elapsed = now - this.sessionStartTime;
        this.el.readout.textContent = `Elapsed ${formatTime(elapsed)}`;
      } else {
        this.el.readout.textContent = "";
      }
    }

    fireTimerAlert(now) {
      // Audio alert: three tones scheduled on the audio clock.
      this.engine.scheduleAlert(now + 0.0, 880, 0.3);
      this.engine.scheduleAlert(now + 0.4, 880, 0.3);
      this.engine.scheduleAlert(now + 0.8, 1100, 0.5);
      this.el.readout.textContent = "Practice time complete";
      this.el.readout.classList.add("alert");
      this.setStatus("");
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }

    async acquireWakeLock() {
      if (!this.state.wakeLockEnabled || !this.running || !("wakeLock" in navigator) || this.wakeLock || this.wakeLockPending) return;
      this.wakeLockPending = true;
      try {
        this.wakeLock = await navigator.wakeLock.request("screen");
        this.wakeLockPending = false;
        if (!this.running || !this.state.wakeLockEnabled) {
          this.releaseWakeLock();
          return;
        }
        this.wakeLock.addEventListener("release", () => {
          this.wakeLock = null;
          if (this.running && this.state.wakeLockEnabled && !document.hidden) {
            this.el.wakeLockStatus.textContent = "Screen may dim while the metronome continues.";
          }
        }, { once: true });
        this.el.wakeLockStatus.textContent = "Screen will stay awake during playback.";
      } catch (error) {
        this.wakeLockPending = false;
        console.warn("Screen wake lock could not be acquired.", error);
        this.el.wakeLockStatus.textContent = "Could not keep the screen awake. Playback will continue normally.";
      }
    }

    releaseWakeLock() {
      if (!this.wakeLock) return;
      const wakeLock = this.wakeLock;
      this.wakeLock = null;
      wakeLock.release().catch((error) => console.warn("Screen wake lock could not be released.", error));
      this.el.wakeLockStatus.textContent = "";
    }

    setStatus(text) {
      this.el.statusLine.textContent = text;
    }

    updateLoopPhraseText() {
      this.el.loopHint.textContent = `Ramp duration is approximate; tempo updates every ${this.state.loopBars} ${this.state.loopBars === 1 ? "bar" : "bars"}.`;
      if (this.state.mode === MODES.SPEEDLOOP && this.phase === "playing") {
        this.el.phraseLabel.textContent = `Bar ${Math.min(this.speedLoopBar || 1, this.state.loopBars)} of ${this.state.loopBars}`;
      }
    }
  }

  /* ============================================================
   * Boot
   * ============================================================ */
  const boot = () => {
    try {
      window.metronome = new MetronomeApp();
    } catch (err) {
      console.error(err);
      const line = document.getElementById("statusLine");
      if (line) line.textContent = "Could not initialize the app.";
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

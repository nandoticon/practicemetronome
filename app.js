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
    CLICK_PEAK_SUB: 0.28,
    TAP_WINDOW_MS: 2000,       // taps older than this reset the sequence
    TAP_MAX_SAMPLES: 6,
    TAP_MIN_SAMPLES: 2,
    COUNTIN_LABEL_MS: 0,
  });

  const MODES = Object.freeze({ METRONOME: "metronome", SPEEDLOOP: "speedloop", ENDURANCE: "endurance" });

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
    const format = new Intl.NumberFormat(window.MetronomeI18n?.language || "en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    return `${format.format(m)}:${format.format(r)}`;
  };
  const t = (key, params) => window.MetronomeI18n.translate(key, params);
  const { SpeedRamp, SpeedLoopCadence, EnduranceWorkout, initialBpm, practiceTimerEnd } = window.MetronomeTiming;
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
      this.container.style.setProperty("--beat-count", String(count));
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
      this.container.setAttribute("aria-label", t("beat", { current: index + 1, total: this.dots.length }));
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
   * Application controller
   * ============================================================ */
  class MetronomeApp {
    constructor() {
      this.state = window.MetronomeStorage.load();
      this.engine = new AudioEngine();

      // DOM refs
      this.el = {
        bpmValue: document.getElementById("bpmValue"),
        tempoTitle: document.getElementById("tempoTitle"),
        loopTempoContext: document.getElementById("loopTempoContext"),
        slider: document.getElementById("tempoSlider"),
        minus5: document.getElementById("minus5"),
        minus1: document.getElementById("minus1"),
        plus1: document.getElementById("plus1"),
        plus5: document.getElementById("plus5"),
        playBtn: document.getElementById("playBtn"),
        playLabel: document.getElementById("playLabel"),
        tapBtn: document.getElementById("tapBtn"),
        consoleActions: document.querySelector(".console-actions"),
        stickyPlayback: document.getElementById("stickyPlayback"),
        stickyPlayBtn: document.getElementById("stickyPlayBtn"),
        stickyPlayLabel: document.getElementById("stickyPlayLabel"),
        stickyTapBtn: document.getElementById("stickyTapBtn"),
        beatRow: document.getElementById("beatRow"),
        meterLabel: document.getElementById("meterLabel"),
        statusLine: document.getElementById("statusLine"),
        readout: document.getElementById("readout"),
        beatsPerBar: document.getElementById("beatsPerBar"),
        timerEnabled: document.getElementById("timerEnabled"),
        timerFields: document.getElementById("timerFields"),
        timerMinutes: document.getElementById("timerMinutes"),
        clickTone: document.getElementById("clickTone"),
        subdivisions: document.getElementById("subdivisions"),
        accentPattern: document.getElementById("accentPattern"),
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
        enduranceFields: document.getElementById("enduranceFields"),
        endurancePracticeSeconds: document.getElementById("endurancePracticeSeconds"),
        enduranceRestSeconds: document.getElementById("enduranceRestSeconds"),
        enduranceSessions: document.getElementById("enduranceSessions"),
        enduranceProgress: document.getElementById("enduranceProgress"),
        enduranceCommand: document.getElementById("enduranceCommand"),
        enduranceStage: document.getElementById("enduranceStage"),
        enduranceCountdown: document.getElementById("enduranceCountdown"),
        progressElapsed: document.getElementById("progressElapsed"),
        enduranceProgressFill: document.getElementById("enduranceProgressFill"),
        enduranceProgressTrack: document.getElementById("enduranceProgressTrack"),
        timerOption: document.querySelector(".timer-option"),
        progressFill: document.getElementById("progressFill"),
        progressTrack: document.getElementById("progressTrack"),
        progressText: document.getElementById("progressText"),
        phraseLabel: document.getElementById("phraseLabel"),
        metronomePanel: document.getElementById("metronomePanel"),
        wakeLockEnabled: document.getElementById("wakeLockEnabled"),
        wakeLockStatus: document.getElementById("wakeLockStatus"),
        settingsHint: document.getElementById("settingsHint"),
        themeSelect: document.getElementById("themeSelect"),
        languageSelect: document.getElementById("languageSelect"),
        historyList: document.getElementById("historyList"),
        historyEmpty: document.getElementById("historyEmpty"),
        historyClear: document.getElementById("historyClear"),
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
      this.speedLoopCadence = new SpeedLoopCadence(this.state.loopBars);
      this.enduranceWorkout = null;

      this.running = false;
      this.phase = "idle";          // idle | countin | playing
      this.sessionStartTime = 0;    // audio-clock time main session started
      this.speedLoopBar = 0;
      this.pendingSpeedLoopBeats = [];
      this.timerEndTime = null;     // audio-clock time when timer expires
      this.countInEndTime = null;
      this.wakeLock = null;
      this.wakeLockPending = false;
      this.wakeLockMessageKey = "";
      this.statusMessageKey = "";
      this.statusMessageParams = {};
      this.rafId = null;
      this.alertShown = false;
      this.sessionLogged = false;
      this.bindEvents();
      this.observePlaybackControls();
      this.applyStateToUI();
      this.applyTheme(this.state.theme);
      this.applyLanguage(this.state.language);
      this.bindColorScheme();
      this.visualizer.rebuild(this.state.beatsPerBar);
      this.updateBeatCounter();
      this.renderHistory();
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
      e.stickyPlayBtn.addEventListener("click", () => e.playBtn.click());
      e.stickyTapBtn.addEventListener("click", () => e.tapBtn.click());
      e.themeSelect.addEventListener("change", () => {
        this.state.theme = e.themeSelect.value;
        this.applyTheme(this.state.theme);
        this.persist();
      });
      e.languageSelect.addEventListener("change", () => {
        this.state.language = e.languageSelect.value;
        this.applyLanguage(this.state.language);
        this.persist();
      });
      e.historyClear.addEventListener("click", () => {
        window.MetronomeStorage.clearSessions();
        this.renderHistory();
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

      e.subdivisions.addEventListener("change", () => {
        this.state.subdivisions = Number(e.subdivisions.value);
        this.scheduler.setSubdivisions(this.state.subdivisions);
        this.persist();
      });

      e.accentPattern.addEventListener("change", () => {
        this.state.accentPattern = e.accentPattern.value;
        this.scheduler.setAccentPattern(this.state.accentPattern);
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
          if (key === "loopStart") this.updateLoopTempoContext();
          this.persist();
        });
      });

      const enduranceInputs = [
        [e.endurancePracticeSeconds, "endurancePracticeSeconds", 1, 3600],
        [e.enduranceRestSeconds, "enduranceRestSeconds", 0, 3600],
        [e.enduranceSessions, "enduranceSessions", 1, 99],
      ];
      enduranceInputs.forEach(([input, key, min, max]) => {
        input.addEventListener("change", () => {
          this.state[key] = clamp(toInt(input.value, this.state[key]), min, max);
          input.value = this.state[key];
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
        if (document.hidden) this.handlePlaybackInterruption();
      });
      window.addEventListener("pagehide", () => this.handlePlaybackInterruption());
    }

    /* -------------------- UI application -------------------- */
    applyStateToUI() {
      const s = this.state;
      this.el.beatsPerBar.value = String(s.beatsPerBar);
      this.el.timerEnabled.checked = s.timerEnabled;
      this.el.timerFields.hidden = !s.timerEnabled;
      this.el.timerMinutes.value = s.timerMinutes;
      this.el.clickTone.value = s.clickTone;
      this.el.subdivisions.value = String(s.subdivisions);
      this.el.accentPattern.value = s.accentPattern;
      this.el.volume.value = String(s.volume);
      this.el.volumeValue.value = `${Math.round(s.volume * 100)}%`;
      this.engine.setClickTone(s.clickTone);
      this.engine.setVolume(s.volume);
      this.el.countdownEnabled.checked = s.countdownEnabled;
      this.el.countdownFields.hidden = !s.countdownEnabled;
      this.el.countdownBeats.value = String(s.countdownBeats);
      this.el.wakeLockEnabled.checked = s.wakeLockEnabled;
      this.el.wakeLockEnabled.disabled = this.running || !("wakeLock" in navigator);
      if (!("wakeLock" in navigator)) this.setWakeLockStatus("screenLockUnsupported");
      this.el.loopStart.value = s.loopStart;
      this.el.loopTarget.value = s.loopTarget;
      this.el.loopMinutes.value = s.loopMinutes;
      this.el.loopBars.value = s.loopBars;
      this.el.endurancePracticeSeconds.value = s.endurancePracticeSeconds;
      this.el.enduranceRestSeconds.value = s.enduranceRestSeconds;
      this.el.enduranceSessions.value = s.enduranceSessions;
      this.updateLoopPhraseText();

      this.scheduler.setBpm(s.bpm);
      this.scheduler.setBeatsPerBar(s.beatsPerBar);
      this.scheduler.setSubdivisions(s.subdivisions);
      this.scheduler.setAccentPattern(s.accentPattern);
      this.renderBpm();
      this.setMode(s.mode, { persistChange: false });
    }

    applyTheme(theme) {
      const value = ["system", "light", "dark"].includes(theme) ? theme : "system";
      this.el.themeSelect.value = value;
      if (value === "system") delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = value;
      const systemLight = window.matchMedia?.("(prefers-color-scheme: light)").matches ?? false;
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content",
        (value === "light" || (value === "system" && systemLight)) ? "#f3f5f8" : "#101114"
      );
    }

    applyLanguage(language) {
      this.state.language = window.MetronomeI18n.setLanguage(language);
      this.el.languageSelect.value = this.state.language;
      this.el.playLabel.textContent = t(this.running ? "stop" : "start");
      this.setStatus(this.statusMessageKey, this.statusMessageParams);
      this.setWakeLockStatus(this.wakeLockMessageKey);
      this.updateTempoControlAvailability();
      this.el.tempoTitle.textContent = t(this.state.mode === MODES.SPEEDLOOP ? "manualTempo" : "tempo");
      this.updateLoopTempoContext();
      this.updateLoopPhraseText();
      this.renderBpm();
      this.renderHistory();
      if (this.el.readout.classList.contains("alert")) {
        this.el.readout.textContent = t(this.state.mode === MODES.ENDURANCE
          ? "enduranceComplete"
          : "practiceComplete");
        if (this.state.mode === MODES.ENDURANCE) {
          this.el.enduranceCommand.textContent = "";
          this.el.enduranceStage.textContent = t("enduranceComplete");
        }
      }
    }

    bindColorScheme() {
      const query = window.matchMedia?.("(prefers-color-scheme: light)");
      if (!query) return;
      const update = () => {
        if (this.state.theme === "system") this.applyTheme("system");
      };
      if (query.addEventListener) query.addEventListener("change", update);
      else query.addListener(update);
    }

    renderBpm() {
      const bpm = this.state.bpm;
      this.el.bpmValue.textContent = String(bpm);
      this.el.slider.value = String(bpm);
      const fill = ((bpm - CONFIG.MIN_BPM) / (CONFIG.MAX_BPM - CONFIG.MIN_BPM)) * 100;
      this.el.slider.style.setProperty("--fill", `${fill}%`);
      this.el.slider.setAttribute("aria-valuetext", t("bpmAccessible", { bpm }));
    }

    updateTempoControlAvailability() {
      const locked = this.running && this.state.mode === MODES.SPEEDLOOP;
      [this.el.slider, this.el.minus5, this.el.minus1, this.el.plus1, this.el.plus5, this.el.tapBtn]
        .forEach((control) => { control.disabled = locked; });
      [
        this.el.beatsPerBar, this.el.timerEnabled, this.el.timerMinutes,
        this.el.clickTone, this.el.volume, this.el.countdownEnabled,
        this.el.countdownBeats, this.el.wakeLockEnabled, this.el.subdivisions,
        this.el.accentPattern, this.el.loopStart,
        this.el.loopTarget, this.el.loopMinutes, this.el.loopBars,
        this.el.endurancePracticeSeconds, this.el.enduranceRestSeconds, this.el.enduranceSessions,
      ].forEach((control) => { control.disabled = this.running; });
      this.el.wakeLockEnabled.disabled = this.running || !("wakeLock" in navigator);
      this.el.tabs.forEach((tab) => {
        tab.disabled = this.running;
        tab.title = this.running ? t("stopPlaybackToChangeMode") : "";
      });
      this.el.stickyPlayLabel.textContent = t(this.running ? "stop" : "start");
      this.el.stickyPlayBtn.classList.toggle("running", this.running);
      this.el.stickyPlayBtn.setAttribute("aria-pressed", String(this.running));
      this.el.stickyTapBtn.disabled = this.el.tapBtn.disabled;
      this.el.settingsHint.hidden = !this.running;
    }

    observePlaybackControls() {
      if (!("IntersectionObserver" in window) || !this.el.consoleActions) return;
      const mobile = window.matchMedia("(max-width: 759px)");
      let actionsVisible = true;
      const update = () => {
        const visible = mobile.matches && !actionsVisible;
        this.el.stickyPlayback.hidden = !visible;
        document.body.classList.toggle("has-sticky-playback", visible);
      };
      const observer = new IntersectionObserver(([entry]) => {
        actionsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        update();
      }, { threshold: [0, 0.25] });
      observer.observe(this.el.consoleActions);
      if (mobile.addEventListener) mobile.addEventListener("change", update);
      else mobile.addListener(update);
      update();
    }

    updateLoopTempoContext() {
      this.el.tempoTitle.textContent = t(this.state.mode === MODES.SPEEDLOOP ? "manualTempo" : "tempo");
      this.el.loopTempoContext.textContent = t("speedLoopTempoContext", { bpm: this.state.loopStart });
      this.el.loopTempoContext.hidden = this.state.mode !== MODES.SPEEDLOOP;
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
      this.el.metronomePanel.hidden = mode !== MODES.METRONOME;
      this.el.enduranceFields.hidden = mode !== MODES.ENDURANCE;
      this.el.loopProgress.hidden = mode !== MODES.SPEEDLOOP || this.phase !== "playing";
      this.el.enduranceProgress.hidden = mode !== MODES.ENDURANCE || !this.enduranceWorkout;
      this.el.timerOption.hidden = mode === MODES.ENDURANCE;
      this.el.timerFields.hidden = mode === MODES.ENDURANCE || !this.state.timerEnabled;
      this.updateLoopTempoContext();
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
      this.setStatus(bpm !== null ? "tapResult" : "keepTapping", bpm === null ? {} : { bpm });
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
          ? "audioUnsupported"
          : "audioStartFailed");
        return;
      }

      this.running = true;
      this.updateTempoControlAvailability();
      if (this.state.wakeLockEnabled) this.acquireWakeLock();
      this.alertShown = false;
      this.el.readout.classList.remove("alert");
      this.el.readout.textContent = "";
      if (this.state.mode === MODES.ENDURANCE) {
        this.el.enduranceProgress.hidden = true;
        this.el.enduranceProgressFill.style.width = "0%";
        this.el.enduranceProgressTrack.setAttribute("aria-valuenow", "0");
      }
      this.el.playBtn.setAttribute("aria-pressed", "true");
      this.el.playBtn.classList.add("running");
      this.tap.reset();

      const now = this.engine.now;
      const leadIn = 0.08;
      const useCountIn = this.state.countdownEnabled;

      this.scheduler.setBeatsPerBar(this.state.beatsPerBar);
      this.scheduler.setSubdivisions(this.state.subdivisions);
      this.scheduler.setAccentPattern(this.state.accentPattern);
      this.state.bpm = initialBpm(this.state.mode, this.state.bpm, this.state.loopStart);
      this.scheduler.setBpm(this.state.bpm);
      this.renderBpm();

      if (useCountIn) {
        this.phase = "countin";
        const beats = this.state.countdownBeats;
        const spb = 60 / this.currentBpm();
        this.countInEndTime = now + leadIn + beats * spb;
        this.setStatus("countInStatus");
        this.el.playLabel.textContent = t("stop");
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
        this.setStatus("countInRemaining", { count: remaining });
        setTimeout(update, 40);
      };
      update();
    }

    beginMainSession(atTime) {
      this.phase = "playing";
      this.sessionStartTime = atTime;
      this.sessionStartedBpm = this.state.bpm;
      this.sessionLogged = false;
      this.setStatus("");
      this.el.playLabel.textContent = t("stop");

      const mode = this.state.mode;
      if (mode === MODES.SPEEDLOOP) {
        this.speedLoopCadence.reset(this.state.loopBars);
        this.speedLoopBar = 0;
        this.el.phraseLabel.hidden = false;
        this.el.phraseLabel.textContent = t("bar", { current: 1, total: this.state.loopBars });
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
      } else if (mode === MODES.ENDURANCE) {
        this.el.phraseLabel.hidden = true;
        this.el.loopProgress.hidden = true;
        this.enduranceWorkout = new EnduranceWorkout({
          practiceSeconds: this.state.endurancePracticeSeconds,
          restSeconds: this.state.enduranceRestSeconds,
          sessions: this.state.enduranceSessions,
        });
        this.el.enduranceProgress.hidden = false;
        this.enduranceWorkout.start(atTime);
        this.startEndurancePractice(atTime);
        this.playEnduranceCue("practice", atTime);
      } else {
        this.pendingSpeedLoopBeats = [];
        this.el.phraseLabel.hidden = true;
        this.el.loopProgress.hidden = true;
      }

      this.timerEndTime = mode === MODES.ENDURANCE
        ? null
        : practiceTimerEnd(atTime, this.state.timerEnabled, this.state.timerMinutes);

      if (mode !== MODES.ENDURANCE && !this.scheduler.running) {
        this.scheduler.start(atTime);
      }
    }

    startEndurancePractice(atTime) {
      const continueCountIn = this.scheduler.running && this.phase === "playing";
      this.phase = "playing";
      this.scheduler.setBpm(this.state.bpm);
      if (continueCountIn) {
        this.scheduler.setStopAt(this.enduranceWorkout.phaseEndsAt);
      } else {
        this.scheduler.stop();
        this.visualizer.clear();
        this.scheduler.start(atTime, this.enduranceWorkout.phaseEndsAt);
      }
      this.updateEnduranceDisplay(atTime);
    }

    playEnduranceCue(phase, atTime) {
      this.engine.scheduleCue(atTime, phase === "rest" ? 440 : 880);
    }

    updateEnduranceDisplay(now) {
      if (!this.enduranceWorkout) return;
      const workout = this.enduranceWorkout;
      const remaining = Math.max(0, workout.phaseEndsAt - now);
      const phaseSeconds = workout.phase === "rest"
        ? workout.restSeconds
        : workout.practiceSeconds;
      const phaseElapsed = Math.min(phaseSeconds, Math.max(0, phaseSeconds - remaining));
      const completedSeconds = (workout.currentSession - 1) *
        (workout.practiceSeconds + workout.restSeconds) +
        (workout.phase === "rest" ? workout.practiceSeconds + phaseElapsed : phaseElapsed);
      const totalSeconds = workout.sessions * workout.practiceSeconds +
        (workout.sessions - 1) * workout.restSeconds;
      const percent = Math.round(Math.min(1, completedSeconds / totalSeconds) * 100);
      this.el.enduranceCommand.textContent = t(workout.phase === "rest"
        ? "enduranceRestNow"
        : "endurancePracticeNow");
      this.el.enduranceStage.textContent = t(workout.phase === "rest"
        ? "enduranceRestStatus"
        : "endurancePracticeStatus", {
        current: workout.currentSession,
        total: workout.sessions,
      });
      this.el.enduranceCountdown.textContent = t("timeLeft", { time: formatTime(remaining) });
      this.el.enduranceProgress.dataset.phase = workout.phase;
      this.el.enduranceProgressFill.style.width = `${percent}%`;
      this.el.enduranceProgressTrack.setAttribute("aria-valuenow", String(percent));
    }

    currentBpm() {
      return initialBpm(this.state.mode, this.state.bpm, this.state.loopStart);
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
      if (!this.speedLoopCadence.advance(beatsPerBar)) return;

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
      this.speedLoopBar = this.speedLoopCadence.bar;
      this.el.phraseLabel.textContent = t("bar", { current: this.speedLoopBar, total: this.state.loopBars });
    }

    nextSpeedLoopBpm(now) {
      if (this.speedLoopCadence.beatCount < 1) return this.ramp.sample(now).bpm;
      const phraseBeats = this.state.beatsPerBar * this.state.loopBars;
      const beatsUntilBoundary = phraseBeats - ((this.speedLoopCadence.beatCount - 1) % phraseBeats);
      const boundaryTime = this.scheduler.nextNoteTime +
        (beatsUntilBoundary - 1) * (60 / Math.max(CONFIG.MIN_BPM, this.state.bpm));
      return this.ramp.sample(Math.max(now, boundaryTime)).bpm;
    }

    stop({ preserveReadout = false } = {}) {
      this.recordSession(false);
      this.running = false;
      this.updateTempoControlAvailability();
      this.releaseWakeLock();
      this.phase = "idle";
      this.enduranceWorkout = null;
      this.pendingSpeedLoopBeats = [];
      this.el.phraseLabel.hidden = true;
      this.scheduler.stop();
      this.visualizer.clear();
      this.el.playBtn.classList.remove("running");
      this.el.playBtn.setAttribute("aria-pressed", "false");
      this.el.playLabel.textContent = t("start");
      this.el.loopProgress.hidden = true;
      this.el.progressFill.style.width = "0%";
      this.el.progressTrack.setAttribute("aria-valuenow", "0");
      this.el.progressText.textContent = "0%";
      if (this.state.mode === MODES.ENDURANCE) {
        if (preserveReadout) {
          this.el.enduranceCommand.textContent = "";
          this.el.enduranceStage.textContent = t("enduranceComplete");
          this.el.enduranceCountdown.textContent = "";
          this.el.enduranceProgressFill.style.width = "100%";
          this.el.enduranceProgressTrack.setAttribute("aria-valuenow", "100");
        } else {
          this.el.enduranceProgress.hidden = true;
          this.el.enduranceProgressFill.style.width = "0%";
          this.el.enduranceProgressTrack.setAttribute("aria-valuenow", "0");
        }
      }
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

    handlePlaybackInterruption() {
      if (!this.running) return;
      this.recordSession(true);
      this.running = false;
      this.phase = "idle";
      this.enduranceWorkout = null;
      this.scheduler.stop();
      this.visualizer.clear();
      this.pendingSpeedLoopBeats = [];
      this.releaseWakeLock();
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.el.playBtn.classList.remove("running");
      this.el.playBtn.setAttribute("aria-pressed", "false");
      this.el.playLabel.textContent = t("start");
      this.el.phraseLabel.hidden = true;
      this.el.loopProgress.hidden = true;
      this.el.enduranceProgress.hidden = true;
      this.countInEndTime = null;
      this.timerEndTime = null;
      this.updateTempoControlAvailability();
      this.setStatus("sessionInterrupted");
      this.persist();
      if (this.engine.ctx?.state === "running") {
        this.engine.ctx.suspend().catch((error) => {
          console.warn("Audio could not suspend after the app was hidden.", error);
        });
      }
    }

    recordSession(interrupted) {
      if ((this.phase !== "playing" && this.phase !== "resting") || this.sessionLogged) return;
      const endedAt = this.engine.now;
      const sessions = window.MetronomeStorage.saveSession({
        startedAt: Date.now() - Math.max(0, endedAt - this.sessionStartTime) * 1000,
        durationSec: Math.max(0, endedAt - this.sessionStartTime),
        mode: this.state.mode,
        startBpm: this.sessionStartedBpm,
        endBpm: this.state.bpm,
        interrupted,
      });
      this.sessionLogged = true;
      this.renderHistory(sessions);
    }

    renderHistory(sessions = window.MetronomeStorage.loadSessions()) {
      this.el.historyList.textContent = "";
      this.el.historyEmpty.hidden = sessions.length > 0;
      this.el.historyClear.hidden = sessions.length === 0;
      sessions.forEach((session) => {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        const details = document.createElement("span");
        const date = new Date(session.startedAt);
        const duration = formatTime(session.durationSec);
        const mode = t(session.mode === MODES.SPEEDLOOP
          ? "speedLoop"
          : session.mode === MODES.ENDURANCE ? "enduranceTraining" : "metronome");
        title.textContent = t("historyEntry", { mode, start: session.startBpm, end: session.endBpm });
        details.textContent = `${date.toLocaleString(this.state.language)} · ${duration}${session.interrupted ? ` · ${t("interrupted")}` : ""}`;
        item.append(title, details);
        this.el.historyList.appendChild(item);
      });
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
            ? t("rampTargetReached", { bpm: this.state.bpm })
            : t("rampNextPhrase", { bpm: this.state.bpm, next: this.nextSpeedLoopBpm(now) })
          : t("rampProgressText", {
            bpm: this.state.bpm,
            next: this.nextSpeedLoopBpm(now),
            percent: pct,
            time: formatTime(this.ramp.durationSec - (now - this.ramp.startedAt)),
          });
        this.el.progressElapsed.textContent = t("elapsed", {
          time: formatTime(now - this.sessionStartTime),
        });
        // Ramp finishes and holds at target indefinitely; no stop.
      }

      if (
        this.state.mode === MODES.ENDURANCE &&
        (this.phase === "playing" || this.phase === "resting") &&
        this.enduranceWorkout
      ) {
        const transition = this.enduranceWorkout.advance(now);
        if (transition === "rest") {
          this.phase = "resting";
          this.scheduler.stop();
          this.visualizer.clear();
          this.playEnduranceCue("rest", now);
        } else if (transition === "practice") {
          const nextStart = now + 0.05;
          this.enduranceWorkout.phaseEndsAt += 0.05;
          this.startEndurancePractice(nextStart);
          this.playEnduranceCue("practice", nextStart);
        } else if (transition === "complete") {
          this.recordSession(false);
          this.alertShown = true;
          this.fireTimerAlert(now, "enduranceComplete");
          this.stop({ preserveReadout: true });
          return;
        }
        this.updateEnduranceDisplay(now);
        return;
      }

      // Practice timer.
      if (this.phase === "playing" && this.timerEndTime !== null) {
        const remaining = this.timerEndTime - now;
        this.el.readout.textContent = t("timeLeft", { time: formatTime(remaining) });
        if (remaining <= 0 && !this.alertShown) {
          this.alertShown = true;
          this.fireTimerAlert(now);
          this.stop({ preserveReadout: true });
        }
      } else {
        this.el.readout.textContent = "";
      }
    }

    fireTimerAlert(now, messageKey = "practiceComplete") {
      // Audio alert: three tones scheduled on the audio clock.
      this.engine.scheduleAlert(now + 0.0, 880, 0.3);
      this.engine.scheduleAlert(now + 0.4, 880, 0.3);
      this.engine.scheduleAlert(now + 0.8, 1100, 0.5);
      this.el.readout.textContent = t(messageKey);
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
            this.setWakeLockStatus("screenMayDim");
          }
        }, { once: true });
        this.setWakeLockStatus("screenWillStayAwake");
      } catch (error) {
        this.wakeLockPending = false;
        console.warn("Screen wake lock could not be acquired.", error);
        this.setWakeLockStatus("screenLockFailed");
      }
    }

    releaseWakeLock() {
      if (!this.wakeLock) return;
      const wakeLock = this.wakeLock;
      this.wakeLock = null;
      wakeLock.release().catch((error) => console.warn("Screen wake lock could not be released.", error));
      this.setWakeLockStatus("");
    }

    setWakeLockStatus(key) {
      this.wakeLockMessageKey = key;
      this.el.wakeLockStatus.textContent = key ? t(key) : "";
    }

    setStatus(key, params = {}) {
      this.statusMessageKey = key;
      this.statusMessageParams = params;
      this.el.statusLine.textContent = key ? t(key, params) : "";
    }

    updateLoopPhraseText() {
      this.el.loopHint.textContent = t("rampHint", {
        count: this.state.loopBars,
        unit: t(this.state.loopBars === 1 ? "barUnit" : "barsUnit"),
      });
      if (this.state.mode === MODES.SPEEDLOOP && this.phase === "playing") {
        this.el.phraseLabel.textContent = t("bar", {
          current: Math.min(this.speedLoopBar || 1, this.state.loopBars),
          total: this.state.loopBars,
        });
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
      if (line) line.textContent = window.MetronomeI18n.translate("appInitFailed");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

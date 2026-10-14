(() => {
  "use strict";

  const KEY = "metronome.settings.v1";
  const HISTORY_KEY = "metronome.sessions.v1";
  const WAIT_MS = 250;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const defaults = Object.freeze({
    bpm: 120,
    beatsPerBar: 4,
    mode: "metronome",
    timerEnabled: false,
    timerMinutes: 5,
    countdownEnabled: false,
    countdownBeats: 4,
    loopStart: 60,
    loopTarget: 120,
    loopMinutes: 10,
    loopBars: 4,
    volume: 0.65,
    clickTone: "classic",
    wakeLockEnabled: false,
    theme: "dark",
    subdivisions: 1,
    accentPattern: "downbeat",
  });
  const validTones = new Set(["soft", "classic", "bright"]);
  const validAccents = new Set(["downbeat", "backbeat", "every", "none"]);
  let saveTimer = 0;

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...defaults };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { ...defaults };
      const number = (key, min, max) => {
        if (parsed[key] === undefined || parsed[key] === null || parsed[key] === "") return defaults[key];
        const value = Number(parsed[key]);
        return Number.isFinite(value) ? clamp(value, min, max) : defaults[key];
      };
      return {
        bpm: Math.round(number("bpm", 30, 300)),
        beatsPerBar: [2, 3, 4, 5, 6, 7, 8].includes(Number(parsed.beatsPerBar)) ? Number(parsed.beatsPerBar) : defaults.beatsPerBar,
        mode: ["metronome", "speedloop"].includes(parsed.mode) ? parsed.mode : defaults.mode,
        timerEnabled: typeof parsed.timerEnabled === "boolean" ? parsed.timerEnabled : defaults.timerEnabled,
        timerMinutes: Math.round(number("timerMinutes", 1, 180)),
        countdownEnabled: typeof parsed.countdownEnabled === "boolean" ? parsed.countdownEnabled : defaults.countdownEnabled,
        countdownBeats: [4, 8].includes(Number(parsed.countdownBeats)) ? Number(parsed.countdownBeats) : defaults.countdownBeats,
        loopStart: Math.round(number("loopStart", 30, 300)),
        loopTarget: Math.round(number("loopTarget", 30, 300)),
        loopMinutes: Math.round(number("loopMinutes", 1, 120)),
        loopBars: Math.round(number("loopBars", 1, 32)),
        volume: number("volume", 0, 1),
        clickTone: validTones.has(parsed.clickTone) ? parsed.clickTone : defaults.clickTone,
        wakeLockEnabled: typeof parsed.wakeLockEnabled === "boolean" ? parsed.wakeLockEnabled : defaults.wakeLockEnabled,
        theme: ["system", "dark", "light"].includes(parsed.theme) ? parsed.theme : defaults.theme,
        subdivisions: [1, 2, 4].includes(Number(parsed.subdivisions)) ? Number(parsed.subdivisions) : defaults.subdivisions,
        accentPattern: validAccents.has(parsed.accentPattern) ? parsed.accentPattern : defaults.accentPattern,
      };
    } catch {
      return { ...defaults };
    }
  };

  const save = (state) => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {
        /* Storage may be unavailable or full. */
      }
    }, WAIT_MS);
  };

  const loadSessions = () => {
    try {
      const sessions = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (!Array.isArray(sessions)) return [];
      return sessions.filter((session) =>
        session &&
        Number.isFinite(session.startedAt) &&
        Number.isFinite(session.durationSec) &&
        Number.isFinite(session.startBpm) &&
        Number.isFinite(session.endBpm) &&
        typeof session.mode === "string"
      ).slice(0, 10);
    } catch {
      return [];
    }
  };

  const saveSession = (session) => {
    try {
      const sessions = [session, ...loadSessions()].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions));
      return sessions;
    } catch {
      return loadSessions();
    }
  };

  const clearSessions = () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      return false;
    }
    return true;
  };

  const api = { load, save, loadSessions, saveSession, clearSessions };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.MetronomeStorage = Object.freeze(api);
})();

;
(() => {
  "use strict";

  const createMetronomeAudio = ({ CONFIG, clamp }) => {
    const tones = Object.freeze({
      soft: { type: "sine", down: 950, up: 650 },
      classic: { type: "sine", down: CONFIG.CLICK_FREQ_DOWN, up: CONFIG.CLICK_FREQ_UP },
      bright: { type: "triangle", down: 2200, up: 1450 },
    });

    class AudioEngine {
      constructor() {
        this.ctx = null;
        this.master = null;
        this.volume = 0.65;
        this.clickTone = tones.classic;
      }

      setVolume(volume) {
        this.volume = clamp(volume, 0, 1);
        if (this.master) this.master.gain.setTargetAtTime(this.volume, this.now, 0.01);
      }

      setClickTone(tone) {
        this.clickTone = tones[tone] ?? tones.classic;
      }

      ensure() {
        if (!this.ctx) {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          if (!Ctx) throw new Error("Web Audio API is not supported in this browser.");
          this.ctx = new Ctx({ latencyHint: "interactive" });
          this.master = this.ctx.createGain();
          this.master.gain.value = this.volume;
          this.master.connect(this.ctx.destination);
        }
        return this.ctx;
      }

      async resume() {
        const ctx = this.ensure();
        if (ctx.state === "suspended") await ctx.resume();
        return ctx;
      }

      get now() {
        return this.ctx ? this.ctx.currentTime : 0;
      }

      scheduleClick(time, accent, isSubdivision = false) {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = this.clickTone.type;
        osc.frequency.setValueAtTime(accent ? this.clickTone.down : this.clickTone.up, time);

        const peak = isSubdivision ? CONFIG.CLICK_PEAK_SUB : accent ? CONFIG.CLICK_PEAK : CONFIG.CLICK_PEAK_UP;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(peak, time + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + CONFIG.CLICK_DURATION);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(time);
        osc.stop(time + CONFIG.CLICK_DURATION + 0.01);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      }

      scheduleAlert(time, freq = 880, duration = 0.25) {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.7, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(time);
        osc.stop(time + duration + 0.02);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      }
    }

    class Scheduler {
      constructor(engine, onBeat) {
        this.engine = engine;
        this.onBeat = onBeat;
        this.bpm = CONFIG.DEFAULT_BPM;
        this.beatsPerBar = CONFIG.DEFAULT_BEATS;
        this.nextNoteTime = 0;
        this.beatIndex = 0;
        this.timerId = null;
        this.running = false;
        this.subdivisions = 1;
        this.accentPattern = "downbeat";
      }

      get secondsPerBeat() {
        return 60 / this.bpm;
      }

      setBpm(bpm) {
        this.bpm = clamp(bpm, CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      }

      setBeatsPerBar(n) {
        this.beatsPerBar = n;
        if (this.beatIndex >= n) this.beatIndex = 0;
      }

      setSubdivisions(count) {
        this.subdivisions = count;
      }

      setAccentPattern(pattern) {
        this.accentPattern = pattern;
      }

      isAccented(beatIndex) {
        if (this.accentPattern === "every") return true;
        if (this.accentPattern === "backbeat") return beatIndex % 2 === 1;
        if (this.accentPattern === "none") return false;
        return beatIndex === 0;
      }

      start(startTime) {
        if (this.running) return;
        this.running = true;
        this.beatIndex = 0;
        this.nextNoteTime = startTime ?? this.engine.now + 0.05;
        this.tick();
        this.timerId = setInterval(() => this.tick(), CONFIG.SCHEDULER_INTERVAL);
      }

      stop() {
        this.running = false;
        if (this.timerId) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
      }

      tick() {
        if (!this.running) return;
        const horizon = this.engine.now + CONFIG.SCHEDULE_AHEAD;
        while (this.nextNoteTime < horizon) {
          const accent = this.isAccented(this.beatIndex);
          for (let subdivision = 0; subdivision < this.subdivisions; subdivision++) {
            const time = this.nextNoteTime + subdivision * this.secondsPerBeat / this.subdivisions;
            this.engine.scheduleClick(time, subdivision === 0 && accent, subdivision > 0);
          }
          this.onBeat(this.beatIndex, this.nextNoteTime, this.beatsPerBar);
          this.nextNoteTime += this.secondsPerBeat;
          this.beatIndex = (this.beatIndex + 1) % this.beatsPerBar;
        }
      }
    }

    return { AudioEngine, Scheduler };
  };
  if (typeof window !== "undefined") window.createMetronomeAudio = createMetronomeAudio;
  if (typeof module !== "undefined" && module.exports) module.exports = createMetronomeAudio;
})();

;
(() => {
  "use strict";

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  class SpeedRamp {
    constructor() {
      this.start = 120;
      this.target = 120;
      this.durationSec = 600;
      this.startedAt = 0;
    }

    configure({ start, target, minutes }) {
      this.start = clamp(start, 30, 300);
      this.target = clamp(target, 30, 300);
      this.durationSec = Math.max(1, minutes) * 60;
    }

    begin(atTime) {
      this.startedAt = atTime;
    }

    sample(atTime) {
      const elapsed = Math.max(0, atTime - this.startedAt);
      const progress = clamp(elapsed / this.durationSec, 0, 1);
      const bpm = this.start + (this.target - this.start) * progress;
      return { bpm: Math.round(bpm), progress, rampDone: progress >= 1 };
    }
  }

  class SpeedLoopCadence {
    constructor(bars = 4) {
      this.bars = bars;
      this.beatCount = 0;
      this.beatsPerBar = 4;
    }

    reset(bars = this.bars) {
      this.bars = bars;
      this.beatCount = 0;
    }

    advance(beatsPerBar) {
      this.beatsPerBar = beatsPerBar;
      this.beatCount += 1;
      const phraseBeats = beatsPerBar * this.bars;
      return this.beatCount > 1 && (this.beatCount - 1) % phraseBeats === 0;
    }

    get bar() {
      if (this.beatCount === 0) return 1;
      return Math.floor((this.beatCount - 1) / this.beatsPerBar) % this.bars + 1;
    }
  }

  const initialBpm = (mode, bpm, loopStart) =>
    mode === "speedloop" ? clamp(loopStart, 30, 300) : bpm;

  const practiceTimerEnd = (atTime, enabled, minutes) =>
    enabled ? atTime + Math.max(1, minutes) * 60 : null;

  const api = { SpeedRamp, SpeedLoopCadence, initialBpm, practiceTimerEnd };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.MetronomeTiming = api;
})();

;
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
  const { SpeedRamp, SpeedLoopCadence, initialBpm, practiceTimerEnd } = window.MetronomeTiming;
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
        progressFill: document.getElementById("progressFill"),
        progressTrack: document.getElementById("progressTrack"),
        progressText: document.getElementById("progressText"),
        phraseLabel: document.getElementById("phraseLabel"),
        metronomePanel: document.getElementById("metronomePanel"),
        wakeLockEnabled: document.getElementById("wakeLockEnabled"),
        wakeLockStatus: document.getElementById("wakeLockStatus"),
        settingsHint: document.getElementById("settingsHint"),
        themeSelect: document.getElementById("themeSelect"),
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

      this.running = false;
      this.phase = "idle";          // idle | countin | playing
      this.sessionStartTime = 0;    // audio-clock time main session started
      this.speedLoopBar = 0;
      this.pendingSpeedLoopBeats = [];
      this.timerEndTime = null;     // audio-clock time when timer expires
      this.countInEndTime = null;
      this.wakeLock = null;
      this.wakeLockPending = false;
      this.rafId = null;
      this.alertShown = false;
      this.sessionLogged = false;
      this.bindEvents();
      this.applyStateToUI();
      this.applyTheme(this.state.theme);
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
      e.themeSelect.addEventListener("change", () => {
        this.state.theme = e.themeSelect.value;
        this.applyTheme(this.state.theme);
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
      if (!("wakeLock" in navigator)) this.el.wakeLockStatus.textContent = "Screen wake lock is not supported by this browser.";
      this.el.loopStart.value = s.loopStart;
      this.el.loopTarget.value = s.loopTarget;
      this.el.loopMinutes.value = s.loopMinutes;
      this.el.loopBars.value = s.loopBars;
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
      this.el.slider.setAttribute("aria-valuetext", `${bpm} beats per minute`);
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
      this.el.metronomePanel.hidden = mode !== MODES.METRONOME;
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
      this.sessionStartedBpm = this.state.bpm;
      this.sessionLogged = false;
      this.setStatus("");
      this.el.playLabel.textContent = "Stop";

      const mode = this.state.mode;
      if (mode === MODES.SPEEDLOOP) {
        this.speedLoopCadence.reset(this.state.loopBars);
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

      this.timerEndTime = practiceTimerEnd(atTime, this.state.timerEnabled, this.state.timerMinutes);

      if (!this.scheduler.running) {
        this.scheduler.start(atTime);
      }
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
      this.el.phraseLabel.textContent = `Bar ${this.speedLoopBar} of ${this.state.loopBars}`;
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

    handlePlaybackInterruption() {
      if (!this.running) return;
      this.recordSession(true);
      this.running = false;
      this.phase = "idle";
      this.scheduler.stop();
      this.visualizer.clear();
      this.pendingSpeedLoopBeats = [];
      this.releaseWakeLock();
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.el.playBtn.classList.remove("running");
      this.el.playBtn.setAttribute("aria-pressed", "false");
      this.el.playLabel.textContent = "Start";
      this.el.phraseLabel.hidden = true;
      this.el.loopProgress.hidden = true;
      this.countInEndTime = null;
      this.timerEndTime = null;
      this.updateTempoControlAvailability();
      this.setStatus("Session paused when the app left the screen. Tap Start to begin again.");
      this.persist();
      if (this.engine.ctx?.state === "running") {
        this.engine.ctx.suspend().catch((error) => {
          console.warn("Audio could not suspend after the app was hidden.", error);
        });
      }
    }

    recordSession(interrupted) {
      if (this.phase !== "playing" || this.sessionLogged) return;
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
        title.textContent = `${session.mode === MODES.SPEEDLOOP ? "Speed Loop" : "Metronome"} · ${session.startBpm} → ${session.endBpm} BPM`;
        details.textContent = `${date.toLocaleString()} · ${duration}${session.interrupted ? " · interrupted" : ""}`;
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

;
if (
  "serviceWorker" in navigator &&
  (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((error) => console.warn("Offline support could not start.", error));
  });
}

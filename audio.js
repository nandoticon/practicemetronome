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

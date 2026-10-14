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

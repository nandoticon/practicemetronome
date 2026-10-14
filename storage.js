(() => {
  "use strict";

  const KEY = "metronome.settings.v1";
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
  });
  const validTones = new Set(["soft", "classic", "bright"]);
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
        theme: ["dark", "light"].includes(parsed.theme) ? parsed.theme : defaults.theme,
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

  window.MetronomeStorage = Object.freeze({ load, save });
})();

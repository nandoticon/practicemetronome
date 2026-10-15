const test = require("node:test");
const assert = require("node:assert/strict");
const createMetronomeAudio = require("../audio.js");

const config = {
  DEFAULT_BPM: 120,
  DEFAULT_BEATS: 4,
  MIN_BPM: 30,
  MAX_BPM: 300,
  SCHEDULE_AHEAD: 0.12,
  SCHEDULER_INTERVAL: 25,
  CLICK_DURATION: 0.045,
  CLICK_FREQ_DOWN: 1600,
  CLICK_FREQ_UP: 1000,
  CLICK_PEAK: 0.9,
  CLICK_PEAK_UP: 0.55,
  CLICK_PEAK_SUB: 0.28,
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

test("scheduler emits subdivisions inside each beat and notifies once per beat", () => {
  const clicks = [];
  const beats = [];
  const engine = {
    now: 0.1,
    scheduleClick: (time, accent, subdivision) => clicks.push({ time, accent, subdivision }),
  };
  const { Scheduler } = createMetronomeAudio({ CONFIG: config, clamp });
  const scheduler = new Scheduler(engine, (...beat) => beats.push(beat));
  scheduler.setSubdivisions(4);
  scheduler.start(0.1);
  scheduler.stop();

  assert.deepEqual(clicks.map(({ time }) => time), [0.1, 0.225, 0.35, 0.475]);
  assert.deepEqual(clicks.map(({ accent, subdivision }) => [accent, subdivision]), [
    [true, false], [false, true], [false, true], [false, true],
  ]);
  assert.equal(beats.length, 1);
  assert.deepEqual(beats[0], [0, 0.1, 4]);
});
test("scheduler applies configurable downbeat, backbeat, every-beat, and no accents", () => {
  const { Scheduler } = createMetronomeAudio({ CONFIG: config, clamp });
  for (const [pattern, expected] of [
    ["downbeat", [true, false, false, false]],
    ["backbeat", [false, true, false, true]],
    ["every", [true, true, true, true]],
    ["none", [false, false, false, false]],
  ]) {
    const accents = [];
    const engine = { now: 0, scheduleClick: (_time, accent, subdivision) => { if (!subdivision) accents.push(accent); } };
    const scheduler = new Scheduler(engine, () => {});
    scheduler.setAccentPattern(pattern);
    scheduler.start(0);
    engine.now = 1.6;
    scheduler.tick();
    scheduler.stop();
    assert.deepEqual(accents.slice(0, 4), expected, pattern);
  }
});

test("scheduler does not queue clicks beyond a timed practice interval", () => {
  const clicks = [];
  const engine = {
    now: 0.1,
    scheduleClick: (time) => clicks.push(time),
  };
  const { Scheduler } = createMetronomeAudio({ CONFIG: config, clamp });
  const scheduler = new Scheduler(engine, () => {});
  scheduler.setSubdivisions(4);
  scheduler.start(0, 0.2);
  scheduler.stop();
  assert.ok(clicks.length > 0);
  assert.ok(clicks.every((time) => time < 0.2));
});

test("endurance cues schedule a quiet, short tone at the requested pitch and time", () => {
  const tones = [];
  const params = () => ({
    setValueAtTime: (value, time) => tones.push({ value, time }),
    exponentialRampToValueAtTime: (value, time) => tones.push({ value, time }),
  });
  const { AudioEngine } = createMetronomeAudio({ CONFIG: config, clamp });
  const engine = new AudioEngine();
  engine.ctx = {
    destination: {},
    createOscillator: () => ({
      frequency: params(),
      connect: () => {},
      start: (time) => tones.push({ start: time }),
      stop: (time) => tones.push({ stop: time }),
      disconnect: () => {},
    }),
    createGain: () => ({
      gain: params(),
      connect: () => {},
      disconnect: () => {},
    }),
  };

  engine.scheduleCue(12, 440);
  assert.deepEqual(tones[0], { value: 440, time: 12 });
  assert.ok(tones.some(({ value }) => value === 0.28));
  assert.ok(tones.some(({ stop }) => stop === 12.18));
});

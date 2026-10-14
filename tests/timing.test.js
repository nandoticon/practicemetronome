const test = require("node:test");
const assert = require("node:assert/strict");
const { SpeedRamp, SpeedLoopCadence, initialBpm, practiceTimerEnd } = require("../timing.js");

test("Speed Loop cadence changes tempo only at configured phrase boundaries", () => {
  for (const bars of [1, 2, 4, 8, 32]) {
    const cadence = new SpeedLoopCadence(bars);
    const phraseBeats = bars * 4;
    const changes = [];
    for (let beat = 1; beat <= phraseBeats * 3 + 1; beat++) {
      if (cadence.advance(4)) changes.push(beat);
    }
    assert.deepEqual(changes, [phraseBeats + 1, phraseBeats * 2 + 1, phraseBeats * 3 + 1]);
  }
});
test("cadence bar indicator cycles using selected meter and phrase length", () => {
  const cadence = new SpeedLoopCadence(3);
  const bars = [];
  for (let beat = 0; beat < 12; beat++) {
    cadence.advance(4);
    if (beat % 4 === 0) bars.push(cadence.bar);
  }
  assert.deepEqual(bars, [1, 2, 3]);
  cadence.reset(1);
  cadence.advance(3);
  assert.equal(cadence.bar, 1);
});

test("SpeedRamp progresses linearly, reaches target, and holds it", () => {
  const ramp = new SpeedRamp();
  ramp.configure({ start: 60, target: 120, minutes: 1 });
  ramp.begin(10);
  assert.deepEqual(ramp.sample(10), { bpm: 60, progress: 0, rampDone: false });
  assert.deepEqual(ramp.sample(40), { bpm: 90, progress: 0.5, rampDone: false });
  assert.deepEqual(ramp.sample(70), { bpm: 120, progress: 1, rampDone: true });
  assert.deepEqual(ramp.sample(100), { bpm: 120, progress: 1, rampDone: true });
});

test("count-in tempo begins Speed Loop at its configured starting tempo", () => {
  assert.equal(initialBpm("speedloop", 144, 72), 72);
  assert.equal(initialBpm("metronome", 144, 72), 144);
  assert.equal(initialBpm("speedloop", 144, 900), 300);
});

test("practice timer has a finite end only when enabled", () => {
  assert.equal(practiceTimerEnd(12, false, 5), null);
  assert.equal(practiceTimerEnd(12, true, 5), 312);
  assert.equal(practiceTimerEnd(12, true, 0), 72);
});

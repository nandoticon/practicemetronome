const test = require("node:test");
const assert = require("node:assert/strict");
const storage = require("../storage.js");

test("saved settings are clamped and invalid options fall back to defaults", () => {
  global.localStorage = {
    getItem: () => JSON.stringify({
      bpm: 900,
      beatsPerBar: 99,
      theme: "sepia",
      subdivisions: 3,
      accentPattern: "chaos",
    }),
    setItem: () => {},
  };
  const state = storage.load();
  assert.equal(state.bpm, 300);
  assert.equal(state.beatsPerBar, 4);
  assert.equal(state.theme, "dark");
  assert.equal(state.subdivisions, 1);
  assert.equal(state.accentPattern, "downbeat");
});

test("system theme and supported rhythm options restore from storage", () => {
  global.localStorage = {
    getItem: () => JSON.stringify({ theme: "system", subdivisions: 4, accentPattern: "backbeat" }),
    setItem: () => {},
  };
  const state = storage.load();
  assert.equal(state.theme, "system");
  assert.equal(state.subdivisions, 4);
  assert.equal(state.accentPattern, "backbeat");
});

test("session history is local, ordered, and capped at ten entries", () => {
  const values = new Map();
  global.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  for (let index = 0; index < 12; index++) {
    storage.saveSession({
      startedAt: index + 1,
      durationSec: 60,
      mode: "metronome",
      startBpm: 100,
      endBpm: 100,
      interrupted: false,
    });
  }
  const sessions = storage.loadSessions();
  assert.equal(sessions.length, 10);
  assert.equal(sessions[0].startedAt, 12);
  assert.equal(sessions[9].startedAt, 3);
  assert.equal(storage.clearSessions(), true);
  assert.deepEqual(storage.loadSessions(), []);
});

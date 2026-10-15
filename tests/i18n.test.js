const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const i18n = require("../i18n.js");

test("all supported locales provide the complete interface message catalog", () => {
  assert.deepEqual(i18n.supported, ["en-US", "pt-BR", "es", "it", "fr", "de", "ja", "zh-CN", "ko"]);
  assert.equal(i18n.translate("bar", { current: 2, total: 4 }), "Bar 2 of 4");
});

test("translation placeholders are consistent across languages", () => {
  const placeholderNames = (message) => [...message.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  const source = require("../locales/en-US.js");
  for (const language of i18n.supported) {
    const locale = require(`../locales/${language}.js`);
    for (const key of i18n.keys) {
      assert.deepEqual(placeholderNames(locale[key]), placeholderNames(source[key]), `${language}.${key}`);
    }
  }
});

test("language picker options match every bundled locale", () => {
  const html = fs.readFileSync("src/html/header.html", "utf8");
  const options = [...html.matchAll(/<option value="([^"]+)">/g)]
    .map((match) => match[1])
    .filter((value) => i18n.supported.includes(value));
  assert.deepEqual(options, i18n.supported);
});

test("every marked-up interface string has a translation key", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const used = [...html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)].map((match) => match[1]);
  const missing = [...new Set(used)].filter((key) => !i18n.keys.includes(key));
  assert.deepEqual(missing, []);
});

test("Speed Loop and endurance indicators are grouped with the beat display", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const beatDisplayStart = html.indexOf('<div class="beat-display">');
  const beatDisplayEnd = html.indexOf("</div>\n      <div class=\"console-actions\">", beatDisplayStart);
  assert.ok(beatDisplayStart >= 0);
  assert.ok(beatDisplayEnd > beatDisplayStart);
  const beatDisplay = html.slice(beatDisplayStart, beatDisplayEnd);
  assert.match(beatDisplay, /id="loopProgress"/);
  assert.match(beatDisplay, /id="progressElapsed"/);
  assert.match(beatDisplay, /id="enduranceProgress"/);
  assert.match(beatDisplay, /id="enduranceCountdown"/);
  assert.match(beatDisplay, /id="enduranceCommand"/);
  assert.match(beatDisplay, /id="progressElapsed"/);
});

test("all dynamic application messages resolve to translated catalog entries", () => {
  const app = fs.readFileSync("app.js", "utf8");
  const used = [
    ...app.matchAll(/\bt\("([^"]+)"/g),
    ...app.matchAll(/setStatus\("([^"]+)"/g),
    ...app.matchAll(/setWakeLockStatus\("([^"]+)"/g),
  ].map((match) => match[1]).filter(Boolean);
  assert.deepEqual([...new Set(used)].filter((key) => !i18n.keys.includes(key)), []);
});

test("switching locales updates document language and interpolated interface text", () => {
  global.document = {
    documentElement: { lang: "" },
    title: "",
    querySelectorAll: () => [],
  };
  i18n.setLanguage("ja");
  assert.equal(document.documentElement.lang, "ja");
  assert.equal(document.title, "練習用メトロノーム — リズムを見つけよう");
  assert.equal(i18n.translate("bar", { current: 2, total: 4 }), "4小節中 2小節目");
  i18n.setLanguage("en-US");
  delete global.document;
});

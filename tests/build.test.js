const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("generated page, manifest, and service worker use organized asset paths", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const manifest = JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8"));
  const serviceWorker = fs.readFileSync("service-worker.js", "utf8");
  const assetPaths = [
    "css/style.css",
    "js/bundle.js",
    "img/icon.svg",
    "img/apple-touch-icon-v2.png",
    ...manifest.icons.map((icon) => icon.src),
  ];

  for (const asset of assetPaths) {
    assert.ok(fs.existsSync(asset), `missing asset: ${asset}`);
  }
  assert.match(html, /href="css\/style\.css"/);
  assert.match(html, /src="js\/bundle\.js"/);
  assert.match(html, /href="img\/apple-touch-icon-v2\.png"/);
  assert.match(serviceWorker, /"\.\/css\/style\.css"/);
  assert.match(serviceWorker, /"\.\/js\/bundle\.js"/);
  assert.doesNotMatch(html, /img\/lucide\.svg#/);
});

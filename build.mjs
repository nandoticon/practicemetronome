import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const parts = [
  "head.html",
  "header.html",
  "beat-indicator.html",
  "tempo.html",
  "transport.html",
  "tap-tempo.html",
  "mode-tabs.html",
  "settings.html",
  "readout.html",
  "tail.html",
];
const html = (await Promise.all(parts.map((part) => readFile(join(root, "src", "html", part), "utf8")))).join("");
const styles = ["base.css", "layout-beats.css", "tempo-controls.css", "settings.css", "readout-accessibility.css"];
const scripts = ["storage.js", "audio.js", "app.js", "pwa.js"];
const [css, js] = await Promise.all([
  Promise.all(styles.map((part) => readFile(join(root, "styles", part), "utf8"))).then((files) => files.join("\n")),
  Promise.all(scripts.map((part) => readFile(join(root, part), "utf8"))).then((files) => files.join("\n;\n")),
]);
await writeFile(join(root, "index.html"), html);
await Promise.all([
  writeFile(join(root, "style.css"), css),
  writeFile(join(root, "bundle.js"), js),
]);
console.log(`Built static app from ${parts.length} HTML components, ${styles.length} style modules, and ${scripts.length} scripts.`);

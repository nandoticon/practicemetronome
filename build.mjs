import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const parts = [
  "head.html",
  "header.html",
  "beat-indicator.html",
  "tempo.html",
  "mode-tabs.html",
  "metronome-mode.html",
  "speedloop-mode.html",
  "endurance-mode.html",
  "settings.html",
  "readout.html",
  "tail.html",
];
const [htmlParts, iconSprite] = await Promise.all([
  Promise.all(parts.map((part) => readFile(join(root, "src", "html", part), "utf8"))),
  readFile(join(root, "img", "lucide.svg"), "utf8"),
]);
let html = htmlParts.join("");
const embeddedIcons = iconSprite
  .replace(/^<\?xml[^>]*>\s*/, "")
  .replace("<svg ", '<svg class="icon-definitions" aria-hidden="true" focusable="false" ');
const bodyTag = "<body>";
if (!html.includes(bodyTag)) throw new Error("Could not find the body tag for the inline icon sprite.");
html = html.replace(bodyTag, `${bodyTag}\n${embeddedIcons}`);
html = html.replaceAll("./img/lucide.svg#", "#");
const styles = ["base.css", "layout-beats.css", "tempo-controls.css", "settings.css", "readout-accessibility.css"];
const locales = ["en-US.js", "pt-BR.js", "es.js", "it.js", "fr.js", "de.js", "ja.js", "zh-CN.js", "ko.js"];
const scripts = [
  "storage.js",
  "audio.js",
  "timing.js",
  "i18n.js",
  "app-controls.js",
  "app-training.js",
  "app-ui.js",
  "app.js",
  "pwa.js",
];
const [css, js] = await Promise.all([
  Promise.all(styles.map((part) => readFile(join(root, "css", part), "utf8"))).then((files) => files.join("\n")),
  Promise.all([
    ...locales.map((part) => readFile(join(root, "js", "locales", part), "utf8")),
    ...scripts.map((part) => readFile(join(root, "js", part), "utf8")),
  ]).then((files) => files.join("\n;\n")),
]);
await writeFile(join(root, "index.html"), html);
await Promise.all([
  writeFile(join(root, "css", "style.css"), css),
  writeFile(join(root, "js", "bundle.js"), js),
]);
console.log(`Built static app from ${parts.length} HTML components, ${styles.length} style modules, ${locales.length} locales, and ${scripts.length} scripts.`);

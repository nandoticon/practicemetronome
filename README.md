# Practice Metronome

A lightweight, responsive, multilingual metronome for focused practice. Features include a standard metronome, configurable Speed Loop, tap tempo, count-in, practice timer, note subdivisions, accent patterns, click sounds, volume control, recent-session history, wake lock, and system/light/dark themes. The interface is available in English (US), Brazilian Portuguese, Spanish, Italian, French, German, Japanese, Simplified Chinese, and Korean. English (US) is the default; the selected language and other preferences are saved locally on the device. Playback pauses safely when the app is hidden and can be restarted with a tap. All app assets are bundled locally, and the app works offline after its first successful load.

Developed by **Fernando Ticon using IA**.

## Version history

| Version | Year | Notes |
| --- | --- | --- |
| 1.0 | 2026 | Initial release with metronome and configurable Speed Loop, responsive interface, light/dark themes, and offline support. |

## Run locally

For full functionality—including service-worker offline caching and the screen-awake option—serve the app from `localhost`:

```sh
npx serve .
```

Then open the local URL printed by the server. Node.js is only needed for building or serving; the app itself has no runtime package dependencies.

## Build

Edit the modular sources, then regenerate the static files:

```sh
node build.mjs
```

The build combines:

- HTML components from `src/html/`
- CSS modules from `styles/`
- JavaScript modules: `storage.js`, `audio.js`, `timing.js`, `i18n.js`, `app.js`, and `pwa.js`
- `locales/` — one translation catalog per supported language

into the static `index.html`, `style.css`, and `bundle.js` files. The build embeds the Lucide sprite from `icons/lucide.svg` into the HTML. There are no runtime package or network dependencies. When changing source files, rebuild and commit both the source and generated files so the published site stays current.

To add or edit a translation, update the matching file in `locales/` and keep its message keys and `{placeholders}` consistent with `locales/en-US.js`. Run the build and tests before publishing.

Run the dependency-free automated tests with:

```sh
node --test
```

## Upload to GitHub

Create an empty repository on GitHub (without initializing it with a README or license), then from this folder run:

```sh
git init
git add .
git commit -m "Publish Practice Metronome"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository's HTTPS or SSH URL. GitHub CLI users can instead create and push a repository with `gh repo create`.

## Publish with GitHub Pages

1. Push the app to the repository's `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Open the published URL shown in the Pages settings. The service worker and screen wake lock require the HTTPS Pages URL (or localhost during development).

The service worker caches the static app shell on the first successful visit. Subsequent visits can load the app offline. Updates become available after the browser installs the new service-worker cache.

## Speed Loop

Set the start and target tempos, choose the ramp duration, then set **Bars per tempo change** from 1 to 32. Tempo changes only at the beginning of each selected phrase. The displayed ramp duration is approximate because updates wait for phrase boundaries. Optional quarter-, eighth-, and sixteenth-note subdivisions and first-beat, even-beat, every-beat, or no-accent patterns are also available.

Recent session history stays in this browser on this device. It is not uploaded.

The bundled Lucide icons are distributed under the ISC and MIT licenses; see `THIRD_PARTY_NOTICES.txt`.

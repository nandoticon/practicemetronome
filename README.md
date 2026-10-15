# Practice Metronome

[**Open the live web app: https://practicemetronome.vercel.app/**](https://practicemetronome.vercel.app/)

> **Use it online, save it for later, or install it.** Open the live app link above, then bookmark/favorite the page in your browser. To install it as an app, use your browser’s **Install app** option (desktop/Android) or **Add to Home Screen** option (iPhone/iPad). Installation options vary by browser. After the first successful online visit, the app can also work offline.

A lightweight, responsive, multilingual metronome for focused practice. Features include a standard metronome, configurable Speed Loop, interval-based endurance training, tap tempo, count-in, practice timer, note subdivisions, accent patterns, click sounds, volume control, recent-session history, wake lock, and system/light/dark themes. Distinct icons help identify the practice settings, with layouts tuned for translated labels and small screens. The interface is available in English (US), Brazilian Portuguese, Spanish, Italian, French, German, Japanese, Simplified Chinese, and Korean. English (US) is the default; the selected language and other preferences are saved locally on the device. Playback pauses safely when the app is hidden and can be restarted with a tap. All app assets are bundled locally, and the app works offline after its first successful load.

Developed by **Fernando Ticon using IA**.

## Version history

| Version | Year | Notes |
| --- | --- | --- |
| 1.0 | 2026 | Initial release with metronome and configurable Speed Loop, responsive interface, light/dark themes, and offline support. |
| 1.1 | 2026 | Added configurable endurance practice intervals with timed rests and session counting. |

## Run locally

For full functionality—including service-worker offline caching and the screen-awake option—serve the app from `localhost`:

```sh
npx serve .
```

Then open the local URL printed by the server. Node.js is only needed for building or serving; the app itself has no runtime package dependencies.

## Save or install the app

- **Bookmark/favorite:** Open the live app and use your browser’s bookmark or favorite control.
- **Install:** On a supported desktop or Android browser, select **Install app** (sometimes under the browser menu). On iPhone or iPad, open the app in Safari, tap **Share**, then choose **Add to Home Screen**.
- **Use offline:** Visit the live app while online at least once so the app shell is cached. Launch it later from the browser or installed app; playback is paused if the app is sent to the background and must be started again when you return.

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

into the static `index.html`, `style.css`, and `bundle.js` files. The build embeds the curated Lucide sprite from `icons/lucide.svg` into the HTML; only icons used by the interface are included. There are no runtime package or network dependencies. When changing source files, rebuild and commit both the source and generated files so the published site stays current.

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

## Endurance training

Set the practice tempo with the main tempo controls, then choose a practice duration, rest duration, and number of sessions. Start the workout to alternate timed practice intervals and rests; the beat stops during rest, and clear on-screen and audio cues announce each phase. The final session ends without an extra rest. Set the rest duration to zero to run practice intervals back to back. Workout settings are saved on this device, and completed or interrupted workouts appear in recent practice history.

Recent session history stays in this browser on this device. It is not uploaded.

The bundled Lucide icons are distributed under the ISC and MIT licenses; see `THIRD_PARTY_NOTICES.txt`.

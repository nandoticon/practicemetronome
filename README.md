# Practice Metronome

A lightweight, responsive metronome for focused practice. It includes a standard metronome, a configurable Speed Loop, tap tempo, count-in, practice timer, custom click sounds, volume control, and light/dark themes. All runtime assets are local, and the app works offline after its first successful load.

Developed by **Fernando Ticon using AI**.

## Version history

| Version | Year | Notes |
| --- | --- | --- |
| 1.0 | 2026 | Initial release with metronome and configurable Speed Loop, responsive interface, light/dark themes, and offline support. |

## Run locally

You can open `index.html` directly for basic practice. For service-worker offline caching and the screen-awake option, serve it from `localhost`:

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
- `storage.js`, `audio.js`, `app.js`, and `pwa.js`

into `index.html`, `style.css`, and `bundle.js`. Commit both the source files and generated files so the published site can be served as static content.

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

Set the start and target tempos, choose the ramp duration, then set **Bars per tempo change** from 1 to 32. The tempo only changes at the beginning of each selected phrase; its displayed ramp duration is approximate because changes wait for the next phrase boundary.

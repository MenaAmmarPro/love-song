# Our Song — for Mena

Our song, plus a little music box of handmade lullabies and a space for the
lyrics that feel like us. Part of the **Love for Mena** collection.

**Live:** https://menaammarpro.github.io/love-song/

## What it does

- A player for eight generative tracks — every one synthesized live in the
  browser (no audio files), with play/pause, next/prev, shuffle, and volume
- A "Our song" section that embeds your real song from YouTube
- A Lyrics section
- Offline-capable PWA

## Make it ours

1. **Our real song** — open `js/app.js`, find `OUR_SONG` at the top, and set:
   - `youtubeId` — the part after `watch?v=` or `youtu.be/` in the link
   - `title` / `artist`
   - `lyrics` — an array of lines, one per string
2. **The handmade tracks** — edit `js/tracks-data.js` (title, mood, tempo,
   scale, progression, seed).

## Files

- `index.html` — the page
- `css/theme.css` — shared love-theme (copied from `_love-theme/`)
- `css/app.css` — page-specific styles
- `js/theme-main.js`, `js/effects.js` — shared behaviour/effects
- `js/music.js` — the generative Web Audio engine
- `js/tracks-data.js` — the track definitions
- `js/app.js` — player logic + `OUR_SONG` config
- `manifest.webmanifest`, `sw.js` — PWA
- `assets/` — favicon and icons

## Run locally

```powershell
py -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

Static site, deployed with GitHub Pages from `main`.

## License

Creative Commons BY-NC-ND 4.0 — see [`LICENSE`](LICENSE).
© 2026 Ammar (MenaAmmarPro). Made with care for Mena.

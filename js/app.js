"use strict";

/*
 * love-song — the player page.
 *
 * Everything here is generative: js/music.js turns each track's data into
 * live audio with the Web Audio API. Edit OUR_SONG below to point at the
 * real song, and edit js/tracks-data.js to change the handmade tracks.
 */

/* ------------------------------------------------------------------ *
 * Our song.
 *
 *   youtubeId : the bit after "watch?v=" or "youtu.be/" in a YouTube link
 *               (e.g. https://youtu.be/dQw4w9WgXcQ -> "dQw4w9WgXcQ")
 *   lyrics    : any lines you want shown in the Lyrics section
 *
 * NOTE: the value below is a friendly placeholder ("Perfect" by Ed Sheeran)
 * so the player is never empty. Swap it for your real song whenever you like.
 * ------------------------------------------------------------------ */
const OUR_SONG = {
  title: "Perfect",
  artist: "Ed Sheeran",
  youtubeId: "2Vv-BfVoq4g",
  lyrics: []
};

(function () {
  const TRACKS = Array.isArray(window.MENA_TRACKS) ? window.MENA_TRACKS : [];
  const music = window.MenaMusic || null;

  const els = {
    embed: document.getElementById("song-embed"),
    embedNote: document.getElementById("song-embed-note"),
    lyrics: document.getElementById("lyrics"),
    list: document.getElementById("song-list"),
    nowTitle: document.getElementById("now-title"),
    nowMood: document.getElementById("now-mood"),
    playToggle: document.getElementById("play-toggle"),
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
    shuffle: document.getElementById("shuffle"),
    volume: document.getElementById("volume"),
    status: document.getElementById("player-status"),
    eq: document.getElementById("eq")
  };

  let index = 0;
  let shuffle = false;

  /* -------------------- our real song -------------------- */
  function renderSongEmbed() {
    if (!els.embed) return;
    if (OUR_SONG.youtubeId) {
      const frame = document.createElement("iframe");
      frame.src = "https://www.youtube.com/embed/" + encodeURIComponent(OUR_SONG.youtubeId);
      frame.title = OUR_SONG.title || "Our song";
      frame.loading = "lazy";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      frame.allowFullscreen = true;
      els.embed.appendChild(frame);
      if (els.embedNote) {
        const who = OUR_SONG.artist ? " — " + OUR_SONG.artist : "";
        els.embedNote.textContent = OUR_SONG.title + who;
      }
      const link = document.createElement("a");
      link.className = "embed-link";
      link.href = "https://www.youtube.com/watch?v=" + encodeURIComponent(OUR_SONG.youtubeId);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open on YouTube ↗";
      if (els.embed.parentNode) {
        els.embed.parentNode.insertBefore(link, els.embed.nextSibling);
      }
    } else {
      const ph = document.createElement("div");
      ph.className = "embed-placeholder";
      const icon = document.createElement("span");
      icon.textContent = "🎵";
      const line = document.createElement("span");
      line.textContent = "Our real song goes here";
      const small = document.createElement("span");
      small.textContent = "Add its YouTube link in js/app.js (OUR_SONG.youtubeId).";
      ph.appendChild(icon);
      ph.appendChild(line);
      ph.appendChild(small);
      els.embed.appendChild(ph);
      if (els.embedNote) {
        els.embedNote.textContent = "Once you tell me our song, I'll put it right here.";
      }
    }
  }

  function renderLyrics() {
    if (!els.lyrics) return;
    if (OUR_SONG.lyrics && OUR_SONG.lyrics.length) {
      els.lyrics.textContent = OUR_SONG.lyrics.join("\n");
    } else {
      els.lyrics.textContent =
        "No lyrics yet — I'm saving this space for the words that feel like us.\n" +
        "Tell me our song and I'll fill it in, line by line.";
    }
  }

  /* -------------------- track list -------------------- */
  function renderTrackList() {
    if (!els.list) return;
    els.list.innerHTML = "";
    TRACKS.forEach((track, i) => {
      const li = document.createElement("li");
      li.className = "song-item";
      li.dataset.index = String(i);

      const info = document.createElement("div");
      info.className = "song-info";
      const title = document.createElement("span");
      title.className = "song-title";
      title.textContent = track.title;
      const artist = document.createElement("span");
      artist.className = "song-artist";
      artist.textContent = track.mood;
      info.appendChild(title);
      info.appendChild(artist);

      const actions = document.createElement("div");
      actions.className = "song-actions";

      const playBtn = document.createElement("button");
      playBtn.className = "song-play";
      playBtn.type = "button";
      playBtn.textContent = "Play";
      playBtn.addEventListener("click", () => selectTrack(i, true));

      const dl = document.createElement("button");
      dl.className = "song-download";
      dl.type = "button";
      dl.textContent = "WAV";
      dl.title = "Render and download this track as a WAV file";
      dl.addEventListener("click", () => downloadTrack(track, dl));

      actions.appendChild(playBtn);
      actions.appendChild(dl);

      li.appendChild(info);
      li.appendChild(actions);
      els.list.appendChild(li);
    });
  }

  function highlightList() {
    if (!els.list) return;
    Array.prototype.forEach.call(els.list.children, (li) => {
      const track = TRACKS[Number(li.dataset.index)];
      const on = Boolean(track && music && music.isPlaying(track.id));
      li.classList.toggle("is-playing", on);
    });
  }

  /* -------------------- transport -------------------- */
  function setStatus(message) {
    if (els.status) els.status.textContent = message || "";
  }

  function updateNowPlaying(track) {
    if (els.nowTitle) els.nowTitle.textContent = track ? track.title : "Nothing yet";
    if (els.nowMood) els.nowMood.textContent = track ? track.mood : "Pick a track below ♡";
    if (els.playToggle) {
      const on = track && music && music.isPlaying(track.id);
      els.playToggle.textContent = on ? "❚❚" : "▶";
      els.playToggle.setAttribute("aria-label", on ? "Pause" : "Play");
    }
    highlightList();
  }

  function selectTrack(i, autoplay) {
    if (!TRACKS.length) return;
    index = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
    const track = TRACKS[index];
    if (!music) {
      updateNowPlaying(track);
      setStatus("Audio isn't supported in this browser.");
      return;
    }
    if (autoplay) {
      const ok = music.play(track);
      if (!ok) {
        setStatus("Tap play once so the browser lets us make sound ♫");
      } else {
        setStatus("Playing \u201c" + track.title + "\u201d");
      }
    }
    updateNowPlaying(track);
    if (els.volume) music.setVolume(Number(els.volume.value) / 100);
  }

  function togglePlay() {
    if (!music) {
      setStatus("Audio isn't supported in this browser.");
      return;
    }
    const current = TRACKS[index];
    if (current && music.isPlaying(current.id)) {
      music.stop();
      setStatus("Paused");
      updateNowPlaying(current);
    } else {
      selectTrack(index, true);
    }
  }

  function step(delta) {
    if (shuffle && TRACKS.length > 1) {
      let pick = index;
      while (pick === index) {
        pick = Math.floor(Math.random() * TRACKS.length);
      }
      index = pick;
      selectTrack(index, true);
      return;
    }
    selectTrack(index + delta, true);
  }

  function downloadTrack(track, button) {
    if (!music || typeof music.render !== "function") {
      setStatus("Downloads aren't supported in this browser.");
      return;
    }
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "…";
    const seconds = track.seconds || 24;
    Promise.resolve(music.render(track, seconds))
      .then((buffer) => {
        if (!buffer) throw new Error("no buffer");
        const blob = music.toWav(buffer);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = track.id + ".wav";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        setStatus("Saved " + track.id + ".wav ♫");
      })
      .catch(() => setStatus("Could not render that track."))
      .then(() => {
        button.disabled = false;
        button.textContent = original;
      });
  }

  /* -------------------- equalizer -------------------- */
  function startEqualizer() {
    const canvas = els.eq;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bars = 40;
    const phase = new Array(bars).fill(0).map((_, i) => i * 0.6);

    function frame() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const playing = music && music.playingId();
      const gap = 3;
      const barW = (w - gap * (bars - 1)) / bars;
      for (let i = 0; i < bars; i += 1) {
        phase[i] += playing ? 0.12 + (i % 5) * 0.01 : 0.02;
        const amp = playing ? 0.55 + 0.45 * Math.abs(Math.sin(phase[i])) : 0.08;
        const barH = Math.max(3, amp * h * (0.6 + 0.4 * Math.abs(Math.cos(phase[i] * 0.7))));
        const x = i * (barW + gap);
        const y = (h - barH) / 2;
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, "rgba(255,159,207,0.95)");
        grad.addColorStop(1, "rgba(155,120,255,0.75)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        const r = Math.min(barW / 2, 4);
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + barW, y, x + barW, y + barH, r);
        ctx.arcTo(x + barW, y + barH, x, y + barH, r);
        ctx.arcTo(x, y + barH, x, y, r);
        ctx.arcTo(x, y, x + barW, y, r);
        ctx.closePath();
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* -------------------- wire up -------------------- */
  function init() {
    renderSongEmbed();
    renderLyrics();
    renderTrackList();

    if (els.playToggle) els.playToggle.addEventListener("click", togglePlay);
    if (els.next) els.next.addEventListener("click", () => step(1));
    if (els.prev) els.prev.addEventListener("click", () => step(-1));
    if (els.shuffle) {
      els.shuffle.addEventListener("click", () => {
        shuffle = !shuffle;
        els.shuffle.classList.toggle("is-active", shuffle);
        els.shuffle.setAttribute("aria-pressed", String(shuffle));
        setStatus(shuffle ? "Shuffle on" : "Shuffle off");
      });
    }
    if (els.volume && music) {
      els.volume.addEventListener("input", () => music.setVolume(Number(els.volume.value) / 100));
    }

    if (!music || !music.supported()) {
      setStatus("Your browser can't play the music box — but the tracks are still here ♡");
    } else {
      setStatus("Pick a track, or press play ♫");
    }

    updateNowPlaying(null);
    startEqualizer();

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

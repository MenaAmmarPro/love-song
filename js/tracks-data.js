"use strict";

/*
 * Every track is generated live in the browser by js/music.js.
 * No audio files: each one is described by its key, scale, tempo,
 * chord progression, and a seed that decides its melody.
 */
window.MENA_TRACKS = [
  {
    id: "starlight",
    title: "Starlight",
    mood: "gentle, wide-open",
    kind: "song",
    tempo: 76,
    root: 60,
    scale: "major",
    progression: "bright",
    waveform: "sine",
    beat: false,
    seed: 11,
    seconds: 24
  },
  {
    id: "slow-dance",
    title: "Slow Dance",
    mood: "warm, close",
    kind: "song",
    tempo: 72,
    root: 57,
    scale: "minor",
    progression: "dream",
    waveform: "triangle",
    beat: true,
    seed: 23,
    seconds: 24
  },
  {
    id: "morning-light",
    title: "Morning Light",
    mood: "bright, hopeful",
    kind: "song",
    tempo: 92,
    root: 62,
    scale: "major",
    progression: "hopeful",
    waveform: "sine",
    beat: true,
    seed: 31,
    seconds: 24
  },
  {
    id: "rainy-window",
    title: "Rainy Window",
    mood: "quiet, nostalgic",
    kind: "song",
    tempo: 68,
    root: 55,
    scale: "minor",
    progression: "sad",
    waveform: "triangle",
    padWaveform: "sine",
    beat: false,
    seed: 43,
    seconds: 24
  },
  {
    id: "city-lights",
    title: "City Lights",
    mood: "late-night drive",
    kind: "beat",
    tempo: 100,
    root: 53,
    scale: "minor",
    progression: "loop",
    waveform: "sawtooth",
    melody: false,
    beat: true,
    seed: 57,
    seconds: 24
  },
  {
    id: "lullaby",
    title: "Lullaby",
    mood: "soft, sleepy",
    kind: "song",
    tempo: 60,
    root: 60,
    scale: "major",
    progression: "gentle",
    waveform: "sine",
    beat: false,
    seed: 61,
    seconds: 24
  },
  {
    id: "heartbeat",
    title: "Heartbeat",
    mood: "steady, alive",
    kind: "beat",
    tempo: 110,
    root: 53,
    scale: "minor",
    progression: "loop",
    waveform: "square",
    pad: false,
    beat: true,
    seed: 71,
    seconds: 24
  },
  {
    id: "forever",
    title: "Forever",
    mood: "dreamy, endless",
    kind: "song",
    tempo: 80,
    root: 60,
    scale: "lydian",
    progression: "dream",
    waveform: "triangle",
    beat: false,
    seed: 83,
    seconds: 24
  }
];

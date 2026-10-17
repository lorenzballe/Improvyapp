/**
 * The app's piano notes (lib/services/note_sound_service.dart): the note a
 * question is about when it comes up, and the note tapped with each answer,
 * so the number, the key on the keyboard and the sound end up as one thing.
 * Each is a key pressed for an instant with no pedal: held 380 ms, then let
 * go in five steps over 140 ms, as the app lets it go.
 *
 * The same 24 recordings, middle C up to the B almost two octaves above, from
 * the Salamander Grand Piano by Alexander Holm (CC BY 3.0, credited in the
 * Terms), cut to the half second that is ever heard. Nothing is downloaded
 * until a trainer is on screen, and nothing sounds until the visitor has
 * touched the page: a browser lets a page make sound only after that.
 */
const LOWEST = 60;
const HIGHEST = 83;
const HOLD = 0.38;
const RELEASE = 0.14;
const STEPS = 5;

let ctx: AudioContext | null = null;
let loading: Promise<void> | null = null;
/** Set by the first touch, click or key: from then on the page may sound. */
let allowed = false;
let waking = false;
const buffers = new Map<number, AudioBuffer>();
/** Where each note's sound begins: past any silence a decoder puts first. */
const onsets = new Map<number, number>();

function context(): AudioContext | null {
  if (ctx) return ctx;
  const AC =
    window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    return null;
  }
  return ctx;
}

// The callback form: older Safari has no promise from decodeAudioData.
function decode(c: AudioContext, data: ArrayBuffer) {
  return new Promise<AudioBuffer>((resolve, reject) => c.decodeAudioData(data, resolve, reject));
}

function onset(buffer: AudioBuffer) {
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) {
    if (Math.abs(samples[i]) > 0.01) return Math.max(0, i - 32) / buffer.sampleRate;
  }
  return 0;
}

/** Fetches and decodes the notes, once. Safe to call as often as liked. */
export function preloadNotes(): Promise<void> {
  if (loading) return loading;
  const c = context();
  if (!c) return Promise.resolve();
  loading = Promise.all(
    Array.from({ length: HIGHEST - LOWEST + 1 }, async (_, i) => {
      const midi = LOWEST + i;
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}audio/piano/p_${midi}.mp3`);
        if (!res.ok) return;
        const buffer = await decode(c, await res.arrayBuffer());
        buffers.set(midi, buffer);
        onsets.set(midi, onset(buffer));
      } catch {
        // A note that cannot load is a silent note, never a broken game.
      }
    })
  ).then(() => undefined);
  return loading;
}

/** Wakes the audio inside a touch, click or key press, the only place a browser allows it. */
function unlock() {
  allowed = true;
  const c = context();
  // One gesture fires several of the events listened to: wake it once.
  if (!c || c.state === "running" || waking) return;
  waking = true;
  void c
    .resume()
    .catch(() => {})
    .finally(() => {
      waking = false;
    });
  // iOS before 15 only woke for a sound actually started inside the gesture.
  try {
    const blip = c.createBufferSource();
    blip.buffer = c.createBuffer(1, 1, 22050);
    blip.connect(c.destination);
    blip.start(0);
  } catch {
    // Nothing to wake: the next gesture tries again.
  }
}

if (typeof window !== "undefined") {
  for (const type of ["pointerup", "touchend", "click", "keydown"]) {
    window.addEventListener(type, unlock, { capture: true, passive: true });
  }
}

function sound(c: AudioContext, midi: number) {
  const buffer = buffers.get(midi);
  if (!buffer) return;
  const source = c.createBufferSource();
  source.buffer = buffer;
  const volume = c.createGain();
  const t = c.currentTime;
  volume.gain.setValueAtTime(1, t);
  for (let s = STEPS - 1; s >= 0; s--) {
    volume.gain.setValueAtTime(s / STEPS, t + HOLD + ((STEPS - 1 - s) * RELEASE) / STEPS);
  }
  source.connect(volume);
  volume.connect(c.destination);
  source.start(t, onsets.get(midi) ?? 0);
  source.stop(t + HOLD + RELEASE);
}

/** Plays [midi], if the page may sound and the note has arrived. Never throws. */
export function playNote(midi: number | null) {
  if (midi === null || midi < LOWEST || midi > HIGHEST || !allowed) return;
  const c = ctx;
  if (!c) return;
  try {
    if (c.state === "running") sound(c, midi);
    // Woken in this very gesture: the note starts as soon as the audio does.
    else void c.resume().then(() => sound(c, midi)).catch(() => {});
  } catch {
    // Silence, never an error.
  }
}

/**
 * Where [pitch] sounds in a question about [tonic] (pitch classes, 0 = C):
 * the tonic in the octave from middle C and every other degree above it, so
 * 1 to 7 always climbs — NoteSoundService.midiFor.
 */
export function midiFor(pitch: number, tonic: number) {
  return LOWEST + tonic + ((((pitch - tonic) % 12) + 12) % 12);
}

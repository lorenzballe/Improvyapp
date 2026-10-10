import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * How far the music may drift from the picture before it is put back, and
 * how seldom. Phones report the time of both coarsely, and every correction
 * is an audible jump: correcting at a quarter of a second, as often as the
 * picture ticked, made the music stutter on a phone.
 */
const DRIFT = 0.5;
const RESYNC_EVERY_MS = 2000;

/**
 * The method in a minute, at the top of the Method page.
 *
 * The video file has no sound of its own: its music is a separate track
 * (a 128 kbps MP3, light enough for a phone), played alongside it and kept
 * in step with it (play, pause, seeking, the end). Both are served from
 * public/ rather than bundled.
 *
 * The picture starts on its own as soon as the page opens, muted. The
 * "Sound on" button over it starts the music in step; browsers allow sound
 * only after a tap like that one.
 */
export function MethodVideo({ video, music }: { video: string; music: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const lastResync = useRef(0);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    const a = musicRef.current;
    if (!v || !a) return;
    if (!soundOn) {
      a.pause();
      return;
    }
    // Puts the music where the picture is, and plays it if the picture plays.
    const follow = () => {
      a.currentTime = v.currentTime;
      lastResync.current = Date.now();
      if (v.paused || v.ended) a.pause();
      else a.play().catch(() => setSoundOn(false));
    };
    const pause = () => a.pause();
    const drift = () => {
      if (a.paused || Date.now() - lastResync.current < RESYNC_EVERY_MS) return;
      if (Math.abs(a.currentTime - v.currentTime) > DRIFT) {
        a.currentTime = v.currentTime;
        lastResync.current = Date.now();
      }
    };
    v.addEventListener("playing", follow);
    v.addEventListener("seeked", follow);
    v.addEventListener("pause", pause);
    v.addEventListener("ended", pause);
    v.addEventListener("waiting", pause);
    v.addEventListener("timeupdate", drift);
    return () => {
      v.removeEventListener("playing", follow);
      v.removeEventListener("seeked", follow);
      v.removeEventListener("pause", pause);
      v.removeEventListener("ended", pause);
      v.removeEventListener("waiting", pause);
      v.removeEventListener("timeupdate", drift);
      a.pause();
    };
  }, [soundOn]);

  const toggle = () => {
    const v = videoRef.current;
    const a = musicRef.current;
    if (!v || !a) return;
    if (soundOn) {
      setSoundOn(false);
      a.pause();
      return;
    }
    setSoundOn(true);
    // Inside the tap itself, which is what the browser waits for before it
    // allows sound: start the picture if it had stopped, and the music with
    // it, in step.
    if (v.paused) v.play().catch(() => {});
    a.currentTime = v.currentTime;
    lastResync.current = Date.now();
    a.play().catch(() => setSoundOn(false));
  };

  return (
    <div className="relative rounded-[32px] p-1.5 bg-gradient-to-br from-[#e5a93c]/30 via-rose-500/20 to-purple-500/30 shadow-2xl">
      <video
        ref={videoRef}
        className="block w-full aspect-video rounded-[26px] bg-black"
        src={video}
        autoPlay
        muted
        controls
        playsInline
        preload="auto"
        aria-label="Improvy: the method in a minute"
        id="method-video"
      />
      <audio ref={musicRef} src={music} preload="auto" id="method-music" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Sound off" : "Sound on"}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 backdrop-blur px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black/80 transition-all cursor-pointer active:scale-95"
        id="method-video-sound"
      >
        {soundOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        <span>{soundOn ? "Sound off" : "Sound on"}</span>
      </button>
    </div>
  );
}

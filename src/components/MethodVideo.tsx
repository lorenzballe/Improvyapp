import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/** How far the music may drift from the picture before it is put back. */
const DRIFT = 0.25;

/**
 * The method in a minute, at the top of the Method page.
 *
 * The video file has no sound of its own: its music is a separate track,
 * played alongside it and kept in step with it (play, pause, seeking, the
 * end). Both are served from public/ rather than bundled.
 *
 * It starts as soon as the page opens. Browsers let a page start sound on its
 * own only after the visitor has interacted with it (here, usually the click
 * that opened the Method); when they refuse, the picture plays on and a
 * "Sound on" button over it starts the music in step.
 */
export function MethodVideo({ video, music }: { video: string; music: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [blocked, setBlocked] = useState(false);

  // Puts the music where the picture is, and plays it if the picture plays.
  const follow = () => {
    const v = videoRef.current;
    const a = musicRef.current;
    if (!v || !a) return;
    if (Math.abs(a.currentTime - v.currentTime) > DRIFT) a.currentTime = v.currentTime;
    if (v.paused || v.ended || !soundOn) {
      a.pause();
      return;
    }
    a.play().then(
      () => setBlocked(false),
      () => setBlocked(true),
    );
  };

  useEffect(() => {
    const v = videoRef.current;
    const a = musicRef.current;
    if (!v || !a) return;
    const pause = () => a.pause();
    const drift = () => {
      if (!a.paused && Math.abs(a.currentTime - v.currentTime) > DRIFT) {
        a.currentTime = v.currentTime;
      }
    };
    v.addEventListener("play", follow);
    v.addEventListener("playing", follow);
    v.addEventListener("seeked", follow);
    v.addEventListener("pause", pause);
    v.addEventListener("ended", pause);
    v.addEventListener("waiting", pause);
    v.addEventListener("timeupdate", drift);
    follow();
    return () => {
      v.removeEventListener("play", follow);
      v.removeEventListener("playing", follow);
      v.removeEventListener("seeked", follow);
      v.removeEventListener("pause", pause);
      v.removeEventListener("ended", pause);
      v.removeEventListener("waiting", pause);
      v.removeEventListener("timeupdate", drift);
      a.pause();
    };
    // follow reads soundOn; the listeners are re-attached when it changes.
  }, [soundOn]);

  const toggle = () => {
    const v = videoRef.current;
    const a = musicRef.current;
    if (!v || !a) return;
    const next = blocked ? true : !soundOn;
    setSoundOn(next);
    setBlocked(false);
    if (!next) {
      a.pause();
      return;
    }
    // Inside the tap itself, which is the interaction the browser was
    // waiting for: start the picture if it had stopped, and the music with
    // it, in step.
    if (v.paused) v.play().catch(() => {});
    a.currentTime = v.currentTime;
    a.play().catch(() => setBlocked(true));
  };

  const muted = !soundOn || blocked;

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
        aria-pressed={!muted}
        aria-label={muted ? "Sound on" : "Sound off"}
        className={
          "absolute top-4 right-4 sm:top-5 sm:right-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 backdrop-blur px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black/80 transition-all cursor-pointer active:scale-95 " +
          (blocked ? "animate-pulse" : "")
        }
        id="method-video-sound"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        <span>{muted ? "Sound on" : "Sound off"}</span>
      </button>
    </div>
  );
}

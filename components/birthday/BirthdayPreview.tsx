"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Music2, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { BalloonReveal } from "@/components/birthday/preview/BalloonReveal";
import { FinalBirthday } from "@/components/birthday/preview/FinalBirthday";
import { HeartOpening } from "@/components/birthday/preview/HeartOpening";
import { LetterReveal } from "@/components/birthday/preview/LetterReveal";
import { MemoryReveal } from "@/components/birthday/preview/MemoryReveal";
import { Button } from "@/components/ui/Button";
import type { BirthdayFormData } from "@/types/birthday";

type PreviewScene = "opening" | "balloons" | "memories" | "letter" | "final";

interface BirthdayPreviewProps {
  data: BirthdayFormData;
  onRestart: () => void;
}

const SCENE_LABELS: { id: PreviewScene; label: string }[] = [
  { id: "opening", label: "Opening" },
  { id: "balloons", label: "Reasons" },
  { id: "memories", label: "Memories" },
  { id: "letter", label: "Letter" },
  { id: "final", label: "Finale" },
];

const AMBIENT_PARTICLES = [
  { left: "8%", top: "18%", size: "h-1 w-1", delay: "0s", duration: "9s" },
  { left: "19%", top: "72%", size: "h-2 w-2", delay: "-3s", duration: "12s" },
  { left: "34%", top: "12%", size: "h-1 w-1", delay: "-7s", duration: "11s" },
  { left: "53%", top: "82%", size: "h-1.5 w-1.5", delay: "-5s", duration: "10s" },
  { left: "72%", top: "22%", size: "h-2 w-2", delay: "-9s", duration: "14s" },
  { left: "87%", top: "68%", size: "h-1 w-1", delay: "-2s", duration: "8s" },
];

function AmbientMotion() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="air-glow air-glow-one" />
      <div className="air-glow air-glow-two" />
      <div className="air-ribbon air-ribbon-one" />
      <div className="air-ribbon air-ribbon-two" />
      {AMBIENT_PARTICLES.map((particle, index) => (
        <span
          key={index}
          className={`ambient-particle absolute rounded-full bg-pink-100/60 ${particle.size}`}
          style={{ left: particle.left, top: particle.top, animationDelay: particle.delay, animationDuration: particle.duration }}
        />
      ))}
    </div>
  );
}

export function BirthdayPreview({ data, onRestart }: BirthdayPreviewProps) {
  const [scene, setScene] = useState<PreviewScene>("opening");
  const [popped, setPopped] = useState<boolean[]>([false, false, false, false, false]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareError, setShareError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !data.music) {
      return;
    }

    void audio.play().then(() => setIsMusicPlaying(true)).catch(() => setIsMusicPlaying(false));
  }, [data.music]);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      void audio.play().then(() => setIsMusicPlaying(true));
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  }

  async function createShareLink() {
    if (isSharing || shareUrl) return;
    setIsSharing(true);
    setShareError("");
    try {
      const shareData = {
        ...data,
        memories: data.memories,
        music: data.music,
      };
      const slug = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
      const response = await fetch("/api/birthdays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, data: shareData }),
      }).catch(() => {
        throw new Error("Share API network error. Please redeploy the latest Vercel version and try again.");
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || "Could not create share link");
      }
      const url = `${window.location.origin}/s/${slug}`;
      setShareUrl(url);
      await navigator.clipboard?.writeText(url);
    } catch (error) {
      setShareError(error instanceof Error ? error.message : "Could not create share link");
    } finally {
      setIsSharing(false);
    }
  }

  function popBalloon(index: number) {
    setPopped((current) => {
      if (current[index]) {
        return current;
      }
      const next = [...current];
      next[index] = true;
      return next;
    });
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8">
      <AmbientMotion />
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-100/65">Private preview</p>
            <p className="mt-2 text-sm text-[#c9b8c7]">A birthday story made for {data.theirName}.</p>
          </div>
          <Button type="button" variant="ghost" onClick={onRestart}>
            <RotateCcw className="h-4 w-4" />
            Start again
          </Button>
        </header>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-pink-200/15 bg-pink-300/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-pink-50">
            {shareError ? <span className="text-rose-200">{shareError}</span> : shareUrl ? <><Check className="h-4 w-4 text-emerald-200" /> Link copied: {shareUrl}</> : "Share this birthday preview with one link."}
          </div>
          <Button type="button" variant="secondary" onClick={createShareLink} disabled={isSharing || Boolean(shareUrl)}>
            {shareUrl ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {isSharing ? "Creating..." : shareUrl ? "Copied" : "Copy share link"}
          </Button>
        </div>

        {data.music ? (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-pink-200/15 bg-pink-300/8 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Music2 className="h-4 w-4 shrink-0 text-pink-200" />
              <span className="truncate text-xs text-pink-50">{data.music.fileName}</span>
            </div>
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={isMusicPlaying ? "Pause music" : "Play music"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
            >
              {isMusicPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>
            <audio
              ref={audioRef}
              src={data.music.url}
              loop
              onPlay={() => setIsMusicPlaying(true)}
              onPause={() => setIsMusicPlaying(false)}
              className="hidden"
            />
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-5 gap-2 sm:gap-3">
          {SCENE_LABELS.map((item, index) => {
            const active = item.id === scene;
            const completed = SCENE_LABELS.findIndex((entry) => entry.id === scene) > index;
            return (
              <div key={item.id} className="space-y-2">
                <div className={`h-1.5 rounded-full ${active || completed ? "bg-gradient-to-r from-pink-400 to-fuchsia-500" : "bg-white/10"}`} />
                <p className={`text-[11px] sm:text-xs ${active ? "font-semibold text-white" : "text-[#9f8ca0]"}`}>{item.label}</p>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.3 }}
          >
            {scene === "opening" ? (
              <HeartOpening
                name={data.theirName}
                age={data.turningAge}
                onContinue={() => setScene("balloons")}
              />
            ) : null}
            {scene === "balloons" ? (
              <BalloonReveal
                reasons={data.reasons}
                popped={popped}
                onPop={popBalloon}
                onContinue={() => setScene("memories")}
              />
            ) : null}
            {scene === "memories" ? (
              <MemoryReveal memories={data.memories} onContinue={() => setScene("letter")} />
            ) : null}
            {scene === "letter" ? (
              <LetterReveal
                letter={data.letter}
                yourName={data.yourName}
                onContinue={() => setScene("final")}
              />
            ) : null}
            {scene === "final" ? (
              <FinalBirthday
                name={data.theirName}
                yourName={data.yourName}
                age={data.turningAge}
                onRestart={onRestart}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

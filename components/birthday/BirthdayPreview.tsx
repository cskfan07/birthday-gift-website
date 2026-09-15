"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Music2, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { BalloonReveal } from "@/components/birthday/preview/BalloonReveal";
import { BirthdayPreloader } from "@/components/birthday/preview/BirthdayPreloader";
import { FinalBirthday } from "@/components/birthday/preview/FinalBirthday";
import { GateOpening } from "@/components/birthday/preview/GateOpening";
import { HeartOpening } from "@/components/birthday/preview/HeartOpening";
import { LetterReveal } from "@/components/birthday/preview/LetterReveal";
import { MemoryReveal } from "@/components/birthday/preview/MemoryReveal";
import { Button } from "@/components/ui/Button";
import type { BirthdayFormData } from "@/types/birthday";

type PreviewScene = "gate" | "opening" | "balloons" | "memories" | "letter" | "final";

interface BirthdayPreviewProps {
  data: BirthdayFormData;
  onRestart: () => void;
  isShared?: boolean;
}

const SCENE_LABELS: { id: PreviewScene; label: string }[] = [
  { id: "gate", label: "Gate" },
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

async function uploadMedia(dataUrl: string, path: string) {
  let blob: Blob;
  try {
    blob = await fetch(dataUrl).then((response) => response.blob());
  } catch {
    throw new Error("Could not prepare the selected photo or music file for sharing.");
  }
  const formData = new FormData();
  formData.append("file", blob, path.split("/").pop() || "media-file");
  formData.append("path", path);
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  let response: Response;
  try {
    response = await fetch("/api/media", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch {
    throw new Error("Media upload API is unreachable. Please wait for the latest Vercel deployment and try again.");
  } finally {
    window.clearTimeout(timeout);
  }
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(result?.error || "Media upload failed.");
  }
  const result = (await response.json()) as { url: string };
  return result.url;
}

async function uploadAudioDirect(dataUrl: string, path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing for audio upload.");
  }

  const blob = await fetch(dataUrl).then((response) => response.blob());
  const extension = path.split(".").pop()?.toLowerCase();
  const contentType = blob.type || (extension === "mp3" ? "audio/mpeg" : extension === "wav" ? "audio/wav" : extension === "m4a" ? "audio/mp4" : "application/octet-stream");
  const safePath = path.replace(/[^a-zA-Z0-9._/-]/g, "-");
  const response = await fetch(`${supabaseUrl}/storage/v1/object/birthday-media/${safePath}`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": contentType,
      "x-upsert": "true",
      "cache-control": "3600",
    },
    body: blob,
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Audio upload failed: ${details.slice(0, 300)}`);
  }
  return `${supabaseUrl}/storage/v1/object/public/birthday-media/${safePath}`;
}

export function BirthdayPreview({ data, onRestart, isShared = false }: BirthdayPreviewProps) {
  const [scene, setScene] = useState<PreviewScene>("gate");
  const [popped, setPopped] = useState<boolean[]>([false, false, false, false, false]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
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
    setShareNotice("");
    try {
      const slug = crypto.randomUUID().replaceAll("-", "").slice(0, 12);
      const shareData = {
        ...data,
        memories: await Promise.all(data.memories.map(async (memory, index) => ({
          ...memory,
          url: await uploadMedia(memory.url, `${slug}/memory-${index}-${memory.fileName}`),
        }))),
        music: data.music ? { ...data.music, url: await uploadAudioDirect(data.music.url, `${slug}/music-${data.music.fileName}`) } : null,
      };
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      const response = await fetch("/api/birthdays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, data: shareData }),
        signal: controller.signal,
      }).catch(() => {
        throw new Error("Share API network error. Please redeploy the latest Vercel version and try again.");
      }).finally(() => window.clearTimeout(timeout));
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || "Could not create share link");
      }
      const url = `${window.location.origin}/s/${slug}`;
      setShareUrl(url);
      setIsCopied(false);
    } catch (error) {
      setShareError(error instanceof Error ? error.message : "Could not create share link");
    } finally {
      setIsSharing(false);
    }
  }

  async function copyShareLink() {
    if (!shareUrl || isCopied) return;
    setShareError("");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("Copy was blocked by this browser.");
      }
      setIsCopied(true);
    } catch {
      setShareError("Copy was blocked. Please copy this link manually: " + shareUrl);
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

  if (!isPreloaderDone) {
    return (
      <AnimatePresence mode="wait">
        <BirthdayPreloader data={data} onComplete={() => setIsPreloaderDone(true)} />
      </AnimatePresence>
    );
  }

  return (
    <main className="h-dvh overflow-hidden px-2 py-2 sm:px-5 sm:py-3">
      <AmbientMotion />
      <div className="mx-auto flex h-full max-w-6xl flex-col">
        {!isShared ? <header className="mb-1.5 flex shrink-0 items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-100/65">Private preview</p>
            <p className="mt-0.5 hidden text-xs text-[#c9b8c7] sm:block">A birthday story made for {data.theirName}.</p>
          </div>
          <Button type="button" variant="ghost" onClick={onRestart} className="min-h-8 px-3 text-xs sm:min-h-10 sm:px-4">
            <RotateCcw className="h-4 w-4" />
            Start again
          </Button>
        </header> : null}

        {!isShared ? <div className="mb-1.5 flex shrink-0 flex-col gap-1.5 rounded-2xl border border-pink-200/15 bg-pink-300/8 px-3 py-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs text-pink-50">
            {shareError ? <span className="text-rose-200">{shareError}</span> : shareNotice ? <span className="text-amber-200">{shareNotice}</span> : isCopied ? <><Check className="h-4 w-4 text-emerald-200" /> Link copied: {shareUrl}</> : shareUrl ? "Share link ready. Tap Copy share link." : "Share this birthday preview with one link."}
          </div>
          <Button type="button" variant="secondary" onClick={shareUrl ? copyShareLink : createShareLink} disabled={isSharing || isCopied} className="min-h-8 px-3 text-xs sm:min-h-9 sm:px-4">
            {isCopied ? <Check className="h-4 w-4" /> : shareUrl ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {isSharing ? "Creating..." : isCopied ? "Copied" : shareUrl ? "Copy share link" : "Create share link"}
          </Button>
        </div> : null}

        {data.music ? (
          <div className="mb-1.5 flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-pink-200/15 bg-pink-300/8 px-3 py-1.5">
            <div className="flex min-w-0 items-center gap-3">
              <Music2 className="h-4 w-4 shrink-0 text-pink-200" />
              <span className="truncate text-xs text-pink-50">{data.music.fileName}</span>
            </div>
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={isMusicPlaying ? "Pause music" : "Play music"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
            >
              {isMusicPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>
            <audio
              ref={audioRef}
              src={data.music.url}
              loop
              autoPlay
              onPlay={() => setIsMusicPlaying(true)}
              onPause={() => setIsMusicPlaying(false)}
              className="hidden"
            />
          </div>
        ) : null}

        <div className="mb-1.5 grid shrink-0 grid-cols-6 gap-2 sm:gap-3">
          {SCENE_LABELS.map((item, index) => {
            const active = item.id === scene;
            const completed = SCENE_LABELS.findIndex((entry) => entry.id === scene) > index;
            return (
              <div key={item.id} className="space-y-1">
                <div className={`h-1 rounded-full ${active || completed ? "bg-gradient-to-r from-pink-400 to-fuchsia-500" : "bg-white/10"}`} />
                <p className={`hidden text-[10px] sm:block ${active ? "font-semibold text-white" : "text-[#9f8ca0]"}`}>{item.label}</p>
              </div>
            );
          })}
        </div>

        <div className="min-h-0 flex-1">
          <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {scene === "gate" ? (
              <GateOpening
                name={data.theirName}
                onContinue={() => setScene("opening")}
              />
            ) : null}
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
                isShared={isShared}
              />
            ) : null}
          </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

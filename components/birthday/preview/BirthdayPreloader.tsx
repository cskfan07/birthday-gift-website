"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { motion } from "framer-motion";

import type { BirthdayFormData } from "@/types/birthday";

interface BirthdayPreloaderProps {
  data: BirthdayFormData;
  onComplete: () => void;
}

type AssetTask = {
  id: string;
  load: () => Promise<void>;
};

const imagePreloadPromises = new Map<string, Promise<void>>();
const audioPreloadPromises = new Map<string, Promise<void>>();

function withTimeout(task: Promise<void>, label: string, timeoutMs = 12000) {
  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(() => {
      console.warn(`Birthday preloader timed out while loading: ${label}`);
      resolve();
    }, timeoutMs);

    task
      .catch((error) => {
        console.error(`Birthday preloader could not load: ${label}`, error);
      })
      .finally(() => {
        window.clearTimeout(timeout);
        resolve();
      });
  });
}

function preloadImage(src: string) {
  const existing = imagePreloadPromises.get(src);
  if (existing) {
    return existing;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = async () => {
      try {
        await image.decode?.();
      } catch {
        // Some browsers reject decode after a successful load; the image is still usable.
      }
      resolve();
    };
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });

  imagePreloadPromises.set(src, promise);
  return promise;
}

function preloadAudio(src: string) {
  const existing = audioPreloadPromises.get(src);
  if (existing) {
    return existing;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const audio = document.createElement("audio");
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      audio.oncanplaythrough = null;
      audio.onloadeddata = null;
      audio.onerror = null;
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };

    audio.preload = "auto";
    audio.oncanplaythrough = () => finish();
    audio.onloadeddata = () => finish();
    audio.onerror = () => finish(new Error(src));
    audio.src = src;
    audio.load();
  });

  audioPreloadPromises.set(src, promise);
  return promise;
}

export function BirthdayPreloader({ data, onComplete }: BirthdayPreloaderProps) {
  const [loadedAssets, setLoadedAssets] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const hasCompletedRef = useRef(false);

  const tasks = useMemo<AssetTask[]>(() => {
    const imageSources = [
      "/birthday-preloader.webp",
      "/birthday-gate-closed.webp",
      "/birthday-gate-open.webp",
    ];

    return [
      ...imageSources.map((src) => ({
        id: src,
        load: () => preloadImage(src),
      })),
    ];
  }, []);

  const targetProgress = Math.min(100, Math.round((loadedAssets / Math.max(tasks.length, 1)) * 100));

  useEffect(() => {
    let cancelled = false;

    tasks.forEach((task) => {
      void withTimeout(task.load(), task.id).finally(() => {
        if (!cancelled) {
          setLoadedAssets((current) => Math.min(tasks.length, current + 1));
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [tasks]);

  useEffect(() => {
    if (targetProgress < 100 || !data.music?.url) {
      return;
    }

    void preloadAudio(data.music.url).catch((error) => {
      console.error("Birthday audio preload could not start.", error);
    });
  }, [data.music, targetProgress]);

  useEffect(() => {
    if (targetProgress === 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setIsReady(true);
      const timer = window.setTimeout(onComplete, 850);
      return () => window.clearTimeout(timer);
    }
  }, [onComplete, targetProgress]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center overflow-hidden px-5 py-6 text-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isReady ? 0 : 1 }}
      transition={{ delay: isReady ? 0.28 : 0, duration: 0.55, ease: "easeInOut" }}
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,176,204,0.24),transparent_26rem),radial-gradient(circle_at_15%_82%,rgba(251,191,36,0.16),transparent_22rem),linear-gradient(145deg,#140c19_0%,#281329_48%,#100912_100%)]" />
      {["12%", "24%", "73%", "85%", "46%"].map((left, index) => (
        <span
          key={left}
          className="preloader-heart pointer-events-none absolute text-pink-100/55"
          style={{
            left,
            top: `${18 + index * 14}%`,
            animationDelay: `${index * -1.4}s`,
          }}
          aria-hidden="true"
        >
          {String.fromCodePoint(0x2665)}
        </span>
      ))}

      <div className="relative w-full max-w-[min(88vw,29rem)]">
        <NextImage
          src="/birthday-preloader.webp"
          alt="Cute teddy birthday decoration saying preparing a little surprise"
          width={1374}
          height={1145}
          unoptimized
          loading="eager"
          sizes="(max-width: 640px) 92vw, 560px"
          className="mx-auto h-auto w-full max-h-[min(62dvh,35rem)] object-contain drop-shadow-[0_28px_60px_rgba(244,114,154,0.28)]"
        />

        <div className="mx-auto mt-4 max-w-sm rounded-full border border-white/15 bg-white/10 p-1 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-md">
          <div className="h-3 overflow-hidden rounded-full bg-black/25">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 transition-[width] duration-200 ease-out"
              style={{ width: `${targetProgress}%` }}
            />
          </div>
        </div>

        <p className="mt-4 font-serif text-2xl leading-tight text-white drop-shadow sm:text-3xl">
          Preparing a little surprise... {String.fromCodePoint(0x2764, 0xfe0f)}
        </p>
        <p className="mt-2 text-sm font-semibold text-pink-50/90">
          {isReady ? `${String.fromCodePoint(0x2728)} Surprise is ready! ${String.fromCodePoint(0x2728)}` : `Loading... ${targetProgress}%`}
        </p>
      </div>
    </motion.div>
  );
}

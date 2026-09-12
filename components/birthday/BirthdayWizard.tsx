"use client";

import { useEffect, useRef, useState } from "react";
import { CakeSlice, Check, Heart, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { BirthdayPreview } from "@/components/birthday/BirthdayPreview";
import { StepCake } from "@/components/birthday/StepCake";
import { StepDetails } from "@/components/birthday/StepDetails";
import { StepLetter } from "@/components/birthday/StepLetter";
import { StepMemories } from "@/components/birthday/StepMemories";
import { StepReasons } from "@/components/birthday/StepReasons";
import type { BirthdayFormData, MemoryPhoto } from "@/types/birthday";

const STEP_LABELS = ["Details", "Cake", "Balloons", "Memories", "Letter"];

const INITIAL_DATA: BirthdayFormData = {
  theirName: "",
  yourName: "",
  turningAge: "",
  birthday: "",
  cake: null,
  reasons: ["", "", "", "", ""],
  memories: [],
  letter: "",
  music: null,
};

function createMemoryId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `memory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function BirthdayWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BirthdayFormData>(INITIAL_DATA);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const memoryRef = useRef<MemoryPhoto[]>([]);
  const previewTimerRef = useRef<number | null>(null);

  useEffect(() => {
    memoryRef.current = data.memories;
  }, [data.memories]);

  useEffect(() => {
    return () => {
      memoryRef.current.forEach((memory) => URL.revokeObjectURL(memory.url));
      if (data.music) {
        URL.revokeObjectURL(data.music.url);
      }
      if (previewTimerRef.current) {
        window.clearTimeout(previewTimerRef.current);
      }
    };
  }, [data.music]);

  function updateData(changes: Partial<BirthdayFormData>) {
    setData((current) => ({ ...current, ...changes }));
  }

  async function handleAddMemories(files: File[]) {
    if (files.length === 0) {
      return;
    }
    const newMemories = await Promise.all(Array.from(files).map(async (file) => ({
      id: createMemoryId(),
      fileName: file.name,
      url: await fileToDataUrl(file),
    })));
    updateData({ memories: [...data.memories, ...newMemories].slice(0, 5) });
  }

  function handleRemoveMemory(id: string) {
    const memory = data.memories.find((item) => item.id === id);
    if (memory) {
      URL.revokeObjectURL(memory.url);
    }
    updateData({ memories: data.memories.filter((item) => item.id !== id) });
  }

  async function handleMusicChange(file: File | null) {
    if (data.music) {
      URL.revokeObjectURL(data.music.url);
    }
    updateData({ music: file ? { fileName: file.name, url: await fileToDataUrl(file) } : null });
  }

  function reset() {
    data.memories.forEach((memory) => URL.revokeObjectURL(memory.url));
    if (data.music) {
      URL.revokeObjectURL(data.music.url);
    }
    setData(INITIAL_DATA);
    setStep(1);
    setShowPreview(false);
    setIsLoadingPreview(false);
  }

  function createPreview() {
    setIsLoadingPreview(true);
    previewTimerRef.current = window.setTimeout(() => {
      setIsLoadingPreview(false);
      setShowPreview(true);
    }, 1500);
  }

  if (showPreview) {
    return <BirthdayPreview data={data} onRestart={reset} />;
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-fuchsia-600 text-xl text-white shadow-[0_12px_30px_rgba(244,114,154,0.3)]">
                <Heart className="h-5 w-5 fill-white/20" />
              </div>
              <div>
                <p className="font-serif text-2xl text-white">Our Surprise</p>
                <p className="text-xs text-[#c9b8c7]">Create a birthday story they can feel.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#c9b8c7]">
            <Sparkles className="h-4 w-4 text-pink-200" />
            Made for one unforgettable moment
          </div>
        </header>

        <div className="mb-6 grid grid-cols-5 gap-2 sm:gap-3">
          {STEP_LABELS.map((label, index) => {
            const currentStep = index + 1;
            const complete = currentStep < step;
            const active = currentStep === step;
            return (
              <div key={label} className="space-y-2">
                <div className={`h-1.5 rounded-full transition ${complete || active ? "bg-gradient-to-r from-pink-400 to-fuchsia-500" : "bg-white/10"}`} />
                <div className="flex items-center gap-1.5 text-[11px] text-[#c9b8c7] sm:text-xs">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${complete ? "bg-pink-300/20 text-pink-100" : active ? "bg-pink-400 text-white" : "bg-white/10 text-white/50"}`}>
                    {complete ? <Check className="h-3 w-3" /> : currentStep}
                  </span>
                  <span className={active ? "font-semibold text-white" : "hidden sm:inline"}>{label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.24 }}
          >
            {step === 1 ? (
              <StepDetails data={data} onChange={updateData} onNext={() => setStep(2)} />
            ) : null}
            {step === 2 ? (
              <StepCake
                selectedCake={data.cake}
                onSelect={(cake) => updateData({ cake })}
                onPrevious={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            ) : null}
            {step === 3 ? (
              <StepReasons
                reasons={data.reasons}
                onChange={(reasons) => updateData({ reasons })}
                onPrevious={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            ) : null}
            {step === 4 ? (
              <StepMemories
                memories={data.memories}
                onAdd={handleAddMemories}
                onRemove={handleRemoveMemory}
                onPrevious={() => setStep(3)}
                onNext={() => setStep(5)}
              />
            ) : null}
            {step === 5 ? (
              <StepLetter
                letter={data.letter}
                music={data.music}
                onChange={(letter) => updateData({ letter })}
                onMusicChange={handleMusicChange}
                onPrevious={() => setStep(4)}
                onFinish={createPreview}
                isLoading={isLoadingPreview}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-6 flex items-center justify-between gap-3 text-xs text-[#9f8ca0]">
          <span>Private browser preview · no uploads are sent anywhere</span>
          {isLoadingPreview ? (
            <span className="loading-shimmer rounded-full px-3 py-1.5 text-pink-100">Preparing preview...</span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <CakeSlice className="h-3.5 w-3.5" />
              Five simple steps
            </span>
          )}
        </footer>
      </div>
    </main>
  );
}

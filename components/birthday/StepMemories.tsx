import { useRef, useState } from "react";
import { ImagePlus, Sparkles, Trash2, Upload } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { StepShell } from "@/components/birthday/StepShell";
import type { MemoryPhoto } from "@/types/birthday";

interface StepMemoriesProps {
  memories: MemoryPhoto[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

function FairyLights() {
  return (
    <div className="pointer-events-none absolute left-4 right-4 top-4 flex justify-between sm:left-10 sm:right-10">
      {Array.from({ length: 11 }).map((_, index) => (
        <span
          key={index}
          className="animate-twinkle h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_14px_rgba(253,230,138,0.95)]"
          style={{ animationDelay: `${index * 0.18}s` }}
        />
      ))}
    </div>
  );
}

export function StepMemories({ memories, onAdd, onRemove, onPrevious, onNext }: StepMemoriesProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");

  function handleFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    const remaining = 5 - memories.length;
    const selected = Array.from(files);
    const validFiles = selected.filter((file) => file.type === "image/jpeg" || file.type === "image/png");
    const smallFiles = validFiles.filter((file) => file.size <= 5 * 1024 * 1024);
    const acceptedFiles = smallFiles.slice(0, remaining);

    if (selected.length > remaining) {
      setError("You can add up to 5 photos only.");
    } else if (validFiles.length !== selected.length) {
      setError("Only JPG and PNG photos are supported.");
    } else if (smallFiles.length !== validFiles.length) {
      setError("Each photo must be under 5 MB.");
    } else {
      setError("");
    }

    if (acceptedFiles.length > 0) {
      onAdd(acceptedFiles);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <StepShell
      eyebrow="Step 4 of 5 · The memories"
      title="Hang up the memories."
      description="Choose up to five birthday photos. They will appear on a fairy-light string, ready for the final reveal."
      onPrevious={onPrevious}
      onNext={onNext}
      nextLabel="Continue"
      secondaryAction={
        <Button type="button" variant="ghost" onClick={onNext}>
          Skip for now
        </Button>
      }
    >
      <div className="relative overflow-hidden rounded-[1.7rem] border border-pink-100/10 bg-gradient-to-b from-pink-200/8 to-transparent px-4 pb-6 pt-14 sm:px-10">
        <FairyLights />
        <div className="absolute left-5 right-5 top-7 h-px bg-amber-100/25 sm:left-10 sm:right-10" />

        {memories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {memories.map((memory) => (
              <div key={memory.id} className="group relative overflow-hidden rounded-2xl border border-white/15 bg-black/20">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={memory.url}
                    alt={memory.fileName}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-8">
                  <span className="min-w-0 truncate text-xs text-white">{memory.fileName}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(memory.id)}
                    aria-label={`Remove ${memory.fileName}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/80 text-white transition hover:bg-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 text-center">
            <ImagePlus className="h-9 w-9 text-pink-200/70" />
            <p className="mt-3 text-sm font-semibold text-white">Your memory string is waiting.</p>
            <p className="mt-1 text-xs text-[#c9b8c7]">Add your first photo to light it up.</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4 text-pink-200" />
            {memories.length}/5 memories added
          </div>
          <p className="mt-1 text-xs leading-5 text-[#c9b8c7]">JPG or PNG only, with a maximum size of 5 MB each.</p>
          {error ? <p className="mt-2 text-xs font-medium text-rose-200">{error}</p> : null}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={memories.length >= 5}>
            <Upload className="h-4 w-4" />
            Add photos
          </Button>
        </div>
      </div>
    </StepShell>
  );
}

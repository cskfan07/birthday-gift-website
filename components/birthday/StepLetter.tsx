import { FileHeart, Music2, PenLine, Upload, X } from "lucide-react";

import { READY_LETTERS } from "@/lib/birthday-options";
import { StepShell } from "@/components/birthday/StepShell";
import type { MusicTrack } from "@/types/birthday";

interface StepLetterProps {
  letter: string;
  music: MusicTrack | null;
  onChange: (letter: string) => void;
  onMusicChange: (file: File | null) => void;
  onPrevious: () => void;
  onFinish: () => void;
  isLoading?: boolean;
}

export function StepLetter({ letter, music, onChange, onMusicChange, onPrevious, onFinish, isLoading = false }: StepLetterProps) {
  const [musicError, setMusicError] = useState("");

  function handleMusicFile(file: File | null) {
    if (!file) {
      setMusicError("");
      onMusicChange(null);
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase();
    const supportedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a"];
    const supportedExtensions = ["mp3", "wav", "m4a"];
    if (!supportedTypes.includes(file.type) && !supportedExtensions.includes(extension ?? "")) {
      setMusicError("Only MP3, WAV, and M4A audio files are supported.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setMusicError("Music file must be under 50 MB.");
      return;
    }
    setMusicError("");
    onMusicChange(file);
  }

  return (
    <StepShell
      eyebrow="Step 5 of 5 · The letter"
      title="Write the part they will keep."
      description="Write a birthday letter in your own words, or choose a ready-made message and make it yours."
      onPrevious={onPrevious}
      onNext={onFinish}
      nextLabel={isLoading ? "Preparing..." : "Create my preview"}
      nextDisabled={!letter.trim() || isLoading}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <label className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <PenLine className="h-4 w-4 text-pink-200" />
            Your birthday letter
          </div>
          <textarea
            value={letter}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Write something they will want to read again..."
            className="soft-input min-h-[280px] w-full resize-y rounded-[1.5rem] px-4 py-4 text-sm leading-7"
          />
          <p className="text-xs text-[#c9b8c7]">You can edit a ready-made message after selecting it.</p>
        </label>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <FileHeart className="h-4 w-4 text-pink-200" />
            Choose a ready message
          </div>
          <div className="space-y-2">
            {READY_LETTERS.map((readyLetter, index) => (
              <button
                key={readyLetter}
                type="button"
                onClick={() => onChange(readyLetter)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-xs leading-6 text-[#eadcea] transition hover:border-pink-300/35 hover:bg-pink-300/8"
              >
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-100/55">
                  Message 0{index + 1}
                </span>
                {readyLetter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-pink-200/10 bg-pink-300/5 p-4 text-sm leading-6 text-[#e5cddd]">
        <span className="text-xl">{String.fromCodePoint(0x1f48c)}</span>
        <p>After the final button, we will take a short moment to prepare their preview.</p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Music2 className="h-4 w-4 text-pink-200" />
          Add your music
        </div>
        <p className="mt-1 text-xs text-[#c9b8c7]">Choose an audio file to play throughout the preview.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 text-xs font-semibold text-white transition hover:border-pink-300/40 hover:bg-white/12">
            <Upload className="h-4 w-4" />
            {music ? "Change music" : "Choose audio"}
            <input
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,.mp3,.wav,.m4a"
              className="sr-only"
              onChange={(event) => handleMusicFile(event.target.files?.[0] ?? null)}
            />
          </label>
          {music ? (
            <div className="flex min-w-0 items-center gap-2 text-xs text-pink-100">
              <span className="max-w-[16rem] truncate">{music.fileName}</span>
              <button
                type="button"
                onClick={() => onMusicChange(null)}
                aria-label="Remove music"
                className="rounded-full p-1 text-pink-100/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
        {musicError ? <p className="mt-2 text-xs text-rose-200">{musicError}</p> : null}
      </div>
    </StepShell>
  );
}

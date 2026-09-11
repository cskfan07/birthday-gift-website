"use client";

import { FormEvent, useState } from "react";
import { Check, ExternalLink, Gift, LoaderCircle, X } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface GiftSurpriseProps {
  onClose: () => void;
}

function isFlipkartUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "flipkart.com" || url.hostname.endsWith(".flipkart.com"));
  } catch {
    return false;
  }
}

export function GiftSurprise({ onClose }: GiftSurpriseProps) {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submitGiftRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending || sent) return;

    const trimmedLink = link.trim();
    if (!isFlipkartUrl(trimmedLink)) {
      setError("Please paste a valid HTTPS Flipkart product link.");
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setError("Gift requests are not configured yet. Please try again later.");
      return;
    }

    setError("");
    setIsSending(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ flipkart_link: trimmedLink, _subject: "New birthday gift request" }),
      });
      if (!response.ok) throw new Error("Gift request failed");
      setSent(true);
    } catch {
      setError("Request send nahi ho paayi. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="gift-title">
      <div className="soft-panel relative w-full max-w-md rounded-[2rem] border-pink-200/20 p-6 sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close gift request" className="absolute right-4 top-4 rounded-full p-2 text-pink-100/70 hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>

        {sent ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
              <Check className="h-8 w-8" />
            </div>
            <h2 id="gift-title" className="mt-5 font-serif text-3xl text-white">Gift Request Sent!</h2>
            <p className="mt-4 text-sm leading-7 text-[#d9c9d8]">Link mujhe mil gaya ❤️<br />Ab payment meri taraf se. Tum bas wait karo 🎁</p>
            <Button type="button" variant="secondary" onClick={onClose} className="mt-7">Done</Button>
          </div>
        ) : (
          <form onSubmit={submitGiftRequest}>
            <Gift className="h-9 w-9 text-pink-200" />
            <h2 id="gift-title" className="mt-4 font-serif text-3xl text-white">Choose something for yourself ❤️</h2>
            <p className="mt-3 text-sm leading-6 text-[#d9c9d8]">Flipkart par apni pasand ka koi bhi product <strong className="text-white">₹500 ke andar</strong> choose karo, phir uska link yahan paste karo.</p>
            <label htmlFor="flipkart-link" className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-pink-100/70">Paste Flipkart Product Link</label>
            <input id="flipkart-link" type="url" value={link} onChange={(event) => { setLink(event.target.value); setError(""); }} placeholder="Paste your Flipkart link here..." className="soft-input mt-2 h-12 w-full rounded-xl px-4 text-sm" required />
            {error ? <p className="mt-2 text-xs text-rose-200">{error}</p> : null}
            <Button type="submit" disabled={isSending} className="mt-6 w-full">
              {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
              {isSending ? "Sending..." : "Send Gift Request"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
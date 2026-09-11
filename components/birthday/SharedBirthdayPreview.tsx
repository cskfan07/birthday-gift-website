"use client";

import { BirthdayPreview } from "@/components/birthday/BirthdayPreview";
import type { BirthdayFormData } from "@/types/birthday";

export function SharedBirthdayPreview({ data }: { data: BirthdayFormData }) {
  return <BirthdayPreview data={data} onRestart={() => window.location.reload()} />;
}

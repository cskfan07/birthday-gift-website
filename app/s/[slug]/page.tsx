import { SharedBirthdayPreview } from "@/components/birthday/SharedBirthdayPreview";
import type { BirthdayFormData } from "@/types/birthday";

interface SharedPageProps {
  params: Promise<{ slug: string }>;
}

async function getBirthday(slug: string): Promise<BirthdayFormData | null> {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const response = await fetch(`${appUrl}/api/birthdays/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as BirthdayFormData;
}

export default async function SharedBirthdayPage({ params }: SharedPageProps) {
  const { slug } = await params;
  const data = await getBirthday(slug);

  if (!data) {
    return <main className="flex min-h-screen items-center justify-center px-6 text-center text-white">This birthday surprise could not be found.</main>;
  }

  return <SharedBirthdayPreview data={data} />;
}

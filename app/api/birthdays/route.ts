import { NextResponse } from "next/server";

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }
  return { url, key };
}

export async function POST(request: Request) {
  try {
    const { url, key } = supabaseConfig();
    const body = await request.json();
    const response = await fetch(`${url}/rest/v1/birthdays`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ slug: body.slug, data: body.data }),
    });

    if (!response.ok) {
      const details = await response.text();
      let message = "Could not save birthday";
      try {
        const parsed = JSON.parse(details) as { message?: string; hint?: string; code?: string };
        message = [parsed.message, parsed.hint, parsed.code ? `Code: ${parsed.code}` : ""].filter(Boolean).join(" ") || message;
      } catch {
        message = details || message;
      }
      return NextResponse.json({ error: message.slice(0, 500) }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase connection error";
    return NextResponse.json({ error: `Supabase connection failed: ${message}` }, { status: 502 });
  }
}

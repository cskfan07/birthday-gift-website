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
      return NextResponse.json({ error: "Could not save birthday" }, { status: response.status });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save birthday" }, { status: 500 });
  }
}

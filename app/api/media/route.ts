import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase environment variables are missing" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const path = formData.get("path");
    if (!(file instanceof File) || typeof path !== "string" || !path) {
      return NextResponse.json({ error: "A media file and storage path are required" }, { status: 400 });
    }

    const safePath = path.replace(/[^a-zA-Z0-9._/-]/g, "-");
    const response = await fetch(`${supabaseUrl}/storage/v1/object/birthday-media/${safePath}`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: await file.arrayBuffer(),
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json({ error: `Supabase media upload failed: ${details.slice(0, 300)}` }, { status: response.status });
    }

    return NextResponse.json({ url: `${supabaseUrl}/storage/v1/object/public/birthday-media/${safePath}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown media upload error";
    return NextResponse.json({ error: `Media upload failed: ${message}` }, { status: 502 });
  }
}

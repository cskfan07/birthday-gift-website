import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Supabase environment variables are missing" }, { status: 500 });
  }

  const response = await fetch(
    `${url}/rest/v1/birthdays?slug=eq.${encodeURIComponent(slug)}&select=data&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Could not load birthday" }, { status: response.status });
  }

  const rows = (await response.json()) as { data: unknown }[];
  if (!rows[0]) {
    return NextResponse.json({ error: "Birthday not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0].data);
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "superbowl2026";

function checkAuth(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from("app_settings")
    .select("lock_submissions")
    .eq("id", "default")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const lock = (data as { lock_submissions: boolean } | null)?.lock_submissions ?? false;
  return NextResponse.json({ lock_submissions: lock });
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const lock = Boolean(body?.lock_submissions);

    const { error } = await supabaseAdmin
      .from("app_settings")
      .update({ lock_submissions: lock, updated_at: new Date().toISOString() })
      .eq("id", "default");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, lock_submissions: lock });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

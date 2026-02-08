import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { GUEST_LIST } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guest_name, ...answers } = body as { guest_name: string; [k: string]: unknown };

    if (!guest_name || typeof guest_name !== "string") {
      return NextResponse.json({ error: "Guest name is required" }, { status: 400 });
    }
    if (!GUEST_LIST.includes(guest_name as (typeof GUEST_LIST)[number])) {
      return NextResponse.json({ error: "Invalid guest name" }, { status: 400 });
    }

    const { data: settings } = await supabaseAdmin
      .from("app_settings")
      .select("lock_submissions")
      .eq("id", "default")
      .single();

    if (settings?.lock_submissions) {
      return NextResponse.json({ error: "Submissions are locked." }, { status: 403 });
    }

    const payload: Record<string, unknown> = {
      guest_name,
      updated_at: new Date().toISOString(),
    };
    for (let q = 1; q <= 10; q++) {
      const key = `q${q}`;
      const val = answers[key];
      payload[key] = typeof val === "string" ? val : null;
    }

    const { error } = await supabaseAdmin.from("predictions").upsert(payload, {
      onConflict: "guest_name",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "superbowl2026";

function checkAuth(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    for (let q = 1; q <= 11; q++) {
      const { error } = await supabaseAdmin
        .from("results")
        .update({ correct_answer: "", updated_at: new Date().toISOString() } as never)
        .eq("question_number", q);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

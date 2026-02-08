import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "superbowl2026";

function checkAuth(request: Request): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  return auth.slice(7) === ADMIN_PASSWORD;
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { question_number, correct_answer } = body as {
      question_number: number;
      correct_answer: string;
    };
    if (!question_number || question_number < 1 || question_number > 10) {
      return NextResponse.json({ error: "Invalid question_number" }, { status: 400 });
    }
    if (typeof correct_answer !== "string") {
      return NextResponse.json({ error: "Invalid correct_answer" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("results")
      .update({ correct_answer: correct_answer.trim(), updated_at: new Date().toISOString() } as never)
      .eq("question_number", question_number);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

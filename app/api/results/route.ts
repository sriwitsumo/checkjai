import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quiz_type, session_id, score, max_score, result_label, answers, browser_info } = body;

    if (!quiz_type || score === undefined || max_score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = getDb();
    const result = await sql`
      INSERT INTO quiz_results (quiz_type, session_id, score, max_score, result_label, answers, browser_info)
      VALUES (${quiz_type}, ${session_id}, ${score}, ${max_score}, ${result_label}, ${JSON.stringify(answers)}, ${JSON.stringify(browser_info)})
      RETURNING id, created_at
    `;

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const quiz_type = searchParams.get("quiz_type");
    const limit = parseInt(searchParams.get("limit") || "50");

    const sql = getDb();
    const rows = quiz_type
      ? await sql`SELECT id, quiz_type, score, max_score, result_label, created_at FROM quiz_results WHERE quiz_type = ${quiz_type} ORDER BY created_at DESC LIMIT ${limit}`
      : await sql`SELECT id, quiz_type, score, max_score, result_label, created_at FROM quiz_results ORDER BY created_at DESC LIMIT ${limit}`;

    return NextResponse.json({ results: rows });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

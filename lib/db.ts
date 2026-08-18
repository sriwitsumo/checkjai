import { neon } from "@neondatabase/serverless";

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id SERIAL PRIMARY KEY,
      quiz_type VARCHAR(100) NOT NULL,
      session_id VARCHAR(100),
      score INTEGER NOT NULL,
      max_score INTEGER NOT NULL,
      result_label VARCHAR(200),
      answers JSONB,
      browser_info JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

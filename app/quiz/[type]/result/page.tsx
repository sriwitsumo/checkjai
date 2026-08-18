"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { quizzes } from "@/data/quizzes";
import Link from "next/link";

function ResultContent() {
  const { type } = useParams<{ type: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const quiz = quizzes[type];
  const score = parseInt(searchParams.get("score") || "0");
  const max = parseInt(searchParams.get("max") || "1");
  const label = searchParams.get("label") || "";

  if (!quiz) {
    router.push("/");
    return null;
  }

  const resultBand = quiz.results.find(
    (r) => score >= r.min && score <= r.max
  ) || quiz.results[quiz.results.length - 1];

  const pct = Math.round((score / max) * 100);

  const circumference = 2 * Math.PI * 48;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          margin: "0 auto",
        }}
        className="animate-fade-in"
      >
        {/* Result emoji */}
        <div style={{ textAlign: "center", marginBottom: "8px", fontSize: "56px" }}>
          {resultBand.emoji}
        </div>

        {/* Quiz label */}
        <p
          style={{
            fontFamily: "var(--font-mitr)",
            fontSize: "13px",
            color: quiz.color,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            margin: "0 0 8px",
          }}
        >
          {quiz.title}
        </p>

        {/* Score ring */}
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 24px" }}>
          <div style={{ position: "relative", width: "120px", height: "120px" }}>
            <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="var(--border)"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke={quiz.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mitr)",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pct}%
              </span>
            </div>
          </div>
        </div>

        {/* Result card */}
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "24px",
            padding: "28px 24px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            marginBottom: "16px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-mitr)",
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: "0 0 12px",
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            {resultBand.label}
          </h1>

          <div
            style={{
              width: "40px",
              height: "3px",
              background: quiz.color,
              borderRadius: "99px",
              margin: "0 auto 16px",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-sarabun)",
              fontSize: "16px",
              color: "var(--text-secondary)",
              margin: "0 0 20px",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            {resultBand.description}
          </p>

          {/* Advice */}
          <div
            style={{
              background: "var(--bg-muted)",
              borderRadius: "14px",
              padding: "14px 16px",
              borderLeft: `3px solid ${quiz.color}`,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sarabun)",
                fontSize: "14px",
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              💡 {resultBand.advice}
            </p>
          </div>
        </div>

        {/* Score detail */}
        <p
          style={{
            fontFamily: "var(--font-sarabun)",
            fontSize: "13px",
            color: "var(--text-muted)",
            textAlign: "center",
            margin: "0 0 28px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          คะแนน {score} / {max} คะแนน
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => router.push(`/quiz/${type}`)}
            style={{
              background: quiz.color,
              border: "none",
              borderRadius: "14px",
              padding: "16px",
              color: "#fff",
              fontFamily: "var(--font-mitr)",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              transition: "opacity 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            ทำแบบทดสอบอีกครั้ง
          </button>

          <Link href="/" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "var(--bg-muted)",
                border: "2px solid var(--border)",
                borderRadius: "14px",
                padding: "14px",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mitr)",
                fontSize: "16px",
                cursor: "pointer",
                width: "100%",
                transition: "opacity 0.2s",
              }}
            >
              ทำแบบทดสอบอื่น
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ResultContent />
    </Suspense>
  );
}

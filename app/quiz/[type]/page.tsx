"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { quizzes } from "@/data/quizzes";

export default function QuizPage() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const quiz = quizzes[type];

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    if (!quiz) router.push("/");
  }, [quiz, router]);

  const handleAnswer = useCallback(
    (score: number, idx: number) => {
      if (animating || selected !== null) return;
      setSelected(idx);

      setTimeout(() => {
        const newAnswers = [...answers, score];
        setAnimating(true);

        setTimeout(() => {
          if (currentQ + 1 < quiz.questions.length) {
            setCurrentQ(currentQ + 1);
            setAnswers(newAnswers);
            setSelected(null);
            setAnimating(false);
          } else {
            const total = newAnswers.reduce((a, b) => a + b, 0);
            const maxScore = quiz.questions.length * 4;
            const resultBand = quiz.results.find(
              (r) => total >= r.min && total <= r.max
            ) || quiz.results[quiz.results.length - 1];

            const browserInfo = {
              userAgent: navigator.userAgent,
              screen: `${screen.width}x${screen.height}`,
              language: navigator.language,
              platform: navigator.platform,
              timestamp: new Date().toISOString(),
            };

            const payload = {
              quiz_type: quiz.id,
              session_id: sessionId,
              score: total,
              max_score: maxScore,
              result_label: resultBand.label,
              answers: quiz.questions.map((q, i) => ({
                question: q.text,
                answer: q.answers[
                  quiz.questions[i].answers.findIndex((a) => a.score === newAnswers[i]) >= 0
                    ? quiz.questions[i].answers.findIndex((a) => a.score === newAnswers[i])
                    : 0
                ]?.text,
                score: newAnswers[i],
              })),
              browser_info: browserInfo,
            };

            fetch("/api/results", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }).catch(console.error);

            router.push(
              `/quiz/${type}/result?score=${total}&max=${maxScore}&label=${encodeURIComponent(resultBand.label)}`
            );
          }
        }, 320);
      }, 400);
    },
    [animating, selected, answers, currentQ, quiz, router, sessionId, type]
  );

  if (!quiz) return null;

  const question = quiz.questions[currentQ];
  const progress = ((currentQ) / quiz.questions.length) * 100;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "20px 20px 0",
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              background: "var(--bg-muted)",
              border: "none",
              borderRadius: "12px",
              padding: "8px 14px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-sarabun)",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← กลับ
          </button>
          <span
            style={{
              fontFamily: "var(--font-sarabun)",
              fontSize: "13px",
              color: "var(--text-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {currentQ + 1} / {quiz.questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "6px",
            background: "var(--border)",
            borderRadius: "99px",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: quiz.color,
              borderRadius: "99px",
              transition: "width 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div
        style={{
          flex: 1,
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
          padding: "0 20px 40px",
        }}
      >
        <div
          key={currentQ}
          className="animate-slide-in"
          style={{ opacity: animating ? 0 : 1, transition: "opacity 0.3s" }}
        >
          {/* Emoji */}
          <div
            style={{
              fontSize: "48px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {question.emoji}
          </div>

          {/* Quiz title */}
          <p
            style={{
              fontFamily: "var(--font-mitr)",
              fontSize: "13px",
              color: quiz.color,
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              margin: "0 0 12px",
              fontWeight: 500,
            }}
          >
            {quiz.title}
          </p>

          {/* Question text */}
          <h2
            style={{
              fontFamily: "var(--font-mitr)",
              fontSize: "clamp(18px, 4.5vw, 22px)",
              fontWeight: 600,
              color: "var(--text-primary)",
              textAlign: "center",
              margin: "0 0 32px",
              lineHeight: 1.5,
              textWrap: "balance",
            }}
          >
            {question.text}
          </h2>

          {/* Answer options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {question.answers.map((answer, idx) => {
              const isSelected = selected === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(answer.score, idx)}
                  style={{
                    background: isSelected ? quiz.color : "var(--bg-card)",
                    border: isSelected
                      ? `2px solid ${quiz.color}`
                      : "2px solid var(--border)",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    textAlign: "left",
                    cursor: selected !== null ? "default" : "pointer",
                    fontFamily: "var(--font-sarabun)",
                    fontSize: "15px",
                    color: isSelected ? "#fff" : "var(--text-primary)",
                    lineHeight: 1.5,
                    transition: "all 0.2s",
                    transform: isSelected ? "scale(0.98)" : "scale(1)",
                    boxShadow: isSelected ? `0 4px 16px ${quiz.color}50` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selected === null) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = quiz.color;
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selected === null) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }
                  }}
                >
                  {answer.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

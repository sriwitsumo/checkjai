"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const quizCards = [
  {
    id: "does-he-like-me",
    title: "เขาชอบเรากลับไหม?",
    subtitle: "อ่านสัญญาณใจเขาให้ออก",
    emoji: "💌",
    bg: "linear-gradient(135deg, #ff6b8a 0%, #ff3d7f 100%)",
    shadow: "0 8px 32px rgba(255,107,138,0.35)",
    questions: 10,
  },
  {
    id: "chemistry",
    title: "เคมีระหว่างเรา",
    subtitle: "วัดแรงดึงดูดที่จับต้องไม่ได้",
    emoji: "⚗️",
    bg: "linear-gradient(135deg, #c4b7e7 0%, #9b7ed8 100%)",
    shadow: "0 8px 32px rgba(155,126,216,0.35)",
    questions: 8,
  },
  {
    id: "how-much",
    title: "เราชอบเขาขนาดไหน?",
    subtitle: "วัดความลึกของความรู้สึก",
    emoji: "❤️‍🔥",
    bg: "linear-gradient(135deg, #f7c48a 0%, #f09030 100%)",
    shadow: "0 8px 32px rgba(240,144,48,0.35)",
    questions: 8,
  },
  {
    id: "flirt-style",
    title: "จีบเขาถูกวิธีไหม?",
    subtitle: "ประเมินสไตล์การจีบของเรา",
    emoji: "🎯",
    bg: "linear-gradient(135deg, #4ecdc4 0%, #2bb5ac 100%)",
    shadow: "0 8px 32px rgba(78,205,196,0.35)",
    questions: 8,
  },
];

function Particle({ style, emoji }: { style: React.CSSProperties; emoji: string }) {
  return (
    <div
      className="pointer-events-none absolute select-none"
      style={{
        ...style,
        animation: `float-up ${3 + Math.random() * 4}s ease-in infinite`,
        animationDelay: `${Math.random() * 6}s`,
      }}
    >
      {emoji}
    </div>
  );
}

export default function HomePage() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    emoji: ["💗", "✨", "💫", "🌸", "💕", "⭐"][i % 6],
    left: `${8 + i * 8}%`,
    bottom: "-20px",
    fontSize: `${14 + (i % 3) * 6}px`,
    opacity: 0.6,
  }));

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0",
        overflowX: "hidden",
      }}
    >
      {/* Ambient particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {particles.map((p, i) => (
          <Particle
            key={i}
            emoji={p.emoji}
            style={{
              left: p.left,
              bottom: p.bottom,
              fontSize: p.fontSize,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "480px",
          margin: "0 auto",
          padding: "48px 20px 80px",
        }}
      >
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "48px" }} className="animate-fade-in">
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>💝</div>
          <h1
            style={{
              fontFamily: "var(--font-mitr)",
              fontSize: "clamp(28px, 7vw, 36px)",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: "0 0 8px",
              textWrap: "balance",
              letterSpacing: "-0.5px",
            }}
          >
            CheckJai
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sarabun)",
              fontSize: "16px",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            แบบทดสอบความรู้สึก · วัดเคมี · อ่านใจ
          </p>
        </header>

        {/* Quiz cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {quizCards.map((quiz, i) => (
            <Link
              key={quiz.id}
              href={`/quiz/${quiz.id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="animate-fade-in"
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "20px",
                  padding: "20px 20px 20px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  boxShadow: "var(--shadow)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  animationDelay: `${i * 0.1}s`,
                  animationFillMode: "both",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow)";
                }}
              >
                {/* Emoji badge */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: quiz.bg,
                    boxShadow: quiz.shadow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    flexShrink: 0,
                  }}
                >
                  {quiz.emoji}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-mitr)",
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      margin: "0 0 3px",
                      lineHeight: 1.3,
                    }}
                  >
                    {quiz.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-sarabun)",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      margin: "0 0 6px",
                    }}
                  >
                    {quiz.subtitle}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-sarabun)",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      background: "var(--bg-muted)",
                      padding: "2px 8px",
                      borderRadius: "20px",
                    }}
                  >
                    {quiz.questions} คำถาม
                  </span>
                </div>

                {/* Arrow */}
                <div style={{ color: "var(--text-muted)", fontSize: "20px", flexShrink: 0 }}>→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            ผลการทดสอบเพื่อความสนุกและข้อคิด ไม่ใช่คำวินิจฉัยทางจิตวิทยา 💜
          </p>
        </footer>
      </div>
    </main>
  );
}

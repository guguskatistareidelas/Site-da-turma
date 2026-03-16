// pages/Home.jsx
// The landing page — a grid of subject "binder tabs".

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUBJECTS } from "../subjects";
import { useAdmin } from "../contexts/AdminContext";
import { ChevronRight, Plus } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [hovered, setHovered] = useState(null);

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 pt-12 pb-32">
      {/* Hero */}
      <section className="text-center mb-14 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-white/50 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Shared study space
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Your Class<br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Digital Binder
          </span>
        </h2>
        <p className="text-white/50 text-base max-w-sm mx-auto">
          A shared study repository for our class. Browse summaries, slides, and exercises by subject.
        </p>
      </section>

      {/* Subject grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SUBJECTS.map((subject, i) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            delay={i * 80}
            isHovered={hovered === subject.id}
            onHover={() => setHovered(subject.id)}
            onLeave={() => setHovered(null)}
            onClick={() => navigate(`/subject/${subject.id}`)}
          />
        ))}
      </div>

      {/* Admin: add subject hint */}
      {isAdmin && (
        <div className="mt-6 glass border border-dashed border-white/10 rounded-2xl px-6 py-5 flex items-center gap-4 text-white/30 text-sm cursor-pointer hover:border-white/20 hover:bg-white/5 transition-all">
          <Plus size={20} className="text-white/20" />
          Add a new subject (edit <code className="text-indigo-400">src/subjects.js</code>)
        </div>
      )}
    </main>
  );
}

// ── Subject card ─────────────────────────────────────────────
function SubjectCard({ subject, delay, isHovered, onHover, onLeave, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="glass group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-white/15 animate-float-in overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: isHovered ? `0 16px 48px ${subject.glow}` : "none",
      }}
    >
      {/* Gradient top strip */}
      <div
        className="h-1.5 w-full"
        style={{ background: subject.gradient }}
      />

      <div className="p-7">
        {/* Emoji + name */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ background: subject.gradient }}
          >
            {subject.emoji}
          </div>
          <ChevronRight
            size={20}
            className="text-white/20 mt-1 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/50"
          />
        </div>

        <h3 className="font-display text-xl font-semibold text-white mb-1.5">
          {subject.name}
        </h3>
        <p className="text-sm text-white/40">{subject.description}</p>

        {/* Accent dot */}
        <div
          className="mt-5 w-6 h-1 rounded-full"
          style={{ background: subject.accent, opacity: 0.6 }}
        />
      </div>
    </div>
  );
}

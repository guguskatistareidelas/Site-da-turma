// pages/SubjectPage.jsx
// Shows the three sections for a given subject: summaries, slides, exercises.

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, X, Image, FileText, BookOpen,
  Download, ExternalLink, Presentation,
} from "lucide-react";
import { SUBJECTS } from "../subjects";
import { useAdmin } from "../contexts/AdminContext";
import api from "../hooks/useApi";
import Lightbox from "../components/Lightbox";
import UploadModal from "../components/UploadModal";

export default function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const subject = SUBJECTS.find((s) => s.id === subjectId);

  const [summaries, setSummaries] = useState([]);
  const [slides, setSlides] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lbIndex, setLbIndex] = useState(null);

  // Upload modal state
  const [uploadType, setUploadType] = useState(null); // "summary" | "slide" | "exercise"

  // ── Fetch all files ───────────────────────────────────────
  const fetchFiles = useCallback(async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const [s, sl, ex] = await Promise.all([
        api.get(`/subjects/${subjectId}/files?type=summary`),
        api.get(`/subjects/${subjectId}/files?type=slide`),
        api.get(`/subjects/${subjectId}/files?type=exercise`),
      ]);
      setSummaries(s.data);
      setSlides(sl.data);
      setExercises(ex.data);
    } catch {
      // Demo mode: use empty arrays
    } finally {
      setLoading(false);
    }
  }, [subjectId, subject]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  // ── Delete file ───────────────────────────────────────────
  const deleteFile = async (fileId, type) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.delete(`/subjects/${subjectId}/files/${fileId}`);
      if (type === "summary") setSummaries((p) => p.filter((f) => f.id !== fileId));
      if (type === "slide") setSlides((p) => p.filter((f) => f.id !== fileId));
      if (type === "exercise") setExercises((p) => p.filter((f) => f.id !== fileId));
    } catch { alert("Delete failed."); }
  };

  // ── Upload success callback ───────────────────────────────
  const onUploadSuccess = (file) => {
    if (file.type === "summary") setSummaries((p) => [file, ...p]);
    if (file.type === "slide") setSlides((p) => [file, ...p]);
    if (file.type === "exercise") setExercises((p) => [file, ...p]);
  };

  if (!subject) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-white/40">
        <p>Subject not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-indigo-400 hover:underline text-sm">
          Go back home
        </button>
      </main>
    );
  }

  const summaryUrls = summaries.map((s) => s.url);

  return (
    <>
      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-32">
        {/* ── Back button ─────────────────────────── */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to binder
        </button>

        {/* ── Subject header ──────────────────────── */}
        <div
          className="glass rounded-3xl p-8 mb-10 overflow-hidden relative animate-float-in"
          style={{ boxShadow: `0 16px 60px ${subject.glow}` }}
        >
          {/* Background gradient blob */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: subject.gradient }}
          />
          <div className="relative flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl shrink-0"
              style={{ background: subject.gradient }}
            >
              {subject.emoji}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">{subject.name}</h1>
              <p className="text-white/40 text-sm mt-1">{subject.description}</p>
            </div>
          </div>
        </div>

        {/* ── Loading skeleton ────────────────────── */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="space-y-10">
            {/* ── SUMMARIES ───────────────────────── */}
            <Section
              title="Summaries"
              icon={<Image size={18} />}
              subject={subject}
              isAdmin={isAdmin}
              onAdd={() => setUploadType("summary")}
            >
              {summaries.length === 0 && !isAdmin && (
                <EmptyState text="No summaries yet." />
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {summaries.map((s, i) => (
                  <SummaryCard
                    key={s.id}
                    file={s}
                    index={i}
                    isAdmin={isAdmin}
                    onClick={() => setLbIndex(i)}
                    onDelete={() => deleteFile(s.id, "summary")}
                  />
                ))}
              </div>
            </Section>

            {/* ── SLIDES ──────────────────────────── */}
            <Section
              title="Slides & Presentations"
              icon={<Presentation size={18} />}
              subject={subject}
              isAdmin={isAdmin}
              onAdd={() => setUploadType("slide")}
            >
              {slides.length === 0 && !isAdmin && (
                <EmptyState text="No slides yet." />
              )}
              <div className="space-y-3">
                {slides.map((s) => (
                  <SlideRow
                    key={s.id}
                    file={s}
                    subject={subject}
                    isAdmin={isAdmin}
                    onDelete={() => deleteFile(s.id, "slide")}
                  />
                ))}
              </div>
            </Section>

            {/* ── EXERCISES ───────────────────────── */}
            <Section
              title="Exercise Repository"
              icon={<BookOpen size={18} />}
              subject={subject}
              isAdmin={isAdmin}
              onAdd={() => setUploadType("exercise")}
            >
              {exercises.length === 0 && !isAdmin && (
                <EmptyState text="No exercises yet." />
              )}
              <div className="space-y-2">
                {exercises.map((e) => (
                  <ExerciseRow
                    key={e.id}
                    file={e}
                    subject={subject}
                    isAdmin={isAdmin}
                    onDelete={() => deleteFile(e.id, "exercise")}
                  />
                ))}
              </div>
            </Section>
          </div>
        )}
      </main>

      {/* ── Lightbox ──────────────────────────────── */}
      {lbIndex !== null && (
        <Lightbox
          images={summaryUrls}
          index={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((i) => Math.max(0, i - 1))}
          onNext={() => setLbIndex((i) => Math.min(summaryUrls.length - 1, i + 1))}
        />
      )}

      {/* ── Upload modal ──────────────────────────── */}
      {uploadType && (
        <UploadModal
          subjectId={subjectId}
          type={uploadType}
          onClose={() => setUploadType(null)}
          onSuccess={onUploadSuccess}
        />
      )}
    </>
  );
}

// ── Reusable section wrapper ─────────────────────────────────
function Section({ title, icon, subject, isAdmin, onAdd, children }) {
  return (
    <section className="animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: subject.gradient }}
          >
            <span style={{ color: "#0f1117" }}>{icon}</span>
          </div>
          <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        </div>
        {isAdmin && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white/70 glass hover:bg-white/10 transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

// ── Summary image card ───────────────────────────────────────
function SummaryCard({ file, isAdmin, onClick, onDelete }) {
  return (
    <div className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-square glass border border-white/5 hover:border-white/15 transition-all hover:scale-[1.03] hover:shadow-xl"
      onClick={onClick}
    >
      <img
        src={file.url}
        alt={file.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
        <p className="text-xs text-white font-medium line-clamp-2">{file.title}</p>
      </div>
      {isAdmin && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

// ── Slide row ────────────────────────────────────────────────
function SlideRow({ file, subject, isAdmin, onDelete }) {
  const isLink = file.mimeType === "link";
  return (
    <div className="glass flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-white/5 transition-colors group">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: subject.gradient }}
      >
        <FileText size={16} style={{ color: "#0f1117" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{file.title}</p>
        <p className="text-xs text-white/30 mt-0.5">{isLink ? "Google Slides" : file.mimeType?.split("/")[1]?.toUpperCase()}</p>
      </div>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass hover:bg-white/10 transition-colors text-white/60 hover:text-white shrink-0"
      >
        {isLink ? <ExternalLink size={13} /> : <Download size={13} />}
        {isLink ? "Open" : "Download"}
      </a>
      {isAdmin && (
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:bg-red-400/10"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ── Exercise row ─────────────────────────────────────────────
function ExerciseRow({ file, subject, isAdmin, onDelete }) {
  return (
    <div className="glass flex items-center gap-4 px-5 py-3.5 rounded-xl hover:bg-white/5 transition-colors group">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: subject.gradient }}
      >
        <BookOpen size={14} style={{ color: "#0f1117" }} />
      </div>
      <p className="flex-1 text-sm text-white/80 truncate">{file.title}</p>
      <span className="text-xs text-white/25 shrink-0">
        {file.mimeType?.split("/")[1]?.toUpperCase()}
      </span>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
      >
        <Download size={14} />
      </a>
      {isAdmin && (
        <button
          onClick={onDelete}
          className="w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:bg-red-400/10"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
function EmptyState({ text }) {
  return (
    <div className="glass rounded-2xl p-8 text-center text-white/25 text-sm border border-dashed border-white/10">
      {text}
    </div>
  );
}

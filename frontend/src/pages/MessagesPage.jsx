// pages/MessagesPage.jsx
// Admin-only page: shows anonymous suggestions as coloured post-it notes.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ArrowLeft, RefreshCw } from "lucide-react";
import { useAdmin } from "../contexts/AdminContext";
import api from "../hooks/useApi";

export default function MessagesPage() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/suggestions");
      setMessages(data);
    } catch {
      setError("Could not load messages. Make sure you're in admin mode.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }
    fetch();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/suggestions/${id}`);
      setMessages((p) => p.filter((m) => m.id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Messages</h1>
            <p className="text-sm text-white/30 mt-0.5">
              {messages.length} anonymous suggestion{messages.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button
          onClick={fetch}
          disabled={loading}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin-slow" : ""} />
        </button>
      </div>

      {/* Admin badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-indigo-300 mb-8 border border-indigo-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        Admin view — all messages are anonymous
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" style={{ animationDelay: `${i*80}ms` }} />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="glass rounded-2xl p-8 text-center text-red-400 text-sm border border-red-500/20">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && messages.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center text-white/25 text-sm border border-dashed border-white/10">
          No suggestions yet. They'll appear here when students send one.
        </div>
      )}

      {/* Post-it grid */}
      {!loading && !error && messages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className="postit p-5 relative animate-float-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Delete */}
              <button
                onClick={() => handleDelete(msg.id)}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
              >
                <X size={12} />
              </button>

              {/* Message */}
              <p className="text-sm leading-relaxed font-medium pr-6 whitespace-pre-wrap break-words">
                {msg.message}
              </p>

              {/* Date */}
              <p className="text-xs mt-4 opacity-50 font-normal">{formatDate(msg.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

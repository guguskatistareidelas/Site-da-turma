// components/SuggestionFAB.jsx
// Floating action button that opens the suggestion modal.

import { useState, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import api from "../hooks/useApi";

export default function SuggestionFAB() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [flying, setFlying] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const paperRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await api.post("/suggestions", { message });
      // Trigger paper-fly animation
      setFlying(true);
      setTimeout(() => {
        setFlying(false);
        setSent(true);
        setMessage("");
        setTimeout(() => { setSent(false); setOpen(false); }, 1500);
      }, 900);
    } catch {
      // fail silently for demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB button */}
      <button className="fab" onClick={() => setOpen(true)} aria-label="Send suggestion">
        <MessageSquare size={22} />
      </button>

      {/* Modal */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="glass-strong w-full max-w-md p-8 animate-float-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">Send a Suggestion</h2>
                <p className="text-sm text-white/40 mt-1">Anonymous · read by the class leader</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            {sent ? (
              <div className="flex flex-col items-center py-8 gap-3 text-white/60">
                <span className="text-4xl">✅</span>
                <p className="text-sm font-medium text-white/70">Suggestion sent!</p>
              </div>
            ) : (
              <>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your suggestion, idea or feedback here…"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-indigo-500/60 transition-colors text-sm resize-none"
                />

                {/* Flying paper animation element */}
                <div
                  ref={paperRef}
                  className={`absolute top-1/2 left-1/2 pointer-events-none transition-all ${flying ? "animate-paper-fly" : "opacity-0"}`}
                >
                  <Send size={28} className="text-indigo-400" />
                </div>

                <button
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {loading ? "Sending…" : "Send"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

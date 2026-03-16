// components/Header.jsx
import { useState } from "react";
import { Lock, Unlock, BookOpen, X } from "lucide-react";
import { useAdmin } from "../contexts/AdminContext";

export default function Header() {
  const { isAdmin, login, logout, error, setError } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => { setShowModal(true); setError(null); };
  const closeModal = () => { setShowModal(false); setPassword(""); setError(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(password);
    setLoading(false);
    if (ok) closeModal();
  };

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 glass mx-4 mt-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-white leading-none">Digital Binder</h1>
            <p className="text-xs text-white/40 mt-0.5">Class study repository</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
              Admin mode
            </span>
          )}
          <button
            onClick={isAdmin ? logout : openModal}
            className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
            title={isAdmin ? "Exit admin mode" : "Admin login"}
          >
            {isAdmin
              ? <Unlock size={16} className="text-indigo-400" />
              : <Lock size={16} className="text-white/50" />
            }
          </button>
        </div>
      </header>

      {/* ── Login modal ──────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="glass-strong w-full max-w-sm p-8 animate-float-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">Admin Access</h2>
                <p className="text-sm text-white/40 mt-1">Enter the class leader password</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-indigo-500/60 transition-colors text-sm"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Checking…" : "Unlock"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

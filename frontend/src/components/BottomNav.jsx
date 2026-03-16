// components/BottomNav.jsx
// Mobile-friendly bottom navigation. Shows "Messages" tab only in admin mode.

import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquareDot } from "lucide-react";
import { useAdmin } from "../contexts/AdminContext";

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAdmin } = useAdmin();

  const links = [
    { to: "/", label: "Home", icon: <Home size={20} /> },
    ...(isAdmin ? [{ to: "/messages", label: "Messages", icon: <MessageSquareDot size={20} /> }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="max-w-sm mx-auto px-4 pb-4">
        <div className="glass-strong flex items-center justify-around px-4 py-3 rounded-2xl">
          {links.map((link) => {
            const active = pathname === link.to;
            return (
              <button
                key={link.to}
                onClick={() => navigate(link.to)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  active ? "text-indigo-400" : "text-white/30 hover:text-white/60"
                }`}
              >
                {link.icon}
                <span className="text-[10px] font-medium">{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

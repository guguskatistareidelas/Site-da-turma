// components/Lightbox.jsx
// Simple custom lightbox for full-size image preview.

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  if (index === null || index === undefined) return null;
  const src = images[index];

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onPrev();
      if (e.key === "ArrowRight" && index < images.length - 1) onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, images.length, onClose, onPrev, onNext]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="relative max-w-4xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 -translate-y-12 w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Prev */}
        {index > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-0 -translate-x-16 w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Image */}
        <img
          src={src}
          alt="Summary preview"
          className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl object-contain animate-float-in"
        />

        {/* Next */}
        {index < images.length - 1 && (
          <button
            onClick={onNext}
            className="absolute right-0 translate-x-16 w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Counter */}
        <span className="absolute bottom-0 translate-y-12 text-xs text-white/40">
          {index + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}

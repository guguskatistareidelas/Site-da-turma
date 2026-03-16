// components/UploadModal.jsx
// Drag-and-drop file upload modal used by admins.

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Link as LinkIcon } from "lucide-react";
import api from "../hooks/useApi";

const ACCEPT_BY_TYPE = {
  summary: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
  slide: {
    "application/pdf": [".pdf"],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  },
  exercise: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  },
};

export default function UploadModal({ subjectId, type, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const typeName = { summary: "Summary Image", slide: "Slide / Presentation", exercise: "Exercise File" }[type];

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT_BY_TYPE[type] || {},
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Please enter a title."); return; }
    if (!file && !externalUrl.trim()) { setError("Upload a file or paste a link."); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      if (file) formData.append("file", file);
      if (externalUrl) formData.append("url", externalUrl);

      const { data } = await api.post(`/subjects/${subjectId}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-strong w-full max-w-md p-8 animate-float-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">Upload {typeName}</h2>
            <p className="text-sm text-white/40 mt-1">Add content to this subject</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (e.g. Chapter 3 Summary)"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-indigo-500/60 transition-colors text-sm"
          />

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload size={24} className="mx-auto mb-2 text-white/30" />
            {file
              ? <p className="text-sm text-indigo-300 font-medium">{file.name}</p>
              : <p className="text-sm text-white/40">
                  {isDragActive ? "Drop it here…" : "Drag & drop or click to browse"}
                </p>
            }
          </div>

          {/* External link (for slides) */}
          {type === "slide" && (
            <div className="flex items-center gap-2">
              <LinkIcon size={16} className="text-white/30 shrink-0" />
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="Or paste a Google Slides link"
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-indigo-500/60 transition-colors text-sm"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

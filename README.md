# 📚 Digital Binder

> A modern, glassmorphism school content repository where students browse study materials by subject — and only the class leader (admin) can upload or delete content.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Subject dividers** | Mathematics · Portuguese · Geography · History (easily extensible) |
| **Three content types** | Summary images · Slides/PDFs · Exercise files |
| **Image lightbox** | Full-size preview with keyboard navigation |
| **Admin mode** | Password-protected; upload & delete controls appear only for admin |
| **Drag-and-drop upload** | Images, PDFs, DOCX, PowerPoint |
| **Suggestion box** | Anonymous FAB → modal → paper-fly animation |
| **Admin messages** | Post-it note board for admin to read & delete suggestions |
| **Responsive** | Works on desktop and mobile |
| **Glassmorphism UI** | Dark theme with per-subject colour accents |

---

## 🗂 Folder Structure

```
digital-binder/
├── backend/
│   ├── src/
│   │   └── server.js          # Express API
│   ├── .env.example
│   ├── package.json
│   └── Procfile               # For Railway / Render
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx         # Top bar + admin lock icon
    │   │   ├── BottomNav.jsx      # Mobile nav (+ Messages tab)
    │   │   ├── SuggestionFAB.jsx  # Floating action button
    │   │   ├── Lightbox.jsx       # Image lightbox modal
    │   │   └── UploadModal.jsx    # Drag-and-drop upload modal
    │   ├── contexts/
    │   │   └── AdminContext.jsx   # Auth state provider
    │   ├── hooks/
    │   │   └── useApi.js          # Pre-configured Axios instance
    │   ├── pages/
    │   │   ├── Home.jsx           # Subject grid landing page
    │   │   ├── SubjectPage.jsx    # Per-subject content page
    │   │   └── MessagesPage.jsx   # Admin suggestion board
    │   ├── subjects.js            # Subject colour/config data
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── package.json
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- A Firebase project with **Firestore** and **Storage** enabled
- Your Firebase **service account JSON** key

---

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → create a new project.
2. Enable **Firestore Database** (start in test mode for development).
3. Enable **Firebase Storage**.
4. Go to **Project Settings → Service Accounts** → click **Generate new private key** → save as `firebase-service-account.json`.

---

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env:
#   ADMIN_PASSWORD=your_password
#   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
#   FRONTEND_URL=http://localhost:5173

# Place firebase-service-account.json inside backend/src/

npm install
npm run dev    # Starts on http://localhost:4000
```

---

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL is handled by Vite proxy in dev — no changes needed

npm install
npm run dev    # Starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

**Admin login:** click the 🔒 lock icon in the top-right and enter your `ADMIN_PASSWORD`.

---

## ☁️ Deployment

### Backend → Railway (free tier)

1. Push the project to GitHub.
2. Create a new Railway project → **Deploy from GitHub repo** → select the `backend/` folder.
3. Add environment variables in Railway's dashboard (same as `.env`).
4. Upload `firebase-service-account.json` as a Railway environment variable (encode as base64) **or** use the [Railway Volumes](https://docs.railway.app) feature.
5. Copy the generated Railway URL (e.g. `https://digital-binder.railway.app`).

### Frontend → Vercel (free tier)

1. In `frontend/vercel.json`, replace `https://your-backend.railway.app` with your Railway URL.
2. Import the `frontend/` directory into a new Vercel project.
3. Set **Framework Preset** to **Vite**.
4. Deploy — Vercel handles routing via `vercel.json`.

---

## 🎨 Adding More Subjects

Open `frontend/src/subjects.js` and add a new entry:

```js
{
  id: "biology",          // used in URL and API calls
  name: "Biology",
  emoji: "🧬",
  gradient: "linear-gradient(135deg, #c7d2fe, #818cf8)",
  glow: "rgba(129,140,248,0.35)",
  accent: "#818cf8",
  tagClass: "subject-bio",
  description: "Cells, genetics and ecosystems.",
},
```

That's it — the subject card and full page appear automatically.

---

## 🔒 Security Notes

- The admin token is a simple base64 string. Fine for a class project; for production use **JWT** or **Firebase Auth**.
- Add Firestore security rules to block direct client writes (require the backend as middleman).
- Set `FRONTEND_URL` in `.env` to restrict CORS in production.

---

## 📄 License

MIT — use freely for educational purposes.

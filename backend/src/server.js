// ============================================================
// Digital Binder – Backend Server
// Stack: Node.js + Express + MongoDB + Cloudinary
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { MongoClient, ObjectId } = require("mongodb");
const cloudinary = require("cloudinary").v2;

// ── Cloudinary ────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── MongoDB ───────────────────────────────────────────────────
const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("digital-binder");
  console.log("✅ MongoDB conectado");
}).catch((err) => {
  console.error("❌ Erro ao conectar ao MongoDB:", err);
  process.exit(1);
});

// ── Express ───────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme123";

// ── Auth helpers ──────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Body: { password }
 * Retorna um token simples em base64 se a senha estiver correta.
 */
app.post("/api/auth/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${Date.now()}:${ADMIN_PASSWORD}`).toString("base64");
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: "Senha incorreta." });
});

/** Middleware – verifica o token de admin no cabeçalho Authorization. */
function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    const [, secret] = Buffer.from(token, "base64").toString().split(":");
    if (secret === ADMIN_PASSWORD) return next();
  } catch (_) {}
  res.status(403).json({ error: "Sem permissão." });
}

// ── Upload para Cloudinary ────────────────────────────────────

/** Envia o buffer do arquivo para o Cloudinary e retorna a URL pública. */
async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(file.buffer);
  });
}

// ─────────────────────────────────────────────────────────────
// ARQUIVOS  (resumos / slides / exercícios)
// ─────────────────────────────────────────────────────────────

/** GET /api/subjects/:subjectId/files?type=summary|slide|exercise */
app.get("/api/subjects/:subjectId/files", async (req, res) => {
  const { subjectId } = req.params;
  const { type } = req.query;
  const query = { subjectId, ...(type ? { type } : {}) };
  const files = await db.collection("files").find(query).sort({ createdAt: -1 }).toArray();
  res.json(files.map((f) => ({ ...f, id: f._id.toString() })));
});

/** POST /api/subjects/:subjectId/files – faz upload de um arquivo (somente admin) */
app.post(
  "/api/subjects/:subjectId/files",
  requireAdmin,
  upload.single("file"),
  async (req, res) => {
    const { subjectId } = req.params;
    const { title, type } = req.body; // type: summary | slide | exercise
    let url = req.body.url || null;   // para links externos (ex: Google Slides)

    if (req.file) {
      url = await uploadToCloudinary(req.file);
    }

    const doc = {
      subjectId,
      title,
      type,
      url,
      mimeType: req.file?.mimetype || "link",
      createdAt: new Date(),
    };

    const result = await db.collection("files").insertOne(doc);
    res.json({ id: result.insertedId.toString(), ...doc });
  }
);

/** DELETE /api/subjects/:subjectId/files/:fileId – apaga um arquivo (somente admin) */
app.delete("/api/subjects/:subjectId/files/:fileId", requireAdmin, async (req, res) => {
  await db.collection("files").deleteOne({ _id: new ObjectId(req.params.fileId) });
  res.json({ success: true });
});

// ─────────────────────────────────────────────────────────────
// SUGESTÕES
// ─────────────────────────────────────────────────────────────

/** POST /api/suggestions – envia uma sugestão anônima */
app.post("/api/suggestions", async (req, res) => {
  if (!req.body.message?.trim())
    return res.status(400).json({ error: "Mensagem obrigatória." });

  const result = await db.collection("suggestions").insertOne({
    message: req.body.message.trim(),
    createdAt: new Date(),
  });
  res.json({ id: result.insertedId.toString(), success: true });
});

/** GET /api/suggestions – lista todas as sugestões (somente admin) */
app.get("/api/suggestions", requireAdmin, async (_req, res) => {
  const msgs = await db.collection("suggestions").find().sort({ createdAt: -1 }).toArray();
  res.json(
    msgs.map((m) => ({
      ...m,
      id: m._id.toString(),
      createdAt: m.createdAt?.toISOString(),
    }))
  );
});

/** DELETE /api/suggestions/:id – apaga uma sugestão (somente admin) */
app.delete("/api/suggestions/:id", requireAdmin, async (req, res) => {
  await db.collection("suggestions").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ success: true });
});

// ─────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Digital Binder API rodando na porta ${PORT}`));

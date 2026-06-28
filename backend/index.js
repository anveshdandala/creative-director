import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const app = express();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.json({ message: "ai content director backend running!" });
});

app.post("/api/guide", requireAuth(), async (req, res) => {
  const { idea, contentType, platform } = req.body;
  if (!idea) {
    return res.status(400).json({ error: true, message: "idea is required" });
  }

  const aiRes = await fetch(`${AI_SERVICE_URL}/guide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, contentType, platform }),
  });

  const data = await aiRes.json();
  res.status(aiRes.status).json(data);
});

app.post("/api/validate", requireAuth(), async (req, res) => {
  const { draftDescription, imageBase64, mimeType } = req.body;
  if (!draftDescription && !imageBase64) {
    return res.status(400).json({ error: true, message: "draftDescription or imageBase64 is required" });
  }

  const aiRes = await fetch(`${AI_SERVICE_URL}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ draftDescription, imageBase64, mimeType }),
  });

  const data = await aiRes.json();
  res.status(aiRes.status).json(data);
});

// Legacy generate endpoint (unauthenticated, kept for compatibility)
app.post("/api/generate", requireAuth(), async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: true, message: "prompt is required" });
  }

  const aiRes = await fetch(`${AI_SERVICE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await aiRes.json();
  res.status(aiRes.status).json(data);
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});

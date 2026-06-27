import express from "express";
import cors from "cors";

const app = express();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "ai content director backend running!" });
});

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
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

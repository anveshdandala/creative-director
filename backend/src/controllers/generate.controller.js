import { prisma } from "../config/prisma.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * POST /api/guide
 * Requires a valid Clerk session (enforced by requireAuth middleware).
 * Forwards the request to the AI service and logs the generation to the DB.
 */
export async function generateGuide(req, res) {
  const { idea, contentType, platform } = req.body;
  if (!idea) {
    return res.status(400).json({ error: true, message: "idea is required" });
  }

  const userId = req.auth.userId;

  const aiRes = await fetch(`${AI_SERVICE_URL}/guide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, contentType, platform }),
  });

  const data = await aiRes.json();

  // Persist generation record so we can associate it with the Clerk user
  if (aiRes.ok) {
    await prisma.generation.create({
      data: {
        userId,
        type: "guide",
        input: JSON.stringify({ idea, contentType, platform }),
        output: JSON.stringify(data),
      },
    });
  }

  return res.status(aiRes.status).json(data);
}

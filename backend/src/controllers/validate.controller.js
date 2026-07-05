import { prisma } from "../config/prisma.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * POST /api/validate
 * Requires our own JWT (enforced by authenticate middleware).
 * Forwards the request to the AI service and logs the validation to the DB.
 */
export async function validateDraft(req, res) {
  const { draftDescription, imageBase64, mimeType } = req.body;
  if (!draftDescription && !imageBase64) {
    return res
      .status(400)
      .json({ error: true, message: "draftDescription or imageBase64 is required" });
  }

  const userId = req.user.id;

  const aiRes = await fetch(`${AI_SERVICE_URL}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ draftDescription, imageBase64, mimeType }),
  });

  const data = await aiRes.json();

  // Persist validation record
  if (aiRes.ok) {
    await prisma.generation.create({
      data: {
        userId,
        type: "validate",
        input: JSON.stringify({ draftDescription }),
        output: JSON.stringify(data),
      },
    });
  }

  return res.status(aiRes.status).json(data);
}

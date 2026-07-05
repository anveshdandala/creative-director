import { verifyToken, createClerkClient } from "@clerk/express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * POST /api/auth/sync
 *
 * Called once after the user signs in on the frontend.
 * Accepts the Clerk session token in the Authorization header,
 * verifies it, upserts the user in our own DB, and returns our
 * own signed JWT + the internal user record.
 *
 * After this call, the frontend stores our JWT and uses it for
 * every subsequent request — Clerk is never referenced again.
 */
export async function syncUser(req, res) {
  if (!JWT_SECRET) {
    return res
      .status(500)
      .json({ error: true, message: "JWT_SECRET not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: true, message: "Missing Clerk token" });
  }

  const clerkToken = authHeader.slice(7);

  // Verify the Clerk token and extract claims
  let payload;
  try {
    payload = await verifyToken(clerkToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  } catch {
    return res
      .status(401)
      .json({ error: true, message: "Invalid Clerk token" });
  }

  const clerkId = payload.sub;
  const email = payload.email ?? payload["email_address"] ?? "";
  const name =
    [payload.given_name, payload.family_name].filter(Boolean).join(" ") ||
    payload.username ||
    null;

  // Upsert: find by clerkId; if new, create the record
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: { email, name },
    create: { clerkId, email, name },
  });

  // Issue our own JWT — payload contains only our internal id
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
  });
}

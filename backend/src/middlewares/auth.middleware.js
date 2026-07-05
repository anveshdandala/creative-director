import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Express middleware that validates our own JWT (not Clerk).
 * On success it attaches req.user = { id, email, name } and calls next().
 * The Clerk clerkId field is never read or forwarded.
 */
export async function authenticate(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({ error: true, message: "JWT_SECRET not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: true, message: "Unauthorized" });
  }

  let payload;
  try {
    payload = jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch {
    return res.status(401).json({ error: true, message: "Invalid or expired token" });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    return res.status(401).json({ error: true, message: "User not found" });
  }

  req.user = user;
  next();
}

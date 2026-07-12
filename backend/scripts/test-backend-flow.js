import { prisma } from "../src/config/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const JWT_SECRET = process.env.JWT_SECRET;

async function main() {
  console.log("JWT_SECRET loaded:", JWT_SECRET ? "YES" : "NO");
  
  // Find first user
  let user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found, creating test user...");
    user = await prisma.user.create({
      data: {
        clerkId: "user_test_123",
        email: "test@example.com",
        name: "Test User"
      }
    });
  }
  
  console.log("Using user ID:", user.id);
  
  // Sign JWT
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "1h" });
  
  // Send POST /api/guide
  const payload = {
    idea: "fitness tips for software developers",
    contentType: "Video/Reel",
    platform: "Instagram Reels"
  };
  
  console.log("Sending request to backend http://localhost:5000/api/guide...");
  try {
    const res = await fetch("http://localhost:5000/api/guide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const body = await res.text();
    console.log("Body:");
    console.log(body);
  } catch (error) {
    console.error("Fetch failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

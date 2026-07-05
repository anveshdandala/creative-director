import { NextRequest, NextResponse } from "next/server";
import { getOwnToken } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  const token = await getOwnToken(req);
  if (!token) {
    return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const upstream = await fetch(`${BACKEND_URL}/api/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

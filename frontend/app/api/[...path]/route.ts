import { NextRequest, NextResponse } from "next/server";
import { getOwnToken } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

async function handleProxy(req: NextRequest, pathParams: string[]) {
  const path = pathParams.join("/");
  
  // Public paths bypass internal JWT authentication requirement
  const isPublic = path === "auth/sync";
  
  let token: string | null = null;
  if (!isPublic) {
    token = await getOwnToken(req);
    if (!token) {
      return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
    }
  }

  // Build headers to send upstream
  const headers: HeadersInit = {};
  
  const incomingAuth = req.headers.get("authorization");
  if (incomingAuth) {
    headers["Authorization"] = incomingAuth;
  } else if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  // Retrieve raw request body for writing methods
  let body: string | undefined = undefined;
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    try {
      body = await req.text();
    } catch {
      // No body or failed to read
    }
  }

  const upstreamUrl = `${BACKEND_URL}/api/${path}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers: headers,
      body: body,
    });

    const responseContentType = upstream.headers.get("content-type");
    if (responseContentType?.includes("application/json")) {
      const data = await upstream.json();
      return NextResponse.json(data, { status: upstream.status });
    } else {
      const text = await upstream.text();
      return new NextResponse(text, {
        status: upstream.status,
        headers: { "Content-Type": responseContentType || "text/plain" },
      });
    }
  } catch (error) {
    console.error(`[Proxy Error] Failed to proxy request to ${upstreamUrl}:`, error);
    return NextResponse.json(
      { error: true, message: "Backend service is currently unavailable" },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await context.params;
  return handleProxy(req, resolvedParams.path);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await context.params;
  return handleProxy(req, resolvedParams.path);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await context.params;
  return handleProxy(req, resolvedParams.path);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await context.params;
  return handleProxy(req, resolvedParams.path);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await context.params;
  return handleProxy(req, resolvedParams.path);
}

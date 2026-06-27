"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<"loading" | "connected" | "error">("loading");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(() => setBackendStatus("connected"))
      .catch(() => setBackendStatus("error"));
  }, []);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setResult("");
    setGenerateError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult(data.result);
    } catch (err: unknown) {
      setGenerateError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex flex-col gap-6 p-10 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 max-w-lg w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-black dark:text-white">AI Content Director</h1>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus === "loading"
                  ? "bg-yellow-400"
                  : backendStatus === "connected"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            {backendStatus === "loading" ? "connecting…" : backendStatus === "connected" ? "backend online" : "backend offline"}
          </span>
        </div>

        <textarea
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-black dark:text-white px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter a prompt…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium py-2 px-4 disabled:opacity-40 hover:opacity-80 transition-opacity"
        >
          {generating ? "Generating…" : "Generate"}
        </button>

        {result && (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
            {result}
          </div>
        )}

        {generateError && (
          <p className="text-sm text-red-500">{generateError}</p>
        )}
      </main>
    </div>
  );
}

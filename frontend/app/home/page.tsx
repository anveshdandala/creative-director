"use client";

import React, { useState, useRef } from "react";
import {
  Film,
  ArrowRight,
  Upload,
  Play,
  CheckCircle2,
  Sliders,
  Eye,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  Zap,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { PRESET_EXAMPLES, PresetExample } from "../data";
import { CreativePlan, DirectorReview } from "../types";

export default function Studio() {
  // Phase Tab state
  const [activeTab, setActiveTab] = useState<"guide" | "validate">("guide");

  // Custom input states for Phase 1 (Creative Guide)
  const [p1Idea, setP1Idea] = useState("");
  const [p1Type, setP1Type] = useState("Video/Reel");
  const [p1Platform, setP1Platform] = useState("Instagram");
  const [p1Loading, setP1Loading] = useState(false);
  const [p1Result, setP1Result] = useState<CreativePlan | null>(PRESET_EXAMPLES[0].plan);
  const [p1Error, setP1Error] = useState<string | null>(null);

  // Custom input states for Phase 2 (Validation Agent)
  const [p2Description, setP2Description] = useState("");
  const [p2Image, setP2Image] = useState<string | null>(null);
  const [p2ImageMime, setP2ImageMime] = useState<string | null>(null);
  const [p2Loading, setP2Loading] = useState(false);
  const [p2Result, setP2Result] = useState<DirectorReview | null>(PRESET_EXAMPLES[0].review);
  const [p2Error, setP2Error] = useState<string | null>(null);

  // Selected preset tracking
  const [selectedPresetId, setSelectedPresetId] = useState<string>("fitness-reel");

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const selectPreset = (preset: PresetExample) => {
    setSelectedPresetId(preset.id);
    if (activeTab === "guide") {
      setP1Idea(preset.idea);
      setP1Type(preset.contentType);
      setP1Platform(preset.platform);
      setP1Result(preset.plan);
      setP1Error(null);
    } else {
      setP2Description(preset.idea);
      setP2Result(preset.review);
      setP2Image(null);
      setP2Error(null);
    }
  };

  const handleGenerateGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1Idea.trim()) return;
    setP1Loading(true);
    setP1Error(null);
    setSelectedPresetId("");
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: p1Idea, contentType: p1Type, platform: p1Platform }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.message || "Failed to generate guide");
      setP1Result(data);
    } catch (err: unknown) {
      setP1Error(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setP1Loading(false);
    }
  };

  const handleValidateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!p2Description.trim() && !p2Image) {
      setP2Error("Please describe your draft or upload an image screenshot.");
      return;
    }
    setP2Loading(true);
    setP2Error(null);
    setSelectedPresetId("");
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftDescription: p2Description,
          imageBase64: p2Image || undefined,
          mimeType: p2ImageMime || undefined,
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.message || "Failed to validate draft");
      setP2Result(data);
    } catch (err: unknown) {
      setP2Error(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setP2Loading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setP2Error("Only image file formats (.png, .jpg, .jpeg, .webp) are supported.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setP2Image(event.target.result as string);
        setP2ImageMime(file.type);
        setP2Error(null);
      }
    };
    reader.onerror = () => setP2Error("Failed to read image file.");
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setP2Image(null);
    setP2ImageMime(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans flex flex-col selection:bg-[#FF4D00] selection:text-white">

      {/* Studio Header */}
      <nav className="flex flex-col sm:flex-row justify-between items-center px-6 md:px-12 py-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-[#FF4D00] rounded-full animate-pulse"></div>
          <div>
            <span className="text-sm font-black tracking-[0.2em] uppercase block">AI Creative Director</span>
            <span className="text-[9px] font-mono text-white/40 tracking-[0.1em] block">STUDIO</span>
          </div>
        </div>
        <div className="flex items-center gap-6 md:gap-10 text-[10px] uppercase tracking-[0.2em] font-medium text-white/70">
          <button
            onClick={() => setActiveTab("guide")}
            className={`hover:text-[#FF4D00] transition-colors ${activeTab === "guide" && "text-[#FF4D00]"}`}
          >
            Phase 01: Planning
          </button>
          <button
            onClick={() => setActiveTab("validate")}
            className={`hover:text-[#FF4D00] transition-colors ${activeTab === "validate" && "text-[#FF4D00]"}`}
          >
            Phase 02: Validation
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors font-mono">
            ← Back
          </Link>
          <UserButton />
        </div>
      </nav>

      {/* Preset Selector Bar */}
      <section className="bg-white/5 border-b border-white/10 py-6 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF4D00]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/60">Select Preset Inspiration:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_EXAMPLES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-wider transition-all duration-200 border ${
                  selectedPresetId === preset.id
                    ? "bg-[#FF4D00] border-[#FF4D00] text-white font-bold"
                    : "bg-black/40 border-white/10 text-white/70 hover:border-white/30"
                }`}
              >
                ⚡ {preset.name} ({preset.contentType})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Workspace Studio */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto w-full flex-1">

        {/* Workspace Title & Phase Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Interactive <span className="text-[#FF4D00]">Creative Studio</span>
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-xl">
              Toggle between Phase 1 and Phase 2. Use the presets above to instantly populate high-quality mock data, or connect your API key to test custom ideas with live Gemini AI logic!
            </p>
          </div>
          <div className="flex gap-px bg-white/10 p-1 border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("guide")}
              className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-all ${
                activeTab === "guide" ? "bg-[#FF4D00] text-white font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              01. Creative Guide
            </button>
            <button
              onClick={() => setActiveTab("validate")}
              className={`px-5 py-2.5 text-xs font-mono uppercase tracking-widest transition-all ${
                activeTab === "validate" ? "bg-[#FF4D00] text-white font-bold" : "text-white/60 hover:text-white"
              }`}
            >
              02. Validation Agent
            </button>
          </div>
        </div>

        {/* Phase 1 Workspace: Creative Guide */}
        {activeTab === "guide" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-black border border-white/10 p-6 md:p-8 space-y-6 relative">
                <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-[#FF4D00] text-black font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold">
                  Phase 01: Concept Strategy
                </div>
                <form onSubmit={handleGenerateGuide} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-white/40">Target Platform</label>
                    <select
                      value={p1Platform}
                      onChange={(e) => setP1Platform(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] text-sm px-4 py-3 rounded-none outline-none text-white font-mono"
                    >
                      <option value="Instagram Reels">Instagram Reels</option>
                      <option value="TikTok">TikTok</option>
                      <option value="YouTube Shorts">YouTube Shorts</option>
                      <option value="Pinterest Idea Pin">Pinterest Idea Pin</option>
                      <option value="LinkedIn Video">LinkedIn Video</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-white/40">Content Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Video/Reel", "Carousel", "Infographic", "Interactive Story"].map((fmt) => (
                        <button
                          type="button"
                          key={fmt}
                          onClick={() => setP1Type(fmt)}
                          className={`py-2 text-[10px] font-mono uppercase tracking-wider border transition-all ${
                            p1Type === fmt
                              ? "bg-white/10 border-[#FF4D00] text-white"
                              : "bg-black border-white/10 text-white/55 hover:border-white/20"
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-white/40">Describe Your Creative Idea</label>
                    <textarea
                      rows={5}
                      value={p1Idea}
                      onChange={(e) => setP1Idea(e.target.value)}
                      placeholder="e.g., A moody morning routine where I brew a fresh pour-over coffee, focusing on mechanical ASMR sounds and clean golden lighting."
                      className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] text-sm px-4 py-3 rounded-none outline-none text-white font-sans placeholder-white/30 resize-none leading-relaxed"
                    />
                    <div className="flex justify-between items-center text-[10px] text-white/40 font-mono">
                      <span>Be descriptive for better plans</span>
                      <span>{p1Idea.length} chars</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={p1Loading || !p1Idea.trim()}
                    className="w-full bg-white text-black hover:bg-[#FF4D00] hover:text-white disabled:bg-white/10 disabled:text-white/30 disabled:border-transparent py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {p1Loading ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Creative Brief...</>
                    ) : (
                      <><Play className="w-4 h-4 fill-current" /> Formulate Strategy Plan</>
                    )}
                  </button>
                </form>
                {p1Error && (
                  <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-none flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider">API Authentication Error</h5>
                      <p className="text-[11px] text-red-300/80 mt-1 leading-relaxed">{p1Error}</p>
                      <p className="text-[10px] text-white/40 mt-2 font-mono">Note: You can still click the presets at the top to experience the full planned output!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Strategy Output Brief Column */}
            <div className="lg:col-span-7">
              {p1Result ? (
                <div className="border border-white/10 bg-black p-6 md:p-8 space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                      <span className="text-[10px] font-mono text-[#FF4D00] uppercase tracking-widest font-bold block">[ GENERATED CREATIVE PLAN ]</span>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1">{p1Result.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-none font-mono text-[10px] uppercase text-white/70">
                      <Film className="w-3.5 h-3.5" /> {p1Type} / {p1Platform}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#FF4D00]" /> High-Level Concept Brief
                    </h4>
                    <p className="text-sm text-white/80 leading-relaxed font-sans bg-white/[0.02] p-4 border-l-2 border-[#FF4D00]">{p1Result.concept}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#FF4D00]" /> Target Audience Profile & Emotional Trigger
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed font-sans">{p1Result.targetAudience}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-white/10 py-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Color Palette</span>
                      <div className="flex gap-2 items-center flex-wrap">
                        {p1Result.aesthetic?.colorPalette?.map((color, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-white/5 px-2 py-1 border border-white/10">
                            <span className="w-3 h-3 block border border-white/20" style={{ backgroundColor: color }} />
                            <span className="text-[9px] font-mono text-white/60">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Visual Vibe</span>
                      <span className="text-xs text-white/80 font-medium block">{p1Result.aesthetic?.visualVibe}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Physical Lighting</span>
                      <span className="text-xs text-white/80 font-medium block">{p1Result.aesthetic?.lighting}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">Algorithmic Hooks (First 3 Seconds)</h4>
                    <div className="space-y-2.5">
                      {p1Result.hooks?.map((hook, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-3 flex gap-3 items-start">
                          <span className="text-[10px] font-mono text-white/30 bg-white/10 px-1.5 py-0.5 mt-0.5">Hook 0{i + 1}</span>
                          <p className="text-xs text-white/80 font-sans italic leading-relaxed">{hook}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">Director's Storyboard & Asset Sequence</h4>
                    <div className="space-y-3">
                      {p1Result.storyboard?.map((shot) => (
                        <div
                          key={shot.shot}
                          className="group border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] p-4 transition-all flex flex-col sm:flex-row gap-4 justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-black bg-[#FF4D00] px-1.5 py-0.5 font-bold">SHOT 0{shot.shot}</span>
                              <span className="text-[10px] font-mono text-white/40">Angle: <span className="text-white font-sans">{shot.angle}</span></span>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed pt-1">{shot.description}</p>
                          </div>
                          <div className="sm:text-right shrink-0">
                            <span className="text-[10px] font-mono text-white/30 block uppercase tracking-wider">Duration</span>
                            <span className="text-xs font-mono font-semibold text-[#FF4D00]">{shot.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#111] p-4 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Music Genre</span>
                      <span className="text-xs font-bold text-white block mt-1">{p1Result.music?.genre}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Rhythmic Tempo</span>
                      <span className="text-xs font-bold text-[#FF4D00] block mt-1">{p1Result.music?.tempo}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Audio Mood</span>
                      <span className="text-xs font-bold text-white block mt-1">{p1Result.music?.vibe}</span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">Platform Algorithmic Advice</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {p1Result.platformTips?.instagram && (
                        <div className="p-3.5 bg-black border border-white/10 text-xs space-y-1.5">
                          <span className="font-mono text-[9px] text-[#FF4D00] uppercase tracking-wider block font-bold">Instagram / TikTok Native</span>
                          <p className="text-white/70 leading-relaxed font-sans">{p1Result.platformTips.instagram}</p>
                        </div>
                      )}
                      {p1Result.platformTips?.tiktok && (
                        <div className="p-3.5 bg-black border border-white/10 text-xs space-y-1.5">
                          <span className="font-mono text-[9px] text-[#FF4D00] uppercase tracking-wider block font-bold">Pacing & Discovery Action</span>
                          <p className="text-white/70 leading-relaxed font-sans">{p1Result.platformTips.tiktok}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-white/10 h-full flex flex-col justify-center items-center p-12 text-center bg-black/20">
                  <Film className="w-10 h-10 text-white/20 mb-4 animate-pulse" />
                  <p className="text-sm text-white/60 font-mono uppercase tracking-wider">No concept brief loaded</p>
                  <p className="text-xs text-white/40 mt-1 max-w-xs">Input a draft description to formulate a plan or click an aesthetic preset.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phase 2 Workspace: Validation Agent */}
        {activeTab === "validate" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-black border border-white/10 p-6 md:p-8 space-y-6 relative">
                <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-[#FF4D00] text-black font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 font-bold">
                  Phase 02: Critique & Publishing
                </div>
                <form onSubmit={handleValidateDraft} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-white/40">
                      Upload Draft Frame / Screenshot (Optional)
                    </label>
                    {p2Image ? (
                      <div className="relative border border-white/20 bg-black/60 p-2 group">
                        <img src={p2Image} alt="Draft preview" className="w-full h-48 object-cover border border-white/10" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={clearUploadedImage}
                            className="px-3 py-1.5 bg-[#FF4D00] text-white text-xs font-mono uppercase tracking-wider hover:bg-red-600 transition-colors"
                          >
                            Remove Frame
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-none p-6 text-center cursor-pointer transition-all duration-200 ${
                          dragActive ? "border-[#FF4D00] bg-white/[0.02]" : "border-white/10 hover:border-white/20 bg-black"
                        }`}
                      >
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <Upload className="w-8 h-8 text-white/30 mx-auto mb-2.5" />
                        <span className="text-xs text-white/80 block font-mono uppercase tracking-wide">Drag & Drop or Click to Upload</span>
                        <span className="text-[10px] text-white/40 block mt-1">PNG, JPG, or WEBP. Max size 15MB.</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-mono uppercase tracking-widest text-white/40">
                      Describe your draft or current progress
                    </label>
                    <textarea
                      rows={4}
                      value={p2Description}
                      onChange={(e) => setP2Description(e.target.value)}
                      placeholder="Explain your video flow, the lighting you used, details on text hooks, or general structure of your asset."
                      className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] text-sm px-4 py-3 rounded-none outline-none text-white font-sans placeholder-white/30 resize-none leading-relaxed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={p2Loading || (!p2Description.trim() && !p2Image)}
                    className="w-full bg-white text-black hover:bg-[#FF4D00] hover:text-white disabled:bg-white/10 disabled:text-white/30 disabled:border-transparent py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {p2Loading ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Critiquing Asset Draft...</>
                    ) : (
                      <><Eye className="w-4 h-4" /> Submit for Director Review</>
                    )}
                  </button>
                </form>
                {p2Error && (
                  <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-none flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider">Validation Error</h5>
                      <p className="text-[11px] text-red-300/80 mt-1 leading-relaxed">{p2Error}</p>
                      <p className="text-[10px] text-white/40 mt-2 font-mono">Note: You can still click the presets at the top to experience pre-configured review evaluations!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Critique Output */}
            <div className="lg:col-span-7">
              {p2Result ? (
                <div className="border border-white/10 bg-black p-6 md:p-8 space-y-8">
                  <div className="flex justify-between items-center border-b border-white/10 pb-6">
                    <div>
                      <span className="text-[10px] font-mono text-[#FF4D00] uppercase tracking-widest font-bold block">[ CRITIQUE EVALUATION & DIAGNOSTICS ]</span>
                      <h3 className="text-2xl font-black uppercase tracking-tight mt-1">Director's Verdict</h3>
                    </div>
                    <span className="font-mono text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-3 py-1.5 uppercase font-medium">
                      Analysis Complete
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white/5 border border-white/10 p-4 text-center">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Composition</span>
                      <span className="text-3xl font-black text-[#FF4D00] block mt-1">{p2Result.scores?.composition || "B"}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 text-center">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Lighting & Tone</span>
                      <span className="text-3xl font-black text-white block mt-1">{p2Result.scores?.lighting || "B"}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 text-center">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Hook Score</span>
                      <span className="text-3xl font-black text-white block mt-1">{p2Result.scores?.hook || "A-"}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 text-center">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">Pacing/Rhythm</span>
                      <span className="text-3xl font-black text-white block mt-1">{p2Result.scores?.pacing || "B"}</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-[#FF4D00] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> What is Working Great
                      </h4>
                      <p className="text-xs text-white/80 leading-relaxed font-sans bg-emerald-950/20 p-3 border-l-2 border-emerald-500">
                        {p2Result.feedback?.whatIsWorking}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#FF4D00]" /> High-Priority Revisions Needed
                      </h4>
                      <p className="text-xs text-white/80 leading-relaxed font-sans bg-amber-950/20 p-3 border-l-2 border-amber-500">
                        {p2Result.feedback?.areasToImprove}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#FF4D00]" /> Director's Editorial Note
                      </h4>
                      <p className="text-xs text-white/70 italic leading-relaxed font-sans pl-4 border-l border-white/10">
                        "{p2Result.feedback?.directorNotes}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-white/10 h-full flex flex-col justify-center items-center p-12 text-center bg-black/20">
                  <Eye className="w-10 h-10 text-white/20 mb-4 animate-pulse" />
                  <p className="text-sm text-white/60 font-mono uppercase tracking-wider">No critique loaded</p>
                  <p className="text-xs text-white/40 mt-1 max-w-xs">Upload an image/screenshot or type a draft progress note on the left.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-end bg-black gap-6">
        <div className="max-w-md">
          <p className="text-xs font-black uppercase tracking-widest text-[#FF4D00] mb-2">AI Creative Director</p>
          <p className="text-[11px] leading-relaxed text-white/40 uppercase tracking-wider">
            AI should amplify human creativity, not replace it.
          </p>
        </div>
        <div className="flex gap-8 items-center shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="text-left md:text-right">
            <span className="block text-[9px] uppercase tracking-widest text-white/30">Current Status</span>
            <span className="text-[10px] uppercase font-bold text-green-500 tracking-wider flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Ready to Assist
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-white/20" />
        </div>
      </footer>
    </div>
  );
}

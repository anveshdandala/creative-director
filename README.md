# AI Creative Director — A Human-Centered Creative Assistant

> AI should amplify human creativity, not replace it.

Submission for the **July Challenge: Reimagine Creative Industries with AI**.

---

## 1. Problem Statement

Most AI creative tools generate finished content directly — images, captions, videos —
which saves time but takes creative ownership away from the creator. Creators don't
always want AI to make their content for them. Often what they actually need is:

1. Guidance on **what to create and how to structure it**, before they start.
2. Honest feedback on **whether the finished piece is ready to publish**, before they post it.

Existing tools solve neither of these well. They either generate content outright, or
say nothing at all until the user goes looking for tips elsewhere.

## 2. Solution Description

**AI Creative Director** is a two-phase creative assistant that sits *around* the
creative process instead of inside it.

- **Phase 1 — Creative Guide.** The user describes an idea (e.g. "I want to post a
  motivational fitness reel"). The AI returns a structured creative plan — visual style,
  shot list, hook ideas, story structure, music suggestions, platform-specific notes —
  but never generates the actual image, video, or caption. The user creates the content
  themselves, using the plan as a brief.
- **Phase 2 — Creative Validation & Publishing Assistant.** The user uploads their
  finished draft. The AI reviews it like an experienced creative director would —
  composition, lighting, hook effectiveness, pacing — and returns actionable feedback,
  caption options, hashtags, and posting-time suggestions, along with a brief explanation
  of *why* each suggestion is made.

At every step, the human makes the content and the final call. The AI's job is to make
that human better-informed, not to replace their decisions.

## 3. AI Approach

**Models & infrastructure:**

- **IBM Granite language models** — power the reasoning/writing agents (Planning,
  Storytelling, Publishing). 
- **IBM Granite Vision** — powers the Validation Agent's read of uploaded images
  (composition, lighting, focus, etc.).
- **IBM Granite Embedding** — powers retrieval for the Knowledge Layer (trend data,
  hashtag data, platform best practices) via RAG, so recommendations don't go stale.
- **watsonx** — hosts and serves the Granite models.
- **LangChain** — orchestrates the agents: routes requests, chains retrieval +
  generation steps, and assembles the final multi-part response.

**Stack:** React/Next.js frontend, Node.js/Express backend, PostgreSQL or MongoDB,
Clerk/JWT auth, deployed on IBM Cloud.

## 4. Selected Challenge Theme

Reimagine Creative Industries with AI — specifically the **personalized creative
assistant** / **AI creative partner** solution areas: using AI to help people create
faster and better while preserving their creative ownership, rather than generating
content on their behalf.

## 5. Links

- **Demo video (≤3 min, public):**
- **Project submission page:**
- **GitHub repo:** (this repo — must be public)

# 6. Exectution

To run ai services
- **.\venv\Scripts\Activate.ps1 **
- **uvicorn main:app --reload**

for both fe and be
- **npm run dev **

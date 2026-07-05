"""
agents/guiding_agent.py

GuidingAgent — high-level agent responsible for the POST /guide flow.

This is where the *task logic* lives (prompt construction, response parsing).
The *model* it uses (GraniteAgent) is injected, so you can swap it later
without touching this file.

To switch to a different model:
    agent = GuidingAgent(model=LlamaAgent())   # swap model here only
"""

import json
from agents.base import BaseAgent
from agents.granite import GraniteAgent


def _build_prompt(idea: str, content_type: str, platform: str) -> str:
    return f"""You are an expert content strategist and creative director.

A creator has the following idea:
"{idea}"

Content type: {content_type or "unspecified"}
Platform:     {platform or "unspecified"}

Generate a structured content guide in valid JSON with this exact shape:
{{
  "title": "<catchy title for the piece>",
  "hook": "<one-sentence opening hook>",
  "sections": [
    {{"heading": "<section heading>", "points": ["<bullet 1>", "<bullet 2>"]}}
  ],
  "cta": "<call to action>",
  "hashtags": ["<tag1>", "<tag2>"],
  "estimated_length": "<e.g. 800 words / 60 seconds>"
}}

Return ONLY the JSON object — no markdown fences, no explanation."""


class GuidingAgent:
    """
    Orchestrates the content-guide generation flow.

    Args:
        model: Any BaseAgent subclass. Defaults to GraniteAgent.
               Swap this to use a different LLM without changing anything else.
    """

    def __init__(self, model: BaseAgent | None = None):
        self._model = model or GraniteAgent()

    def run(self, idea: str, content_type: str = "", platform: str = "") -> dict:
        """
        Generate a structured content guide.

        Returns a parsed dict ready to be serialised as the API response.
        Raises ValueError if the model returns malformed JSON.
        """
        prompt = _build_prompt(idea, content_type, platform)
        result = self._model.run({"prompt": prompt})
        raw_text: str = result["text"].strip()

        # Strip accidental markdown fences if the model adds them
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
            raw_text = raw_text.strip()

        try:
            guide = json.loads(raw_text)
        except json.JSONDecodeError as exc:
            raise ValueError(
                f"Model returned non-JSON output: {raw_text[:200]}"
            ) from exc

        return {
            "guide": guide,
            "model": result.get("model"),
        }

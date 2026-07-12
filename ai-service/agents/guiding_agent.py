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
from agents.base import parse_json_response
from agents.llm_client import get_llm_agent


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
        model: Any BaseAgent subclass. Defaults to configured LLM client.
               Swap this to use a different LLM without changing anything else.
    """

    def __init__(self, model=None):
        self._model = model or get_llm_agent()

    def run(self, idea: str, content_type: str = "", platform: str = "") -> dict:
        """
        Generate a structured content guide.

        Returns a parsed dict ready to be serialised as the API response.
        Raises ValueError if the model returns malformed JSON.
        """
        prompt = _build_prompt(idea, content_type, platform)
        raw_text = self._model.generate(prompt)

        try:
            guide = parse_json_response(raw_text)
        except json.JSONDecodeError as exc:
            raise ValueError(
                f"Model returned non-JSON output: {raw_text[:200]}"
            ) from exc

        return {
            "guide": guide,
            "model": self._model.model_name,
            "source": self._model.model_source
        }


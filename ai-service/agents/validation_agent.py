"""
agents/validation_agent.py

ValidationAgent — high-level agent responsible for the POST /validate flow.
Generates critique, scores, captions, and strategy feedback for content drafts.
"""

import json
from agents.base import parse_json_response
from agents.llm_client import get_llm_agent


def _build_prompt(draft_description: str, has_image: bool) -> str:
    image_clause = "The user has uploaded a screenshot/frame of their draft." if has_image else "No image was uploaded."
    return f"""You are an expert film director and creative editor reviewing a draft for a social media post (Reel/TikTok/Short).

Draft Description:
"{draft_description}"

{image_clause}

Critique the draft and generate an evaluation report in valid JSON with this exact shape:
{{
  "scores": {{
    "composition": "<Grade e.g. A, B+, C>",
    "lighting": "<Grade e.g. A, B+, C>",
    "hook": "<Grade e.g. A, B+, C>",
    "pacing": "<Grade e.g. A, B+, C>"
  }},
  "feedback": {{
    "whatIsWorking": "<detailed critique of what is working well in the draft>",
    "areasToImprove": "<detailed high-priority revisions needed>",
    "directorNotes": "<an editorial note / tip from the director's perspective>"
  }},
  "captions": [
    {{"text": "<option 1 caption>", "vibe": "<vibe e.g. Bold, Story-driven>"}},
    {{"text": "<option 2 caption>", "vibe": "<vibe e.g. Humorous, Analytical>"}}
  ],
  "hashtags": ["<tag1>", "<tag2>", "<tag3>"],
  "postingStrategy": {{
    "bestTime": "<best day and time to post, e.g. Sundays at 8:00 PM>",
    "rationale": "<brief explanation why this time is optimal for this content type>"
  }}
}}

Return ONLY the JSON object — no markdown fences, no explanation."""


class ValidationAgent:
    """
    Orchestrates the draft validation flow.
    """

    def __init__(self, model=None):
        self._model = model or get_llm_agent()

    def run(self, draft_description: str, has_image: bool = False) -> dict:
        """
        Generate a structured review evaluation.
        """
        prompt = _build_prompt(draft_description, has_image)
        raw_text = self._model.generate(prompt)

        try:
            review = parse_json_response(raw_text)
        except json.JSONDecodeError as exc:
            raise ValueError(
                f"Model returned non-JSON output: {raw_text[:200]}"
            ) from exc

        return review

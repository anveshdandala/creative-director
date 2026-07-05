"""
agents/granite.py

GraniteAgent — wraps IBM Granite 3.3 (8B Instruct) via ibm-watsonx-ai.

This is the ONLY file that knows about the Granite model or watsonx SDK.
All other code imports GraniteAgent and calls .run() — nothing else.

When you add a second model (e.g. Llama, Mixtral):
  - Create agents/llama.py  (copy this file as a template)
  - Subclass BaseAgent the same way
  - Import it wherever you need it; GuidingAgent stays untouched
"""

from ibm_watsonx_ai import APIClient, Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

import config
from agents.base import BaseAgent


# ---------------------------------------------------------------------------
# Default generation parameters — override per-call via run(params=...)
# ---------------------------------------------------------------------------
DEFAULT_PARAMS = {
    GenParams.DECODING_METHOD: "greedy",
    GenParams.MAX_NEW_TOKENS: 1024,
    GenParams.MIN_NEW_TOKENS: 1,
    GenParams.TEMPERATURE: 0.7,
    GenParams.REPETITION_PENALTY: 1.1,
}

# Granite 3.3 8B Instruct model ID on watsonx
GRANITE_MODEL_ID = "ibm/granite-3-3-8b-instruct"


class GraniteAgent(BaseAgent):
    """
    Thin wrapper around Granite 3.3 (8B Instruct).

    Usage:
        agent = GraniteAgent()
        result = agent.run({"prompt": "Write a content plan for..."})
        print(result["text"])
    """

    def __init__(self, params: dict | None = None):
        """
        Args:
            params: Optional generation parameter overrides.
                    Keys are ibm_watsonx_ai.metanames.GenTextParamsMetaNames values.
        """
        self._params = {**DEFAULT_PARAMS, **(params or {})}
        self._client = self._build_client()
        self._model = ModelInference(
            model_id=GRANITE_MODEL_ID,
            api_client=self._client,
            project_id=config.WATSONX_PROJECT_ID,
            params=self._params,
        )

    # ------------------------------------------------------------------
    # BaseAgent interface
    # ------------------------------------------------------------------

    def _build_client(self) -> APIClient:
        """Create and return an authenticated watsonx APIClient."""
        credentials = Credentials(
            url=config.WATSONX_URL,
            api_key=config.WATSONX_API_KEY,
        )
        return APIClient(credentials)

    def run(self, inputs: dict) -> dict:
        """
        Send a prompt to Granite and return the generated text.

        Expected keys in `inputs`:
            prompt (str): The full prompt string to send to the model.

        Returns:
            {
                "text": <generated string>,
                "model": <model id>,
                "stop_reason": <stop reason from the API>,
            }
        """
        prompt: str = inputs["prompt"]
        response = self._model.generate_text(prompt=prompt, guardrails=False)

        # generate_text returns the text string directly
        return {
            "text": response,
            "model": GRANITE_MODEL_ID,
        }

import json
import urllib.request
import urllib.error
from typing import Any

import config
from agents.base import BaseAgent


class OllamaAgent(BaseAgent):
    """
    Agent that interacts with a local Ollama instance running the Granite model.
    """

    def __init__(self, model_name: str | None = None, host: str | None = None):
        self._model_name = model_name or config.OLLAMA_MODEL
        self.host = host or config.OLLAMA_HOST
        self.provider = config.LLM_PROVIDER

    @property
    def model_name(self) -> str:
        return self._model_name
    
    @property
    def model_source(self) -> str:
        return self.provider

    def generate(self, prompt: str) -> str:
        """
        Send a prompt to local Ollama and return the generated text.
        """
        url = f"{self.host}/api/generate"
        
        payload = {
            "model": self._model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7
            }
        }
        
        headers = {"Content-Type": "application/json"}
        req = urllib.request.Request(
            url, 
            data=json.dumps(payload).encode("utf-8"), 
            headers=headers, 
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                return res_data.get("response", "").strip()
        except urllib.error.URLError as e:
            raise RuntimeError(
                f"Failed to connect to local Ollama server at {self.host}. "
                "Please verify that the Ollama service is running (`ollama serve`) "
                f"and that the model `{self._model_name}` has been pulled."
            ) from e


class GraniteAgent(BaseAgent):
    """
    Thin wrapper around IBM Granite 3.3 (8B Instruct) via ibm-watsonx-ai.
    Uses dynamic imports to prevent installation dependencies when running Ollama.
    """

    def __init__(self, params: dict | None = None):
        # Default generation parameters mapped to literal string keys 
        # (avoiding module-level GenParams dependencies)
        default_params = {
            "decoding_method": "greedy",
            "max_new_tokens": 1024,
            "min_new_tokens": 1,
            "temperature": 0.7,
            "repetition_penalty": 1.1,
        }
        self._params = {**default_params, **(params or {})}
        self._client = self._build_client()
        
        # Dynamic import of watsonx foundation models
        from ibm_watsonx_ai.foundation_models import ModelInference
        
        self._model = ModelInference(
            model_id="ibm/granite-3-3-8b-instruct",
            api_client=self._client,
            project_id=config.WATSONX_PROJECT_ID,
            params=self._params,
        )

    @property
    def model_name(self) -> str:
        return "ibm/granite-3-3-8b-instruct"

    @property
    def model_source(self) -> str:
        return "watsonx"

    def _build_client(self) -> Any:
        """Create and return an authenticated watsonx APIClient."""
        from ibm_watsonx_ai import APIClient, Credentials
        
        credentials = Credentials(
            url=config.WATSONX_URL,
            api_key=config.WATSONX_API_KEY,
        )
        return APIClient(credentials)

    def generate(self, prompt: str) -> str:
        """Send prompt to watsonx and return the generated text string."""
        return self._model.generate_text(prompt=prompt, guardrails=False)


def get_llm_agent() -> BaseAgent:
    """
    Factory function to retrieve the configured LLM agent.
    """
    if config.LLM_PROVIDER == "watsonx":
        return GraniteAgent()
    else:
        return OllamaAgent()

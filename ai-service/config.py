"""
config.py — central place for all environment variables.

Add a .env file in ai-service/ (see .env.example).
Never import this in client-side code; server-side only.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# IBM watsonx.ai credentials
# ---------------------------------------------------------------------------

WATSONX_API_KEY: str = os.getenv("WATSONX_API_KEY", "")
WATSONX_PROJECT_ID: str = os.getenv("WATSONX_PROJECT_ID", "")
WATSONX_URL: str = os.getenv(
    "WATSONX_URL", "https://us-south.ml.cloud.ibm.com"
)

# LLM provider configuration
LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "ollama")
OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "granite4.1:3b")


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

WATSONX_API_KEY: str = os.environ["WATSONX_API_KEY"]
WATSONX_PROJECT_ID: str = os.environ["WATSONX_PROJECT_ID"]
WATSONX_URL: str = os.getenv(
    "WATSONX_URL", "https://us-south.ml.cloud.ibm.com"
)

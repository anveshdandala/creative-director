import json
from abc import ABC, abstractmethod


class BaseAgent(ABC):
    """
    Every LLM provider integration must implement this interface.
    """

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return the name/identifier of the model."""
        pass
    
    @abstractmethod
    def model_source(self) -> str:
        """ returns where the llm is hosted"""

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """
        Execute generation for a given prompt and return the raw generated text.

        Args:
            prompt: The full prompt string.

        Returns:
            The raw response text.
        """
        pass


def parse_json_response(raw_text: str) -> dict:
    """
    Clean up markdown code fences (e.g. ```json ... ```)
    and parse the raw text response as a dictionary.
    """
    clean_text = raw_text.strip()
    
    # Check if there is a markdown code block anywhere in the text
    if "```" in clean_text:
        # Extract the content inside the first ``` block
        parts = clean_text.split("```")
        for part in parts[1::2]:  # Odd indices contain the content between fences
            part_clean = part.strip()
            if part_clean.startswith("json"):
                part_clean = part_clean[4:]
            elif part_clean.startswith("JSON"):
                part_clean = part_clean[4:]
            part_clean = part_clean.strip()
            
            try:
                return json.loads(part_clean)
            except json.JSONDecodeError:
                continue
    
    # If no code block worked, or there were no code blocks, try parsing the whole text
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError as e:
        # Fallback: find first '{' and last '}' and try parsing that substring
        start_idx = clean_text.find("{")
        end_idx = clean_text.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            try:
                return json.loads(clean_text[start_idx:end_idx + 1])
            except json.JSONDecodeError:
                pass
        raise e


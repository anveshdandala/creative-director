"""
agents/base.py

Abstract base class for all AI agents in this service.

To add a new model (e.g. Llama, Mixtral):
  1. Create agents/<your_model>.py
  2. Subclass BaseAgent
  3. Implement `_build_client()` and `run()`
  4. Import and use it in whichever agent needs it
"""

from abc import ABC, abstractmethod
from typing import Any


class BaseAgent(ABC):
    """
    Every model integration must implement this interface.

    `run()` accepts a plain dict of inputs and returns a plain dict.
    Callers (route handlers, other agents) never touch the model client directly.
    """

    @abstractmethod
    def _build_client(self) -> Any:
        """Instantiate and return the underlying model client."""
        ...

    @abstractmethod
    def run(self, inputs: dict) -> dict:
        """
        Execute the agent logic.

        Args:
            inputs: Validated request data forwarded from the route handler.

        Returns:
            A plain dict that will be serialised to JSON and returned to the caller.
        """
        ...

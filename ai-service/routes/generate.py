from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    result: str

@router.post("/generate", response_model=GenerateResponse)
def generate(body: GenerateRequest):
    # Stub — replace with real LangChain agent later
    return GenerateResponse(result=f"[stub] You asked: {body.prompt}")

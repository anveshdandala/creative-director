from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    result: {
        brief: str,
        target_audience:[str],
        colors:[str],
        hooks:[str],
        storyboard:[str],
        music:[str],
        advice:str
    }

@router.post("/guide", response_model=GenerateResponse)
def generate(body: GenerateRequest):
    # Stub — replace with real LangChain agent later
    return GenerateResponse(result=f"[stub] You asked: {body.prompt}")

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from agents.guiding_agent import GuidingAgent
from agents.validation_agent import ValidationAgent

router = APIRouter()

class GenerateRequest(BaseModel):
    idea: str
    content_type: str | None = Field(default="", alias="contentType")
    platform: str | None = Field(default="")

    model_config = {
        "populate_by_name": True
    }

class GenerateResponse(BaseModel):
    guide: dict
    model: str
    source: str

class ValidateRequest(BaseModel):
    draft_description: str | None = Field(default="", alias="draftDescription")
    image_base64: str | None = Field(default=None, alias="imageBase64")
    mime_type: str | None = Field(default=None, alias="mimeType")

    model_config = {
        "populate_by_name": True
    }

class ValidateResponse(BaseModel):
    scores: dict
    feedback: dict
    captions: list
    hashtags: list
    postingStrategy: dict

@router.post("/guide", response_model=GenerateResponse)
def generate(body: GenerateRequest):
    agent = GuidingAgent()
    try:
        result = agent.run(
            idea=body.idea,
            content_type=body.content_type,
            platform=body.platform
        )
        return GenerateResponse(
            guide=result["guide"],
            model=result["model"],
            source=result["source"]
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate", response_model=ValidateResponse)
def validate(body: ValidateRequest):
    agent = ValidationAgent()
    try:
        result = agent.run(
            draft_description=body.draft_description or "",
            has_image=bool(body.image_base64)
        )
        return ValidateResponse(
            scores=result["scores"],
            feedback=result["feedback"],
            captions=result["captions"],
            hashtags=result["hashtags"],
            postingStrategy=result["postingStrategy"]
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


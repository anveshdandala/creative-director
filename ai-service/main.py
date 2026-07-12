from fastapi import FastAPI
from routes.guide import router as generate_router

app = FastAPI(title="AI Content Director — AI Service")

app.include_router(generate_router)

@app.get("/")
def root():
    return {"message": "AI service is running"}

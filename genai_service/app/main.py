from fastapi import FastAPI

from app.api.routes import router as recommendation_router


app = FastAPI(
    title="College Bus GenAI Service",
    description=(
        "GenAI service for bus recommendations, "
        "crowd explanations, and student travel assistance."
    ),
    version="1.0.0",
)


app.include_router(recommendation_router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {
        "message": "College Bus GenAI Service is running"
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "college-bus-genai",
    }
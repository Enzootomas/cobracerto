from fastapi import FastAPI

app = FastAPI(
    title="CobraCerto API",
    description="API backend da plataforma CobraCerto",
    version="0.1.0"
)


@app.get("/")
def home():
    return {
        "project": "CobraCerto",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
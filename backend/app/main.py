from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import Base, engine

from app.models.client import Client
from app.models.receivable import Receivable
from app.models.collection_message import CollectionMessage
from app.routes.dashboard import router as dashboard_router

from app.routes.clients import router as clients_router
from app.routes.receivables import router as receivables_router
from app.routes.collections import router as collections_router
from app.routes.reconciliation import router as reconciliation_router



Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CobraCerto API",
    description="API backend da plataforma CobraCerto",
    version="0.5.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(clients_router)
app.include_router(receivables_router)
app.include_router(collections_router)
app.include_router(dashboard_router)
app.include_router(reconciliation_router)


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
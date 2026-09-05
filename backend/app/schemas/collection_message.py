from datetime import datetime
from typing import Literal

from pydantic import BaseModel


CollectionTone = Literal[
    "friendly",
    "professional",
    "formal",
    "direct"
]


class CollectionGenerateRequest(BaseModel):
    receivable_id: int
    tone: CollectionTone


class CollectionMessageResponse(BaseModel):
    id: int
    receivable_id: int
    client_name: str
    tone: str
    message: str
    created_at: datetime
    
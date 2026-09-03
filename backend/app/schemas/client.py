from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ClientCreate(BaseModel):
    name: str
    email: str
    phone: str
    document: str


class ClientResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    document: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )
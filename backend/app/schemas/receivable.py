from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class ReceivableCreate(BaseModel):
    client_id: int

    description: str = Field(
        min_length=1,
        max_length=255
    )

    amount: Decimal = Field(
        gt=0
    )

    due_date: date


class ReceivableResponse(BaseModel):
    id: int
    client_id: int
    client_name: str
    description: str
    amount: Decimal
    due_date: date
    status: str
    days_overdue: int
    created_at: datetime
    paid_at: datetime | None
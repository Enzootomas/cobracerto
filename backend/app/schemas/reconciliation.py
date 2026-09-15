from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class ReconciliationMatch(BaseModel):
    transaction_date: date
    transaction_description: str
    transaction_amount: Decimal

    receivable_id: int
    client_name: str
    receivable_description: str
    due_date: date


class ReconciliationUnmatched(BaseModel):
    transaction_date: date
    transaction_description: str
    transaction_amount: Decimal


class ReconciliationPreviewResponse(BaseModel):
    total_transactions: int
    matched_count: int
    unmatched_count: int

    matched: list[ReconciliationMatch]
    unmatched: list[ReconciliationUnmatched]


class ReconciliationConfirmRequest(BaseModel):
    receivable_ids: list[int]


class ReconciliationConfirmResponse(BaseModel):
    confirmed_count: int
    receivable_ids: list[int]
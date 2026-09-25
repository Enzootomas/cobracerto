from decimal import Decimal

from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_receivable: Decimal
    total_paid: Decimal
    total_overdue: Decimal
    overdue_count: int


class DashboardAnalyticsResponse(BaseModel):
    total_count: int

    paid_count: int
    pending_count: int
    overdue_count: int

    paid_amount: Decimal
    pending_amount: Decimal
    overdue_amount: Decimal

    delinquency_rate: float
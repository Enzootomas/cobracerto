from decimal import Decimal

from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_receivable: Decimal
    total_paid: Decimal
    total_overdue: Decimal
    overdue_count: int
from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.receivable import Receivable
from app.schemas.dashboard import DashboardSummaryResponse


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse
)
def get_dashboard_summary(
    db: Session = Depends(get_db)
):
    receivables = db.query(Receivable).all()

    total_receivable = Decimal("0.00")
    total_paid = Decimal("0.00")
    total_overdue = Decimal("0.00")
    overdue_count = 0

    today = date.today()

    for receivable in receivables:

        if receivable.status == "paid":
            total_paid += receivable.amount
            continue

        total_receivable += receivable.amount

        if receivable.due_date < today:
            total_overdue += receivable.amount
            overdue_count += 1

    return DashboardSummaryResponse(
        total_receivable=total_receivable,
        total_paid=total_paid,
        total_overdue=total_overdue,
        overdue_count=overdue_count
    )
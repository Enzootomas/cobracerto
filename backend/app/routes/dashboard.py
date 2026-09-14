from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.receivable import Receivable
from app.schemas.dashboard import (
    DashboardAnalyticsResponse,
    DashboardSummaryResponse,
)


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


@router.get(
    "/analytics",
    response_model=DashboardAnalyticsResponse
)
def get_dashboard_analytics(
    db: Session = Depends(get_db)
):
    receivables = db.query(Receivable).all()

    today = date.today()

    total_count = len(receivables)

    paid_count = 0
    pending_count = 0
    overdue_count = 0

    paid_amount = Decimal("0.00")
    pending_amount = Decimal("0.00")
    overdue_amount = Decimal("0.00")

    for receivable in receivables:

        if receivable.status == "paid":
            paid_count += 1
            paid_amount += receivable.amount

        elif receivable.due_date < today:
            overdue_count += 1
            overdue_amount += receivable.amount

        else:
            pending_count += 1
            pending_amount += receivable.amount

    if total_count > 0:
        delinquency_rate = round(
            (overdue_count / total_count) * 100,
            2
        )
    else:
        delinquency_rate = 0.0

    return DashboardAnalyticsResponse(
        total_count=total_count,
        paid_count=paid_count,
        pending_count=pending_count,
        overdue_count=overdue_count,
        paid_amount=paid_amount,
        pending_amount=pending_amount,
        overdue_amount=overdue_amount,
        delinquency_rate=delinquency_rate
    )
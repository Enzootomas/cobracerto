from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.client import Client
from app.models.receivable import Receivable
from app.schemas.receivable import (
    ReceivableCreate,
    ReceivableResponse,
)


router = APIRouter(
    prefix="/receivables",
    tags=["Receivables"]
)


def get_effective_status(
    receivable: Receivable
) -> str:
    if receivable.status == "paid":
        return "paid"

    if receivable.due_date < date.today():
        return "overdue"

    return "pending"


def get_days_overdue(
    receivable: Receivable
) -> int:
    if get_effective_status(receivable) != "overdue":
        return 0

    return (
        date.today() - receivable.due_date
    ).days


def build_response(
    receivable: Receivable,
    client_name: str,
    client_phone: str
) -> ReceivableResponse:
    return ReceivableResponse(
        id=receivable.id,
        client_id=receivable.client_id,
        client_name=client_name,
        client_phone=client_phone,
        description=receivable.description,
        amount=receivable.amount,
        due_date=receivable.due_date,
        status=get_effective_status(receivable),
        days_overdue=get_days_overdue(receivable),
        created_at=receivable.created_at,
        paid_at=receivable.paid_at
    )


@router.post(
    "",
    response_model=ReceivableResponse,
    status_code=status.HTTP_201_CREATED
)
def create_receivable(
    data: ReceivableCreate,
    db: Session = Depends(get_db)
):
    client = (
        db.query(Client)
        .filter(
            Client.id == data.client_id
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Cliente não encontrado."
        )

    receivable = Receivable(
        client_id=data.client_id,
        description=data.description,
        amount=data.amount,
        due_date=data.due_date,
        status="pending"
    )

    db.add(receivable)
    db.commit()
    db.refresh(receivable)

    return build_response(
        receivable,
        client.name,
        client.phone
    )


@router.get(
    "",
    response_model=list[ReceivableResponse]
)
def list_receivables(
    db: Session = Depends(get_db)
):
    results = (
        db.query(
            Receivable,
            Client.name,
            Client.phone
        )
        .join(
            Client,
            Client.id == Receivable.client_id
        )
        .order_by(
            Receivable.due_date
        )
        .all()
    )

    return [
        build_response(
            receivable,
            client_name,
            client_phone
        )
        for (
            receivable,
            client_name,
            client_phone
        ) in results
    ]


@router.get(
    "/overdue",
    response_model=list[ReceivableResponse]
)
def list_overdue_receivables(
    db: Session = Depends(get_db)
):
    results = (
        db.query(
            Receivable,
            Client.name,
            Client.phone
        )
        .join(
            Client,
            Client.id == Receivable.client_id
        )
        .filter(
            Receivable.status != "paid",
            Receivable.due_date < date.today()
        )
        .order_by(
            Receivable.due_date
        )
        .all()
    )

    return [
        build_response(
            receivable,
            client_name,
            client_phone
        )
        for (
            receivable,
            client_name,
            client_phone
        ) in results
    ]


@router.patch(
    "/{receivable_id}/paid",
    response_model=ReceivableResponse
)
def mark_receivable_as_paid(
    receivable_id: int,
    db: Session = Depends(get_db)
):
    receivable = (
        db.query(Receivable)
        .filter(
            Receivable.id == receivable_id
        )
        .first()
    )

    if not receivable:
        raise HTTPException(
            status_code=404,
            detail="Cobrança não encontrada."
        )

    if receivable.status == "paid":
        raise HTTPException(
            status_code=409,
            detail="Esta cobrança já está paga."
        )

    client = (
        db.query(Client)
        .filter(
            Client.id == receivable.client_id
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Cliente da cobrança não encontrado."
        )

    receivable.status = "paid"
    receivable.paid_at = datetime.now(
        timezone.utc
    )

    db.commit()
    db.refresh(receivable)

    return build_response(
        receivable,
        client.name,
        client.phone
    )
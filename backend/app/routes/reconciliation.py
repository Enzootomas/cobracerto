import csv
import io

from decimal import Decimal, InvalidOperation
from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.client import Client
from app.models.receivable import Receivable
from app.schemas.reconciliation import (
    ReconciliationConfirmRequest,
    ReconciliationConfirmResponse,
    ReconciliationMatch,
    ReconciliationPreviewResponse,
    ReconciliationUnmatched,
)


router = APIRouter(
    prefix="/reconciliation",
    tags=["Reconciliation"]
)


@router.post(
    "/csv/preview",
    response_model=ReconciliationPreviewResponse
)
async def preview_csv_reconciliation(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Arquivo não informado."
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Envie um arquivo CSV."
        )

    content = await file.read()

    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="O arquivo deve estar em UTF-8."
        )

    reader = csv.DictReader(
        io.StringIO(text)
    )

    required_columns = {
        "date",
        "description",
        "amount",
    }

    if not reader.fieldnames:
        raise HTTPException(
            status_code=400,
            detail="CSV sem cabeçalho."
        )

    received_columns = {
        column.strip()
        for column in reader.fieldnames
    }

    if not required_columns.issubset(
        received_columns
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "O CSV precisa possuir as colunas: "
                "date, description e amount."
            )
        )

    available_receivables = (
        db.query(
            Receivable,
            Client.name,
        )
        .join(
            Client,
            Client.id == Receivable.client_id
        )
        .filter(
            Receivable.status != "paid"
        )
        .order_by(
            Receivable.due_date
        )
        .all()
    )

    matched = []
    unmatched = []

    used_receivable_ids = set()

    total_transactions = 0

    for row in reader:
        total_transactions += 1

        try:
            transaction_date = datetime.strptime(
                row["date"].strip(),
                "%Y-%m-%d"
            ).date()

            amount_text = (
                row["amount"]
                .strip()
                .replace("R$", "")
                .replace(" ", "")
            )

            if "," in amount_text:
                amount_text = (
                    amount_text
                    .replace(".", "")
                    .replace(",", ".")
                )

            transaction_amount = Decimal(
                amount_text
            )

        except (
            ValueError,
            InvalidOperation,
            AttributeError,
        ):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Dados inválidos na linha "
                    f"{total_transactions + 1}."
                )
            )

        transaction_description = (
            row["description"].strip()
        )

        found_match = None

        for (
            receivable,
            client_name,
        ) in available_receivables:

            if (
                receivable.id
                in used_receivable_ids
            ):
                continue

            if (
                receivable.amount
                == transaction_amount
            ):
                found_match = (
                    receivable,
                    client_name,
                )

                break

        if found_match:
            (
                receivable,
                client_name,
            ) = found_match

            used_receivable_ids.add(
                receivable.id
            )

            matched.append(
                ReconciliationMatch(
                    transaction_date=transaction_date,
                    transaction_description=(
                        transaction_description
                    ),
                    transaction_amount=(
                        transaction_amount
                    ),
                    receivable_id=receivable.id,
                    client_name=client_name,
                    receivable_description=(
                        receivable.description
                    ),
                    due_date=receivable.due_date,
                )
            )

        else:
            unmatched.append(
                ReconciliationUnmatched(
                    transaction_date=transaction_date,
                    transaction_description=(
                        transaction_description
                    ),
                    transaction_amount=(
                        transaction_amount
                    ),
                )
            )

    return ReconciliationPreviewResponse(
        total_transactions=total_transactions,
        matched_count=len(matched),
        unmatched_count=len(unmatched),
        matched=matched,
        unmatched=unmatched,
    )
@router.post(
    "/confirm",
    response_model=ReconciliationConfirmResponse
)
def confirm_reconciliation(
    data: ReconciliationConfirmRequest,
    db: Session = Depends(get_db)
):
    confirmed_ids = []

    for receivable_id in data.receivable_ids:
        receivable = (
            db.query(Receivable)
            .filter(
                Receivable.id == receivable_id
            )
            .first()
        )

        if not receivable:
            continue

        if receivable.status == "paid":
            continue

        receivable.status = "paid"
        receivable.paid_at = datetime.now(
            timezone.utc
        )

        confirmed_ids.append(
            receivable.id
        )

    db.commit()

    return ReconciliationConfirmResponse(
        confirmed_count=len(confirmed_ids),
        receivable_ids=confirmed_ids
    )
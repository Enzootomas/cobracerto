from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.client import Client
from app.models.collection_message import CollectionMessage
from app.models.receivable import Receivable
from app.schemas.collection_message import (
    CollectionGenerateRequest,
    CollectionMessageResponse,
)


router = APIRouter(
    prefix="/collections",
    tags=["Collections"]
)


def format_brl(value: Decimal) -> str:
    formatted = f"{value:,.2f}"

    formatted = (
        formatted
        .replace(",", "X")
        .replace(".", ",")
        .replace("X", ".")
    )

    return f"R$ {formatted}"


def generate_collection_text(
    client_name: str,
    description: str,
    amount: Decimal,
    due_date: date,
    tone: str
) -> str:

    amount_formatted = format_brl(amount)
    due_date_formatted = due_date.strftime("%d/%m/%Y")

    messages = {

        "friendly": (
            f"Olá, {client_name}! Tudo bem? "
            f"Passando para lembrar que identificamos uma pendência "
            f"referente a {description}, no valor de {amount_formatted}, "
            f"com vencimento em {due_date_formatted}. "
            "Se o pagamento já foi realizado, por favor desconsidere "
            "esta mensagem. Ficamos à disposição!"
        ),

        "professional": (
            f"Olá, {client_name}. "
            f"Identificamos que o pagamento referente a {description}, "
            f"no valor de {amount_formatted}, com vencimento em "
            f"{due_date_formatted}, encontra-se pendente. "
            "Pedimos a gentileza de verificar a situação. "
            "Caso o pagamento já tenha sido realizado, "
            "por favor desconsidere esta mensagem."
        ),

        "formal": (
            f"Prezado(a) {client_name}, informamos que consta em nosso "
            f"sistema uma pendência financeira referente a {description}, "
            f"no valor de {amount_formatted}, com vencimento em "
            f"{due_date_formatted}. Solicitamos a regularização do "
            "pagamento ou o contato para eventuais esclarecimentos."
        ),

        "direct": (
            f"Olá, {client_name}. O pagamento referente a {description}, "
            f"no valor de {amount_formatted}, está pendente. "
            f"Vencimento: {due_date_formatted}. "
            "Por favor, verifique a regularização do pagamento."
        ),
    }

    return messages[tone]


@router.post(
    "/generate",
    response_model=CollectionMessageResponse,
    status_code=status.HTTP_201_CREATED
)
def generate_collection_message(
    data: CollectionGenerateRequest,
    db: Session = Depends(get_db)
):

    result = (
        db.query(Receivable, Client)
        .join(
            Client,
            Client.id == Receivable.client_id
        )
        .filter(
            Receivable.id == data.receivable_id
        )
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Cobrança não encontrada."
        )

    receivable, client = result

    if receivable.status == "paid":
        raise HTTPException(
            status_code=409,
            detail="Não é possível cobrar uma cobrança já paga."
        )

    if receivable.due_date >= date.today():
        raise HTTPException(
            status_code=409,
            detail="Esta cobrança ainda não está atrasada."
        )

    message_text = generate_collection_text(
        client_name=client.name,
        description=receivable.description,
        amount=receivable.amount,
        due_date=receivable.due_date,
        tone=data.tone
    )

    collection_message = CollectionMessage(
        receivable_id=receivable.id,
        tone=data.tone,
        message=message_text
    )

    db.add(collection_message)
    db.commit()
    db.refresh(collection_message)

    return CollectionMessageResponse(
        id=collection_message.id,
        receivable_id=receivable.id,
        client_name=client.name,
        tone=collection_message.tone,
        message=collection_message.message,
        created_at=collection_message.created_at
    )

@router.get(
    "/receivable/{receivable_id}",
    response_model=list[CollectionMessageResponse]
)
def list_collection_messages(
    receivable_id: int,
    db: Session = Depends(get_db)
):
    receivable = (
        db.query(Receivable)
        .filter(Receivable.id == receivable_id)
        .first()
    )

    if not receivable:
        raise HTTPException(
            status_code=404,
            detail="Cobrança não encontrada."
        )

    client = (
        db.query(Client)
        .filter(Client.id == receivable.client_id)
        .first()
    )

    messages = (
        db.query(CollectionMessage)
        .filter(
            CollectionMessage.receivable_id == receivable_id
        )
        .order_by(
            CollectionMessage.created_at.desc()
        )
        .all()
    )

    return [
        CollectionMessageResponse(
            id=message.id,
            receivable_id=message.receivable_id,
            client_name=client.name,
            tone=message.tone,
            message=message.message,
            created_at=message.created_at
        )
        for message in messages
    ]

@router.get(
    "/receivable/{receivable_id}",
    response_model=list[CollectionMessageResponse]
)
def list_collection_messages(
    receivable_id: int,
    db: Session = Depends(get_db)
):
    receivable = (
        db.query(Receivable)
        .filter(Receivable.id == receivable_id)
        .first()
    )

    if not receivable:
        raise HTTPException(
            status_code=404,
            detail="Cobrança não encontrada."
        )

    client = (
        db.query(Client)
        .filter(Client.id == receivable.client_id)
        .first()
    )

    messages = (
        db.query(CollectionMessage)
        .filter(CollectionMessage.receivable_id == receivable_id)
        .order_by(CollectionMessage.created_at.desc())
        .all()
    )

    return [
        CollectionMessageResponse(
            id=message.id,
            receivable_id=message.receivable_id,
            client_name=client.name,
            tone=message.tone,
            message=message.message,
            created_at=message.created_at
        )
        for message in messages
    ]
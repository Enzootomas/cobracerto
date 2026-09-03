from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientResponse


router = APIRouter(
    prefix="/clients",
    tags=["Clients"]
)


@router.post(
    "",
    response_model=ClientResponse,
    status_code=status.HTTP_201_CREATED
)
def create_client(
    client_data: ClientCreate,
    db: Session = Depends(get_db)
):
    existing_email = (
        db.query(Client)
        .filter(Client.email == client_data.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="Já existe um cliente com este e-mail."
        )

    existing_document = (
        db.query(Client)
        .filter(Client.document == client_data.document)
        .first()
    )

    if existing_document:
        raise HTTPException(
            status_code=409,
            detail="Já existe um cliente com este documento."
        )

    client = Client(
        name=client_data.name,
        email=client_data.email,
        phone=client_data.phone,
        document=client_data.document
    )

    db.add(client)
    db.commit()
    db.refresh(client)

    return client


@router.get(
    "",
    response_model=list[ClientResponse]
)
def list_clients(
    db: Session = Depends(get_db)
):
    return db.query(Client).all()
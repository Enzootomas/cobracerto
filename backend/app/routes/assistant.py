from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.assistant import (
    AssistantQuestion,
    AssistantResponse,
)
from app.services.financial_assistant import (
    ask_financial_assistant,
)


router = APIRouter(
    prefix="/assistant",
    tags=["Assistant"]
)


@router.post(
    "/ask",
    response_model=AssistantResponse
)
def ask_assistant(
    data: AssistantQuestion,
    db: Session = Depends(get_db)
):
    try:
        answer = ask_financial_assistant(
            db=db,
            question=data.question
        )

        return AssistantResponse(
            answer=answer
        )

    except Exception as error:
        print(
            "Erro no assistente financeiro:",
            error
        )

        raise HTTPException(
            status_code=503,
            detail=(
                "O assistente financeiro está "
                "temporariamente indisponível."
            )
        )
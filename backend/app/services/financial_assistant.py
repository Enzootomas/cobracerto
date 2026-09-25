from datetime import date
from decimal import Decimal

from google import genai
from sqlalchemy.orm import Session

from app.database.connection import settings
from app.models.client import Client
from app.models.receivable import Receivable


client = genai.Client(
    api_key=settings.gemini_api_key
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


def build_financial_context(
    db: Session
) -> str:
    results = (
        db.query(
            Receivable,
            Client.name
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

    today = date.today()

    total_count = len(results)

    paid_count = 0
    pending_count = 0
    overdue_count = 0

    paid_amount = Decimal("0.00")
    pending_amount = Decimal("0.00")
    overdue_amount = Decimal("0.00")

    overdue_details = []

    for receivable, client_name in results:

        if receivable.status == "paid":
            paid_count += 1
            paid_amount += receivable.amount

        elif receivable.due_date < today:
            overdue_count += 1
            overdue_amount += receivable.amount

            days_overdue = (
                today - receivable.due_date
            ).days

            overdue_details.append(
                (
                    f"- Cliente: {client_name} | "
                    f"Cobrança: {receivable.description} | "
                    f"Valor: {format_brl(receivable.amount)} | "
                    f"Vencimento: "
                    f"{receivable.due_date.strftime('%d/%m/%Y')} | "
                    f"Dias em atraso: {days_overdue}"
                )
            )

        else:
            pending_count += 1
            pending_amount += receivable.amount

    total_open = (
        pending_amount +
        overdue_amount
    )

    if total_count > 0:
        delinquency_rate = round(
            (overdue_count / total_count) * 100,
            2
        )
    else:
        delinquency_rate = 0.0

    if overdue_details:
        overdue_text = "\n".join(
            overdue_details
        )
    else:
        overdue_text = (
            "Não existem cobranças em atraso."
        )

    context = f"""
RESUMO FINANCEIRO ATUAL DO COBRACERTO

Total de cobranças: {total_count}

Cobranças pagas:
- Quantidade: {paid_count}
- Valor: {format_brl(paid_amount)}

Cobranças pendentes:
- Quantidade: {pending_count}
- Valor: {format_brl(pending_amount)}

Cobranças atrasadas:
- Quantidade: {overdue_count}
- Valor: {format_brl(overdue_amount)}

Valor total ainda a receber:
- {format_brl(total_open)}

Taxa de inadimplência:
- {delinquency_rate}%

DETALHES DAS COBRANÇAS ATRASADAS:

{overdue_text}
"""

    return context.strip()


def ask_financial_assistant(
    db: Session,
    question: str
) -> str:
    financial_context = (
        build_financial_context(db)
    )

    prompt = f"""
Você é o Assistente Financeiro do CobraCerto.

Sua função é responder perguntas sobre a situação
financeira da empresa utilizando SOMENTE os dados
fornecidos abaixo.

CONTEXTO FINANCEIRO:

{financial_context}

PERGUNTA DO USUÁRIO:

{question}

REGRAS:

- Responda em português do Brasil.
- Use somente os dados fornecidos no contexto.
- Nunca invente valores, clientes ou cobranças.
- Se não houver informação suficiente, diga isso claramente.
- Seja objetivo e fácil de entender.
- Quando mencionar dinheiro, utilize o formato brasileiro.
- Quando houver cobranças atrasadas, você pode indicar
  quais devem receber atenção primeiro.
- Para priorização, considere principalmente dias em atraso
  e valor da cobrança.
- Não altere nenhum dado.
- Não afirme que uma cobrança foi paga se isso não estiver
  indicado no contexto.
- Não forneça informações que não estejam relacionadas
  à situação financeira apresentada.
- Retorne somente a resposta ao usuário.
"""

    interaction = client.interactions.create(
        model="gemini-3.5-flash-lite",
        input=prompt,
        generation_config={
            "thinking_level": "low"
        }
    )

    return interaction.output_text.strip()
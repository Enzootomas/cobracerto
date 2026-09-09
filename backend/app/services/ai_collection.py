from datetime import date
from decimal import Decimal

from google import genai

from app.database.connection import settings


client = genai.Client(
    api_key=settings.gemini_api_key
)


def test_gemini() -> str:
    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input="Responda apenas: Gemini conectado com sucesso.",
        generation_config={
            "thinking_level": "low"
        }
    )

    return interaction.output_text


def generate_ai_collection_message(
    client_name: str,
    description: str,
    amount: Decimal,
    due_date: date,
    days_overdue: int,
    tone: str
) -> str:

    tone_labels = {
        "friendly": "amigável, cordial e próximo",
        "professional": "profissional, educado e objetivo",
        "formal": "formal, respeitoso e cuidadoso",
        "direct": "direto, curto e objetivo"
    }

    tone_instruction = tone_labels.get(
        tone,
        "profissional, educado e objetivo"
    )

    amount_formatted = (
        f"R$ {amount:,.2f}"
        .replace(",", "X")
        .replace(".", ",")
        .replace("X", ".")
    )

    due_date_formatted = due_date.strftime("%d/%m/%Y")

    prompt = f"""
Você é um assistente financeiro responsável por criar mensagens de cobrança.

Crie uma mensagem de cobrança em português do Brasil.

DADOS DA COBRANÇA:

Cliente: {client_name}
Descrição: {description}
Valor: {amount_formatted}
Data de vencimento: {due_date_formatted}
Dias em atraso: {days_overdue}
Tom desejado: {tone_instruction}

REGRAS:

- Seja educado e respeitoso.
- Utilize o tom solicitado.
- Não ameace o cliente.
- Não seja agressivo.
- Não invente nenhum dado.
- Não mencione juros ou multas que não foram informados.
- Não invente formas de pagamento.
- Não ofereça boleto, segunda via, PIX, chave PIX ou link de pagamento.
- Não invente telefone, e-mail, prazo ou condição de negociação.
- Não use linguagem jurídica desnecessária.
- A mensagem deve parecer escrita por uma pessoa.
- Seja breve e natural.
- Inclua obrigatoriamente o valor.
- Inclua obrigatoriamente a data de vencimento.
- Você pode mencionar os dias em atraso de maneira natural.
- Caso o pagamento já tenha sido realizado, peça para desconsiderar a mensagem.
- Não assine como CobraCerto.
- Não invente o nome da empresa responsável pela cobrança.
- Não coloque explicações antes ou depois da mensagem.
- Retorne somente a mensagem final.
"""

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt,
        generation_config={
            "thinking_level": "low"
        }
    )

    return interaction.output_text.strip()
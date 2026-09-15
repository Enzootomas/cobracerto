from pydantic import BaseModel, Field


class AssistantQuestion(BaseModel):
    question: str = Field(
        min_length=2,
        max_length=500
    )


class AssistantResponse(BaseModel):
    answer: str
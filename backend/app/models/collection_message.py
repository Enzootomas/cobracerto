from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class CollectionMessage(Base):
    __tablename__ = "collection_messages"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    receivable_id: Mapped[int] = mapped_column(
        ForeignKey("receivables.id"),
        nullable=False,
        index=True
    )

    tone: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
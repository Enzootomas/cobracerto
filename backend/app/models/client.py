from datetime import datetime

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        unique=True
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    document: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        unique=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
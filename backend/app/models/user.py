from typing import TYPE_CHECKING

from sqlalchemy import String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.application import Application
    from app.models.project import Project, ProjectMember


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    bio: Mapped[str] = mapped_column(Text, default="")
    skills: Mapped[list[str]] = mapped_column(ARRAY(String(50)), default=list)

    projects: Mapped[list["Project"]] = relationship(back_populates="owner", cascade="all, delete-orphan")
    memberships: Mapped[list["ProjectMember"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    applications: Mapped[list["Application"]] = relationship(back_populates="user", cascade="all, delete-orphan")

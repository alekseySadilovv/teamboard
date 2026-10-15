import enum
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, String, Table, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.application import Application
    from app.models.user import User


class ProjectStatus(str, enum.Enum):
    idea = "idea"
    recruiting = "recruiting"
    in_progress = "in_progress"
    completed = "completed"


project_tags = Table(
    "project_tags",
    Base.metadata,
    Column("project_id", ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), unique=True, index=True)

    projects: Mapped[list["Project"]] = relationship(secondary=project_tags, back_populates="tags")


class Project(TimestampMixin, Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120))
    summary: Mapped[str] = mapped_column(String(300))
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus, name="project_status"), default=ProjectStatus.recruiting, index=True
    )
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)

    owner: Mapped["User"] = relationship(back_populates="projects")
    tags: Mapped[list[Tag]] = relationship(secondary=project_tags, back_populates="projects", order_by=Tag.name)
    roles: Mapped[list["ProjectRole"]] = relationship(
        back_populates="project", cascade="all, delete-orphan", order_by="ProjectRole.id"
    )
    members: Mapped[list["ProjectMember"]] = relationship(
        back_populates="project", cascade="all, delete-orphan", order_by="ProjectMember.id"
    )
    applications: Mapped[list["Application"]] = relationship(back_populates="project", cascade="all, delete-orphan")


class ProjectRole(Base):
    __tablename__ = "project_roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(String(300), default="")
    is_open: Mapped[bool] = mapped_column(Boolean, default=True)

    project: Mapped[Project] = relationship(back_populates="roles")
    applications: Mapped[list["Application"]] = relationship(back_populates="role", cascade="all, delete-orphan")


class ProjectMember(Base):
    __tablename__ = "project_members"
    __table_args__ = (UniqueConstraint("project_id", "user_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    role_id: Mapped[int | None] = mapped_column(ForeignKey("project_roles.id", ondelete="SET NULL"))
    role_title: Mapped[str] = mapped_column(String(80))
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    project: Mapped[Project] = relationship(back_populates="members")
    user: Mapped["User"] = relationship(back_populates="memberships")

import enum
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.project import Project, ProjectRole
    from app.models.user import User


class ApplicationStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class Application(TimestampMixin, Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("project_roles.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    message: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"), default=ApplicationStatus.pending, index=True
    )

    project: Mapped["Project"] = relationship(back_populates="applications")
    role: Mapped["ProjectRole"] = relationship(back_populates="applications")
    user: Mapped["User"] = relationship(back_populates="applications")

    @property
    def project_title(self) -> str:
        return self.project.title

    @property
    def role_title(self) -> str:
        return self.role.title

from datetime import datetime

from pydantic import Field

from app.models.application import ApplicationStatus
from app.schemas.common import CamelModel
from app.schemas.user import UserShort


class ApplicationCreate(CamelModel):
    role_id: int
    message: str = Field(default="", max_length=2000)


class ApplicationDecision(CamelModel):
    status: ApplicationStatus


class ApplicationRead(CamelModel):
    id: int
    project_id: int
    project_title: str
    role_id: int
    role_title: str
    user: UserShort
    message: str
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime

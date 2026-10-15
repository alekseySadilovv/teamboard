from datetime import datetime
from typing import Annotated, Any

from pydantic import Field, StringConstraints, computed_field, field_validator

from app.models.project import ProjectStatus
from app.schemas.common import CamelModel
from app.schemas.tag import TagName
from app.schemas.user import UserShort

Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=120)]
Summary = Annotated[str, StringConstraints(strip_whitespace=True, min_length=10, max_length=300)]
RoleTitle = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=80)]


class RoleCreate(CamelModel):
    title: RoleTitle
    description: str = Field(default="", max_length=300)
    is_open: bool = True


class RoleUpdate(CamelModel):
    title: RoleTitle | None = None
    description: str | None = Field(default=None, max_length=300)
    is_open: bool | None = None


class RoleSync(RoleCreate):
    id: int | None = None


class RoleRead(CamelModel):
    id: int
    title: str
    description: str
    is_open: bool


class MemberRead(CamelModel):
    id: int
    user: UserShort
    role_title: str
    joined_at: datetime


def _unique_tags(value: list[str] | None) -> list[str] | None:
    return list(dict.fromkeys(value)) if value is not None else None


class ProjectCreate(CamelModel):
    title: Title
    summary: Summary
    description: str = Field(default="", max_length=5000)
    status: ProjectStatus = ProjectStatus.recruiting
    tags: list[TagName] = Field(default_factory=list, max_length=10)
    roles: list[RoleCreate] = Field(default_factory=list, max_length=20)

    _tags = field_validator("tags")(_unique_tags)


class ProjectUpdate(CamelModel):
    title: Title | None = None
    summary: Summary | None = None
    description: str | None = Field(default=None, max_length=5000)
    status: ProjectStatus | None = None
    tags: list[TagName] | None = Field(default=None, max_length=10)
    roles: list[RoleSync] | None = Field(default=None, max_length=20)

    _tags = field_validator("tags")(_unique_tags)


class ProjectRead(CamelModel):
    id: int
    title: str
    summary: str
    description: str
    status: ProjectStatus
    tags: list[str]
    owner: UserShort
    roles: list[RoleRead]
    members: list[MemberRead]
    created_at: datetime
    updated_at: datetime

    @field_validator("tags", mode="before")
    @classmethod
    def tag_names(cls, value: list[Any]) -> list[str]:
        return [item if isinstance(item, str) else item.name for item in value]

    @computed_field
    def open_roles_count(self) -> int:
        return sum(1 for role in self.roles if role.is_open)

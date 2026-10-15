from datetime import datetime
from typing import Annotated

from pydantic import EmailStr, Field, StringConstraints, field_validator

from app.schemas.common import CamelModel

Username = Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=50, pattern=r"^[A-Za-z0-9_]+$")]
FullName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=120)]
Skill = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=50)]


class UserBase(CamelModel):
    username: Username
    email: EmailStr
    full_name: FullName
    bio: str = Field(default="", max_length=2000)
    skills: list[Skill] = Field(default_factory=list, max_length=20)

    @field_validator("skills")
    @classmethod
    def unique_skills(cls, value: list[str]) -> list[str]:
        return list(dict.fromkeys(value))


class UserUpdate(CamelModel):
    username: Username | None = None
    email: EmailStr | None = None
    full_name: FullName | None = None
    bio: str | None = Field(default=None, max_length=2000)
    skills: list[Skill] | None = Field(default=None, max_length=20)

    @field_validator("skills")
    @classmethod
    def unique_skills(cls, value: list[str] | None) -> list[str] | None:
        return list(dict.fromkeys(value)) if value is not None else None


class UserShort(CamelModel):
    id: int
    username: str
    full_name: str


class UserPublic(CamelModel):
    id: int
    username: str
    full_name: str
    bio: str
    skills: list[str]
    created_at: datetime


class UserRead(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

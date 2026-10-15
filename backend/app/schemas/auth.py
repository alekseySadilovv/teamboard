from typing import Annotated

from pydantic import AfterValidator, EmailStr, Field

from app.schemas.common import CamelModel
from app.schemas.user import FullName, UserRead, Username


def _check_password(value: str) -> str:
    if not any(ch.isalpha() for ch in value):
        raise ValueError("Пароль должен содержать хотя бы одну букву")
    if not any(ch.isdigit() for ch in value):
        raise ValueError("Пароль должен содержать хотя бы одну цифру")
    return value


Password = Annotated[str, Field(min_length=8, max_length=128), AfterValidator(_check_password)]


class RegisterRequest(CamelModel):
    username: Username
    email: EmailStr
    full_name: FullName
    password: Password


class LoginRequest(CamelModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead

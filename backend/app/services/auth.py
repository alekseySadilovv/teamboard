from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    password_needs_rehash,
    verify_password,
)
from app.models import RefreshToken, User
from app.schemas.auth import RegisterRequest
from app.services.errors import ServiceError
from app.services.users import ensure_unique


class AuthError(ServiceError):
    status_code = 401


@dataclass
class IssuedTokens:
    user: User
    access_token: str
    expires_in: int
    refresh_token: str


def _issue_tokens(db: Session, user: User, user_agent: str) -> IssuedTokens:
    refresh_token = generate_refresh_token()
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=hash_refresh_token(refresh_token),
            expires_at=datetime.now(UTC) + timedelta(days=settings.refresh_token_expire_days),
            user_agent=user_agent[:255],
        )
    )
    db.commit()
    db.refresh(user)
    access_token, expires_in = create_access_token(user.id)
    return IssuedTokens(user=user, access_token=access_token, expires_in=expires_in, refresh_token=refresh_token)


def register(db: Session, data: RegisterRequest, user_agent: str = "") -> IssuedTokens:
    ensure_unique(db, data.username, data.email)
    user = User(
        username=data.username,
        email=data.email.lower(),
        full_name=data.full_name,
        bio="",
        skills=[],
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.flush()
    return _issue_tokens(db, user, user_agent)


def login(db: Session, email: str, password: str, user_agent: str = "") -> IssuedTokens:
    user = db.scalar(select(User).where(func.lower(User.email) == email.lower()))
    if user is None or not verify_password(password, user.password_hash):
        raise AuthError("Неверный email или пароль")
    if password_needs_rehash(user.password_hash):
        user.password_hash = hash_password(password)
    return _issue_tokens(db, user, user_agent)


def refresh(db: Session, refresh_token: str | None, user_agent: str = "") -> IssuedTokens:
    if not refresh_token:
        raise AuthError("Refresh token отсутствует")
    stored = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(refresh_token)))
    if stored is None:
        raise AuthError("Некорректный refresh token")
    now = datetime.now(UTC)
    if stored.revoked_at is not None:
        revoke_all(db, stored.user_id)
        raise AuthError("Refresh token отозван, выполните вход заново")
    if stored.expires_at <= now:
        raise AuthError("Срок действия refresh token истёк, выполните вход заново")

    stored.revoked_at = now
    return _issue_tokens(db, stored.user, user_agent)


def logout(db: Session, refresh_token: str | None) -> None:
    if not refresh_token:
        return
    stored = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(refresh_token)))
    if stored is not None and stored.revoked_at is None:
        stored.revoked_at = datetime.now(UTC)
        db.commit()


def revoke_all(db: Session, user_id: int) -> None:
    db.execute(
        update(RefreshToken)
        .where(RefreshToken.user_id == user_id, RefreshToken.revoked_at.is_(None))
        .values(revoked_at=datetime.now(UTC))
    )
    db.commit()

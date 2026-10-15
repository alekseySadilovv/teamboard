from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models import ProjectRole, User
from app.schemas.user import UserUpdate
from app.services.errors import ConflictError, NotFoundError


def get_user(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise NotFoundError("Пользователь не найден")
    return user


def list_users(db: Session, search: str | None, limit: int, offset: int) -> tuple[list[User], int]:
    query = select(User)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.where(or_(User.username.ilike(pattern), User.full_name.ilike(pattern)))
    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(query.order_by(User.id).limit(limit).offset(offset)).all()
    return list(items), total


def ensure_unique(db: Session, username: str | None, email: str | None, exclude_id: int | None = None) -> None:
    if username:
        existing = db.scalar(select(User).where(func.lower(User.username) == username.lower()))
        if existing and existing.id != exclude_id:
            raise ConflictError("Пользователь с таким именем уже существует")
    if email:
        existing = db.scalar(select(User).where(func.lower(User.email) == email.lower()))
        if existing and existing.id != exclude_id:
            raise ConflictError("Пользователь с таким email уже существует")


def update_user(db: Session, user_id: int, data: UserUpdate) -> User:
    user = get_user(db, user_id)
    changes = data.model_dump(exclude_unset=True, exclude_none=True)
    ensure_unique(db, changes.get("username"), changes.get("email"), exclude_id=user.id)
    if "email" in changes:
        changes["email"] = changes["email"].lower()
    for field, value in changes.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> None:
    user = get_user(db, user_id)
    for membership in user.memberships:
        if membership.role_id is not None:
            role = db.get(ProjectRole, membership.role_id)
            if role is not None:
                role.is_open = True
    db.delete(user)
    db.commit()

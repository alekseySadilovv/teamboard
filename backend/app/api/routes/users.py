from fastapi import APIRouter, Query, Response, status

from app.api.deps import CurrentUser, DbSession
from app.core.config import settings
from app.schemas.common import Page
from app.schemas.user import UserPublic, UserRead, UserUpdate
from app.services import users as service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=Page[UserPublic])
def list_users(
    db: DbSession,
    search: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    items, total = service.list_users(db, search, limit, offset)
    return {"items": items, "total": total}


@router.get("/me", response_model=UserRead)
def get_me(user: CurrentUser):
    return user


@router.patch("/me", response_model=UserRead)
def update_me(data: UserUpdate, user: CurrentUser, db: DbSession):
    return service.update_user(db, user.id, data)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(user: CurrentUser, db: DbSession, response: Response):
    service.delete_user(db, user.id)
    response.delete_cookie(settings.refresh_cookie_name, path="/api/auth")


@router.get("/{user_id}", response_model=UserPublic)
def get_user(user_id: int, db: DbSession):
    return service.get_user(db, user_id)

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import Page
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services import users as service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=Page[UserRead])
def list_users(
    search: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    items, total = service.list_users(db, search, limit, offset)
    return {"items": items, "total": total}


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    return service.create_user(db, data)


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return service.get_user(db, user_id)


@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    return service.update_user(db, user_id, data)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    service.delete_user(db, user_id)

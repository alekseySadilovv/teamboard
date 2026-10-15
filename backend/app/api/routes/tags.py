from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.tag import TagCreate, TagRead, TagUpdate, TagWithCount
from app.services import tags as service

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("", response_model=list[TagWithCount])
def list_tags(db: Session = Depends(get_db)):
    return service.list_tags_with_counts(db)


@router.post("", response_model=TagRead, status_code=status.HTTP_201_CREATED)
def create_tag(data: TagCreate, db: Session = Depends(get_db)):
    return service.create_tag(db, data.name)


@router.get("/{tag_id}", response_model=TagRead)
def get_tag(tag_id: int, db: Session = Depends(get_db)):
    return service.get_tag(db, tag_id)


@router.patch("/{tag_id}", response_model=TagRead)
def update_tag(tag_id: int, data: TagUpdate, db: Session = Depends(get_db)):
    return service.update_tag(db, tag_id, data.name)


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    service.delete_tag(db, tag_id)

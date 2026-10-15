from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Tag, project_tags
from app.services.errors import ConflictError, NotFoundError


def list_tags_with_counts(db: Session) -> list[dict]:
    rows = db.execute(
        select(Tag.id, Tag.name, func.count(project_tags.c.project_id).label("project_count"))
        .outerjoin(project_tags, project_tags.c.tag_id == Tag.id)
        .group_by(Tag.id)
        .order_by(func.count(project_tags.c.project_id).desc(), Tag.name)
    ).all()
    return [row._asdict() for row in rows]


def get_tag(db: Session, tag_id: int) -> Tag:
    tag = db.get(Tag, tag_id)
    if tag is None:
        raise NotFoundError("Тег не найден")
    return tag


def _ensure_unique(db: Session, name: str, exclude_id: int | None = None) -> None:
    existing = db.scalar(select(Tag).where(Tag.name == name))
    if existing and existing.id != exclude_id:
        raise ConflictError("Тег с таким названием уже существует")


def create_tag(db: Session, name: str) -> Tag:
    _ensure_unique(db, name)
    tag = Tag(name=name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def update_tag(db: Session, tag_id: int, name: str) -> Tag:
    tag = get_tag(db, tag_id)
    _ensure_unique(db, name, exclude_id=tag.id)
    tag.name = name
    db.commit()
    db.refresh(tag)
    return tag


def delete_tag(db: Session, tag_id: int) -> None:
    tag = get_tag(db, tag_id)
    db.delete(tag)
    db.commit()


def get_or_create_tags(db: Session, names: list[str]) -> list[Tag]:
    if not names:
        return []
    existing = {tag.name: tag for tag in db.scalars(select(Tag).where(Tag.name.in_(names)))}
    tags = []
    for name in names:
        tag = existing.get(name)
        if tag is None:
            tag = Tag(name=name)
            db.add(tag)
            existing[name] = tag
        tags.append(tag)
    return tags

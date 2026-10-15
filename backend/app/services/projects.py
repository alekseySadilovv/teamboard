from sqlalchemy import exists, func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models import Project, ProjectMember, ProjectRole, ProjectStatus, Tag, User
from app.schemas.project import ProjectCreate, ProjectUpdate, RoleCreate, RoleSync, RoleUpdate
from app.services.errors import BusinessRuleError, NotFoundError, PermissionDeniedError
from app.services.tags import get_or_create_tags

OWNER_ROLE_TITLE = "Автор проекта"

_project_options = (
    selectinload(Project.owner),
    selectinload(Project.tags),
    selectinload(Project.roles),
    selectinload(Project.members).selectinload(ProjectMember.user),
)


def ensure_can_manage(project: Project, user: User) -> None:
    if project.owner_id != user.id and not user.is_admin:
        raise PermissionDeniedError("Изменять проект может только его автор")


def get_project(db: Session, project_id: int) -> Project:
    project = db.scalar(select(Project).where(Project.id == project_id).options(*_project_options))
    if project is None:
        raise NotFoundError("Проект не найден")
    return project


def list_projects(
    db: Session,
    *,
    search: str | None = None,
    tags: list[str] | None = None,
    status: ProjectStatus | None = None,
    has_open_roles: bool | None = None,
    owner_id: int | None = None,
    member_id: int | None = None,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[Project], int]:
    query = select(Project)
    if search:
        pattern = f"%{search.strip()}%"
        query = query.where(
            or_(Project.title.ilike(pattern), Project.summary.ilike(pattern), Project.description.ilike(pattern))
        )
    for name in tags or []:
        query = query.where(Project.tags.any(Tag.name == name.strip().lower().lstrip("#")))
    if status is not None:
        query = query.where(Project.status == status)
    if has_open_roles is not None:
        open_role = exists().where(ProjectRole.project_id == Project.id, ProjectRole.is_open.is_(True))
        query = query.where(open_role if has_open_roles else ~open_role)
    if owner_id is not None:
        query = query.where(Project.owner_id == owner_id)
    if member_id is not None:
        query = query.where(Project.members.any(ProjectMember.user_id == member_id))

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(
        query.options(*_project_options).order_by(Project.created_at.desc(), Project.id.desc()).limit(limit).offset(offset)
    ).all()
    return list(items), total


def create_project(db: Session, data: ProjectCreate, owner: User) -> Project:
    project = Project(
        title=data.title,
        summary=data.summary,
        description=data.description,
        status=data.status,
        owner=owner,
        tags=get_or_create_tags(db, data.tags),
        roles=[ProjectRole(**role.model_dump()) for role in data.roles],
    )
    project.members.append(ProjectMember(user=owner, role_title=OWNER_ROLE_TITLE))
    db.add(project)
    db.commit()
    return get_project(db, project.id)


def _sync_roles(project: Project, roles: list[RoleSync]) -> None:
    current = {role.id: role for role in project.roles}
    keep: list[ProjectRole] = []
    for item in roles:
        if item.id is not None:
            role = current.get(item.id)
            if role is None:
                raise BusinessRuleError(f"Роль с id={item.id} не относится к этому проекту")
            role.title = item.title
            role.description = item.description
            role.is_open = item.is_open
        else:
            role = ProjectRole(title=item.title, description=item.description, is_open=item.is_open)
        keep.append(role)
    project.roles = keep


def update_project(db: Session, project_id: int, data: ProjectUpdate, user: User) -> Project:
    project = get_project(db, project_id)
    ensure_can_manage(project, user)
    changes = data.model_dump(exclude_unset=True, exclude_none=True, exclude={"tags", "roles"})
    for field, value in changes.items():
        setattr(project, field, value)
    if data.tags is not None:
        project.tags = get_or_create_tags(db, data.tags)
    if data.roles is not None:
        _sync_roles(project, data.roles)
    db.commit()
    db.expire_all()
    return get_project(db, project.id)


def delete_project(db: Session, project_id: int, user: User) -> None:
    project = get_project(db, project_id)
    ensure_can_manage(project, user)
    db.delete(project)
    db.commit()


def get_role(db: Session, role_id: int) -> ProjectRole:
    role = db.get(ProjectRole, role_id)
    if role is None:
        raise NotFoundError("Роль не найдена")
    return role


def add_role(db: Session, project_id: int, data: RoleCreate, user: User) -> ProjectRole:
    project = get_project(db, project_id)
    ensure_can_manage(project, user)
    role = ProjectRole(**data.model_dump())
    project.roles.append(role)
    db.commit()
    db.refresh(role)
    return role


def update_role(db: Session, role_id: int, data: RoleUpdate, user: User) -> ProjectRole:
    role = get_role(db, role_id)
    ensure_can_manage(role.project, user)
    for field, value in data.model_dump(exclude_unset=True, exclude_none=True).items():
        setattr(role, field, value)
    db.commit()
    db.refresh(role)
    return role


def delete_role(db: Session, role_id: int, user: User) -> None:
    role = get_role(db, role_id)
    ensure_can_manage(role.project, user)
    db.delete(role)
    db.commit()


def remove_member(db: Session, project_id: int, member_id: int, user: User) -> None:
    project = get_project(db, project_id)
    member = next((item for item in project.members if item.id == member_id), None)
    if member is None:
        raise NotFoundError("Участник не найден")
    if member.user_id != user.id:
        ensure_can_manage(project, user)
    if member.user_id == project.owner_id:
        raise BusinessRuleError("Автора проекта нельзя исключить из команды")
    if member.role_id is not None:
        role = db.get(ProjectRole, member.role_id)
        if role is not None:
            role.is_open = True
    project.members.remove(member)
    db.commit()

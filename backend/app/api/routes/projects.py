from fastapi import APIRouter, Query, status

from app.api.deps import CurrentUser, DbSession
from app.models import ProjectStatus
from app.schemas.common import Page
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate, RoleCreate, RoleRead, RoleUpdate
from app.services import projects as service

router = APIRouter(tags=["projects"])


@router.get("/projects", response_model=Page[ProjectRead])
def list_projects(
    db: DbSession,
    search: str | None = None,
    tags: list[str] = Query(default_factory=list),
    status: ProjectStatus | None = None,
    has_open_roles: bool | None = Query(None, alias="hasOpenRoles"),
    owner_id: int | None = Query(None, alias="ownerId"),
    member_id: int | None = Query(None, alias="memberId"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    items, total = service.list_projects(
        db,
        search=search,
        tags=tags,
        status=status,
        has_open_roles=has_open_roles,
        owner_id=owner_id,
        member_id=member_id,
        limit=limit,
        offset=offset,
    )
    return {"items": items, "total": total}


@router.post("/projects", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(data: ProjectCreate, user: CurrentUser, db: DbSession):
    return service.create_project(db, data, user)


@router.get("/projects/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: DbSession):
    return service.get_project(db, project_id)


@router.patch("/projects/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, data: ProjectUpdate, user: CurrentUser, db: DbSession):
    return service.update_project(db, project_id, data, user)


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, user: CurrentUser, db: DbSession):
    service.delete_project(db, project_id, user)


@router.post("/projects/{project_id}/roles", response_model=RoleRead, status_code=status.HTTP_201_CREATED)
def add_role(project_id: int, data: RoleCreate, user: CurrentUser, db: DbSession):
    return service.add_role(db, project_id, data, user)


@router.patch("/roles/{role_id}", response_model=RoleRead)
def update_role(role_id: int, data: RoleUpdate, user: CurrentUser, db: DbSession):
    return service.update_role(db, role_id, data, user)


@router.delete("/roles/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(role_id: int, user: CurrentUser, db: DbSession):
    service.delete_role(db, role_id, user)


@router.delete("/projects/{project_id}/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member(project_id: int, member_id: int, user: CurrentUser, db: DbSession):
    service.remove_member(db, project_id, member_id, user)

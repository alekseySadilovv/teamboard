from fastapi import APIRouter, status

from app.api.deps import CurrentUser, DbSession
from app.models import ApplicationStatus
from app.schemas.application import ApplicationCreate, ApplicationDecision, ApplicationRead
from app.services import applications as service

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("/my", response_model=list[ApplicationRead])
def list_my_applications(user: CurrentUser, db: DbSession, status: ApplicationStatus | None = None):
    return service.list_applications(db, user_id=user.id, status=status)


@router.get("/incoming", response_model=list[ApplicationRead])
def list_incoming_applications(user: CurrentUser, db: DbSession, status: ApplicationStatus | None = None):
    return service.list_applications(db, owner_id=user.id, status=status)


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(data: ApplicationCreate, user: CurrentUser, db: DbSession):
    return service.create_application(db, user, data.role_id, data.message)


@router.get("/{application_id}", response_model=ApplicationRead)
def get_application(application_id: int, user: CurrentUser, db: DbSession):
    return service.get_application_for(db, application_id, user)


@router.patch("/{application_id}", response_model=ApplicationRead)
def decide_application(application_id: int, data: ApplicationDecision, user: CurrentUser, db: DbSession):
    return service.decide_application(db, application_id, data.status, user)


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, user: CurrentUser, db: DbSession):
    service.delete_application(db, application_id, user)

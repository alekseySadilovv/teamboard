from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import ApplicationStatus
from app.schemas.application import ApplicationCreate, ApplicationDecision, ApplicationRead
from app.services import applications as service

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=list[ApplicationRead])
def list_applications(
    user_id: int | None = Query(None, alias="userId"),
    owner_id: int | None = Query(None, alias="ownerId"),
    project_id: int | None = Query(None, alias="projectId"),
    status: ApplicationStatus | None = None,
    db: Session = Depends(get_db),
):
    return service.list_applications(db, user_id=user_id, owner_id=owner_id, project_id=project_id, status=status)


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(data: ApplicationCreate, db: Session = Depends(get_db)):
    return service.create_application(db, data.user_id, data.role_id, data.message)


@router.get("/{application_id}", response_model=ApplicationRead)
def get_application(application_id: int, db: Session = Depends(get_db)):
    return service.get_application(db, application_id)


@router.patch("/{application_id}", response_model=ApplicationRead)
def decide_application(application_id: int, data: ApplicationDecision, db: Session = Depends(get_db)):
    return service.decide_application(db, application_id, data.status)


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    service.delete_application(db, application_id)

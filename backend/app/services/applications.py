from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import Application, ApplicationStatus, Project, ProjectMember, ProjectRole
from app.services.errors import BusinessRuleError, ConflictError, NotFoundError
from app.services.users import get_user

_application_options = (
    selectinload(Application.project),
    selectinload(Application.role),
    selectinload(Application.user),
)


def get_application(db: Session, application_id: int) -> Application:
    application = db.scalar(
        select(Application).where(Application.id == application_id).options(*_application_options)
    )
    if application is None:
        raise NotFoundError("Заявка не найдена")
    return application


def list_applications(
    db: Session,
    *,
    user_id: int | None = None,
    owner_id: int | None = None,
    project_id: int | None = None,
    status: ApplicationStatus | None = None,
) -> list[Application]:
    query = select(Application).options(*_application_options)
    if user_id is not None:
        query = query.where(Application.user_id == user_id)
    if owner_id is not None:
        query = query.join(Application.project).where(Project.owner_id == owner_id)
    if project_id is not None:
        query = query.where(Application.project_id == project_id)
    if status is not None:
        query = query.where(Application.status == status)
    return list(db.scalars(query.order_by(Application.created_at.desc(), Application.id.desc())).all())


def create_application(db: Session, user_id: int, role_id: int, message: str) -> Application:
    user = get_user(db, user_id)
    role = db.get(ProjectRole, role_id)
    if role is None:
        raise NotFoundError("Роль не найдена")
    project = role.project
    if project.owner_id == user.id:
        raise BusinessRuleError("Нельзя подать заявку в собственный проект")
    if not role.is_open:
        raise BusinessRuleError("Набор на эту роль закрыт")
    if any(member.user_id == user.id for member in project.members):
        raise BusinessRuleError("Вы уже состоите в команде этого проекта")
    duplicate = db.scalar(
        select(Application).where(
            Application.role_id == role.id,
            Application.user_id == user.id,
            Application.status == ApplicationStatus.pending,
        )
    )
    if duplicate is not None:
        raise ConflictError("Заявка на эту роль уже отправлена и ожидает решения")

    application = Application(project=project, role=role, user=user, message=message.strip())
    db.add(application)
    db.commit()
    return get_application(db, application.id)


def decide_application(db: Session, application_id: int, status: ApplicationStatus) -> Application:
    application = get_application(db, application_id)
    if application.status != ApplicationStatus.pending:
        raise BusinessRuleError("Заявка уже рассмотрена")
    if status == ApplicationStatus.pending:
        raise BusinessRuleError("Укажите решение: accepted или rejected")

    if status == ApplicationStatus.accepted:
        role = application.role
        if not role.is_open:
            raise BusinessRuleError("Роль уже занята")
        project = application.project
        if not any(member.user_id == application.user_id for member in project.members):
            project.members.append(
                ProjectMember(user_id=application.user_id, role_id=role.id, role_title=role.title)
            )
        role.is_open = False
        for other in db.scalars(
            select(Application).where(
                Application.role_id == role.id,
                Application.id != application.id,
                Application.status == ApplicationStatus.pending,
            )
        ):
            other.status = ApplicationStatus.rejected

    application.status = status
    db.commit()
    db.expire_all()
    return get_application(db, application.id)


def delete_application(db: Session, application_id: int) -> None:
    application = get_application(db, application_id)
    if application.status != ApplicationStatus.pending:
        raise BusinessRuleError("Отозвать можно только заявку на рассмотрении")
    db.delete(application)
    db.commit()

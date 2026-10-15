import os

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models import ApplicationStatus, ProjectStatus, User
from app.schemas.project import ProjectCreate, RoleCreate
from app.services import applications, projects

SEED_PASSWORD = os.getenv("SEED_PASSWORD", "password1")

USERS = [
    ("asadilov", "asadilov@example.com", "Алексей Садилов", "Студент МТУСИ, frontend-разработчик.", ["React", "TypeScript", "Python"]),
    ("mpetrova", "mpetrova@example.com", "Мария Петрова", "Backend-разработчик, люблю базы данных.", ["Python", "FastAPI", "PostgreSQL"]),
    ("ismirnov", "ismirnov@example.com", "Иван Смирнов", "Занимаюсь машинным обучением.", ["PyTorch", "OpenCV"]),
    ("okuznetsova", "okuznetsova@example.com", "Ольга Кузнецова", "Дизайнер интерфейсов и иллюстратор.", ["Figma", "Pixel art"]),
    ("dorlov", "dorlov@example.com", "Дмитрий Орлов", "Fullstack, делаю учебные платформы.", ["React", "Node.js", "SQL"]),
    ("admin", "admin@example.com", "Администратор", "Модерация тегов и проектов.", []),
]

PROJECTS = [
    {
        "owner": "asadilov",
        "title": "Расписание МТУСИ",
        "summary": "Мобильное приложение с расписанием занятий и уведомлениями о переносах.",
        "description": "Поиск по группе и преподавателю, push-уведомления об изменениях, офлайн-режим.",
        "status": ProjectStatus.recruiting,
        "tags": ["mobile", "fastapi", "python"],
        "roles": [
            ("Мобильный разработчик", "React Native или Flutter", True),
            ("UI/UX дизайнер", "Макеты основных экранов в Figma", True),
        ],
    },
    {
        "owner": "ismirnov",
        "title": "Распознавание рукописных конспектов",
        "summary": "ML-сервис, который превращает фото конспекта в структурированный текст.",
        "description": "Обучаем модель распознавания рукописного текста на русском языке и делаем веб-интерфейс.",
        "status": ProjectStatus.recruiting,
        "tags": ["ml", "python", "web"],
        "roles": [
            ("ML-инженер", "PyTorch, опыт с OCR приветствуется", True),
            ("Frontend-разработчик", "React + TypeScript", True),
        ],
    },
    {
        "owner": "okuznetsova",
        "title": "Пиксельный платформер",
        "summary": "Небольшая 2D-игра для участия в студенческом геймджеме.",
        "description": "Делаем платформер на Godot с ручной пиксельной графикой.",
        "status": ProjectStatus.in_progress,
        "tags": ["gamedev", "design"],
        "roles": [("Художник", "Пиксель-арт, анимация персонажей", True)],
    },
    {
        "owner": "mpetrova",
        "title": "Умная теплица",
        "summary": "IoT-система мониторинга влажности и температуры с веб-панелью.",
        "description": "Датчики на ESP32 отправляют данные на сервер, веб-панель показывает графики.",
        "status": ProjectStatus.idea,
        "tags": ["iot", "web"],
        "roles": [],
    },
    {
        "owner": "dorlov",
        "title": "Тренажёр по SQL",
        "summary": "Веб-платформа с интерактивными задачами по SQL для первокурсников.",
        "description": "Задачи с автоматической проверкой запросов и рейтингом участников.",
        "status": ProjectStatus.completed,
        "tags": ["education", "web", "react"],
        "roles": [("Frontend-разработчик", "React", True)],
    },
]

APPLICATIONS = [
    ("mpetrova", "Расписание МТУСИ", "Мобильный разработчик", "Писала на Flutter, могу взять мобильную часть.", None),
    ("okuznetsova", "Расписание МТУСИ", "UI/UX дизайнер", "Покажу портфолио мобильных приложений.", None),
    ("asadilov", "Распознавание рукописных конспектов", "Frontend-разработчик", "Готов делать интерфейс загрузки фото.", None),
    ("dorlov", "Пиксельный платформер", "Художник", "Немного рисую пиксель-арт.", ApplicationStatus.accepted),
    ("asadilov", "Тренажёр по SQL", "Frontend-разработчик", "Делал интерфейсы на React.", ApplicationStatus.accepted),
]


def make_user(username: str, email: str, full_name: str, bio: str, skills: list[str], password_hash: str) -> User:
    return User(
        username=username,
        email=email,
        full_name=full_name,
        bio=bio,
        skills=skills,
        password_hash=password_hash,
        is_admin=username == "admin",
    )


def run() -> None:
    with SessionLocal() as db:
        if db.scalar(select(User).limit(1)) is not None:
            print("База уже содержит данные, заполнение пропущено")
            return

        password_hash = hash_password(SEED_PASSWORD)
        by_name = {}
        for item in USERS:
            user = make_user(*item, password_hash=password_hash)
            db.add(user)
            by_name[user.username] = user
        db.commit()

        by_title = {}
        for item in PROJECTS:
            project = projects.create_project(
                db,
                ProjectCreate(
                    title=item["title"],
                    summary=item["summary"],
                    description=item["description"],
                    status=item["status"],
                    tags=item["tags"],
                    roles=[RoleCreate(title=t, description=d, is_open=o) for t, d, o in item["roles"]],
                ),
                by_name[item["owner"]],
            )
            by_title[project.title] = project

        for username, title, role_title, message, decision in APPLICATIONS:
            project = by_title[title]
            role = next(role for role in project.roles if role.title == role_title)
            application = applications.create_application(db, by_name[username], role.id, message)
            if decision is not None:
                applications.decide_application(db, application.id, decision, project.owner)

        print(f"Добавлено: пользователей {len(USERS)}, проектов {len(PROJECTS)}, заявок {len(APPLICATIONS)}")


if __name__ == "__main__":
    run()

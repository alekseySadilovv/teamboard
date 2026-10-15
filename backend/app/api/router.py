from fastapi import APIRouter

from app.api.routes import applications, projects, tags, users

api_router = APIRouter(prefix="/api")
api_router.include_router(users.router)
api_router.include_router(projects.router)
api_router.include_router(tags.router)
api_router.include_router(applications.router)

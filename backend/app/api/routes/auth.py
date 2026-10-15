from fastapi import APIRouter, Request, Response, status
from fastapi.responses import JSONResponse

from app.api.deps import DbSession
from app.core.config import settings
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services import auth as service
from app.services.auth import IssuedTokens

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_PATH = "/api/auth"


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.refresh_cookie_name,
        value=token,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        httponly=True,
        secure=settings.refresh_cookie_secure,
        samesite="lax",
        path=COOKIE_PATH,
    )


def _clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.refresh_cookie_name,
        httponly=True,
        secure=settings.refresh_cookie_secure,
        samesite="lax",
        path=COOKIE_PATH,
    )


def _token_response(response: Response, tokens: IssuedTokens) -> TokenResponse:
    _set_refresh_cookie(response, tokens.refresh_token)
    return TokenResponse(access_token=tokens.access_token, expires_in=tokens.expires_in, user=tokens.user)


def _user_agent(request: Request) -> str:
    return request.headers.get("user-agent", "")


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, request: Request, response: Response, db: DbSession):
    return _token_response(response, service.register(db, data, _user_agent(request)))


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, request: Request, response: Response, db: DbSession):
    return _token_response(response, service.login(db, data.email, data.password, _user_agent(request)))


@router.post("/refresh", response_model=TokenResponse)
def refresh(request: Request, response: Response, db: DbSession):
    token = request.cookies.get(settings.refresh_cookie_name)
    try:
        tokens = service.refresh(db, token, _user_agent(request))
    except service.AuthError as error:
        failed = JSONResponse(status_code=error.status_code, content={"detail": error.message})
        _clear_refresh_cookie(failed)
        return failed
    return _token_response(response, tokens)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, response: Response, db: DbSession):
    service.logout(db, request.cookies.get(settings.refresh_cookie_name))
    _clear_refresh_cookie(response)

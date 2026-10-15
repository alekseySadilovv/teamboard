from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from app.services.errors import ServiceError

_messages = {
    "missing": "Обязательное поле",
    "string_too_short": "Слишком короткое значение (минимум {min_length} симв.)",
    "string_too_long": "Слишком длинное значение (максимум {max_length} симв.)",
    "too_long": "Слишком много элементов (максимум {max_length})",
    "string_pattern_mismatch": "Недопустимые символы",
    "enum": "Допустимые значения: {expected}",
    "int_parsing": "Ожидается целое число",
    "bool_parsing": "Ожидается логическое значение",
    "json_invalid": "Некорректный JSON",
    "greater_than_equal": "Значение должно быть не меньше {ge}",
    "less_than_equal": "Значение должно быть не больше {le}",
    "string_type": "Ожидается строка",
    "list_type": "Ожидается список",
    "dict_type": "Некорректный формат данных",
    "model_attributes_type": "Некорректный формат данных",
}


def _format_error(error: dict) -> dict:
    location = [str(part) for part in error.get("loc", []) if part not in ("body", "query", "path")]
    template = _messages.get(error["type"])
    message = error["msg"]
    if template:
        try:
            message = template.format(**error.get("ctx", {}))
        except (KeyError, IndexError):
            message = template
    if error["type"] == "value_error":
        message = message.removeprefix("Value error, ")
        if "email" in message.lower():
            message = "Некорректный адрес электронной почты"
    return {"field": ".".join(location), "message": message}


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ServiceError)
    async def service_error_handler(_: Request, exc: ServiceError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(_: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            content={"detail": "Ошибка валидации данных", "errors": [_format_error(e) for e in exc.errors()]},
        )

    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(_: Request, __: IntegrityError):
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": "Операция нарушает целостность данных"},
        )

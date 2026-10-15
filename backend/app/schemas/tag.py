from typing import Annotated

from pydantic import BeforeValidator, StringConstraints

from app.schemas.common import CamelModel

TagName = Annotated[
    str,
    BeforeValidator(lambda value: value.strip().lstrip("#") if isinstance(value, str) else value),
    StringConstraints(strip_whitespace=True, to_lower=True, min_length=1, max_length=40, pattern=r"^[0-9a-zа-яё+#._-]+$"),
]


class TagCreate(CamelModel):
    name: TagName


class TagUpdate(TagCreate):
    pass


class TagRead(CamelModel):
    id: int
    name: str


class TagWithCount(TagRead):
    project_count: int

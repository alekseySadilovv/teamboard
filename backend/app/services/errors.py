class ServiceError(Exception):
    status_code = 400

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class NotFoundError(ServiceError):
    status_code = 404


class ConflictError(ServiceError):
    status_code = 409


class BusinessRuleError(ServiceError):
    status_code = 400


class PermissionDeniedError(ServiceError):
    status_code = 403

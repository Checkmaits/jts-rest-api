from mongoengine import ValidationError


def process_error(error):
    if isinstance(error, ValidationError):
        formatted_errors = {}
        for field, err in error.errors.items():
            formatted_errors[field] = err.message

        return {
            "status": 400,
            "title": "Validation error",
            "message": f"Please correct the following error(s): {formatted_errors}",
        }, 400
    else:
        raise Exception()  # Raise an internal server error for unexpected exceptions

from models.featured_category_model import FeaturedCategory
from bson.json_util import dumps
from utils.error_utils import process_error


def get_featured_categories():
    try:
        featured_categories = FeaturedCategory.objects.all()
        return (
            dumps(
                {
                    "message": f"{len(featured_categories)} FeaturedCategory entries retrieved successfully",
                    "data": [category.to_mongo() for category in featured_categories],
                }
            ),
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        return process_error(e)


def create_featured_category(data):
    try:
        featured_category = FeaturedCategory(**data)
        featured_category.save()
        return {
            "message": f"FeaturedCategory entry created successfully (ID: {featured_category.id})"
        }, 201
    except Exception as e:
        return process_error(e)


def edit_featured_category(category_id, data):
    try:
        featured_category = FeaturedCategory.objects.get(id=category_id)
        featured_category.update(**data)
        return {
            "message": f"FeaturedCategory entry updated successfully (ID: {category_id})"
        }, 200
    except FeaturedCategory.DoesNotExist:
        return {
            "status": 404,
            "title": "FeaturedCategory not found",
            "message": f"A FeaturedCategory entry with ID {category_id} does not exist. Please check the ID and try again.",
        }
    except Exception as e:
        return process_error(e)


def delete_featured_category(category_id):
    try:
        featured_category = FeaturedCategory.objects.get(id=category_id)
        featured_category.delete()
        return {
            "message": f"FeaturedCategory entry deleted successfully (ID: {category_id})"
        }, 200
    except FeaturedCategory.DoesNotExist:
        return {
            "status": 404,
            "title": "FeaturedCategory not found",
            "message": f"A FeaturedCategory entry with ID {category_id} does not exist. Please check the ID and try again.",
        }
    except Exception as e:
        return process_error(e)

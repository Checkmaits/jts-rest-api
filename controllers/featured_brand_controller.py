from models.featured_brand_model import FeaturedBrand
from bson.json_util import dumps
from utils.error_utils import process_error


def get_featured_brands():
    try:
        featured_brands = FeaturedBrand.objects.all()
        return (
            dumps(
                {
                    "message": f"{len(featured_brands)} FeaturedBrand entries retrieved successfully",
                    "data": [brand.to_mongo() for brand in featured_brands],
                }
            ),
            200,
            {"Content-Type": "application/json"},
        )
    except Exception as e:
        return process_error(e)


def create_featured_brand(data):
    try:
        featured_brand = FeaturedBrand(**data)
        featured_brand.save()
        return {
            "message": f"FeaturedBrand entry created successfully (ID: {featured_brand.id})"
        }, 201
    except Exception as e:
        return process_error(e)


def edit_featured_brand(brand_id, data):
    try:
        featured_brand = FeaturedBrand.objects.get(id=brand_id)
        featured_brand.update(**data)
        return {
            "message": f"FeaturedBrand entry updated successfully (ID: {brand_id})"
        }, 200
    except FeaturedBrand.DoesNotExist:
        return {
            "status": 404,
            "title": "FeaturedBrand not found",
            "message": f"A FeaturedBrand entry with ID {brand_id} does not exist. Please check the ID and try again.",
        }
    except Exception as e:
        return process_error(e)


def delete_featured_brand(brand_id):
    try:
        featured_brand = FeaturedBrand.objects.get(id=brand_id)
        featured_brand.delete()
        return {
            "message": f"FeaturedBrand entry deleted successfully (ID: {brand_id})"
        }, 200
    except FeaturedBrand.DoesNotExist:
        return {
            "status": 404,
            "title": "FeaturedBrand not found",
            "message": f"A FeaturedBrand entry with ID {brand_id} does not exist. Please check the ID and try again.",
        }
    except Exception as e:
        return process_error(e)

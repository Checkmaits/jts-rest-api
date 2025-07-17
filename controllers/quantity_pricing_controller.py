from os import getenv
from requests import get


def get_quantity_pricing(catalog_id):
    response = get(
        f"{getenv("SHIFT4SHOP_API_REQUEST_URL")}/Products/{catalog_id}/Discount",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "SecureURL": getenv("SHIFT4SHOP_API_SECURE_URL"),
            "PrivateKey": getenv("SHIFT4SHOP_API_PRIVATE_KEY"),
            "Token": getenv("SHIFT4SHOP_API_TOKEN"),
        },
    )

    if not response.ok:
        return {
            "status": response.status_code,
            "title": "Failed to fetch",
            "message": f"Failed to fetch quantity pricing for Catalog ID {catalog_id}: {response.status_code}",
        }

    return {
        "message": f"Quantity pricing retrieved successfully (ID: {catalog_id})",
        "data": response.json(),
    }

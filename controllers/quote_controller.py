from os import getenv


def get_shipping_quote(order_data: dict):
    items = order_data.get("items", [])
    if not items:
        return {
            "status": 400,
            "title": "Bad request",
            "message": "Missing required field(s): 'items'. Please check your request and try again.",
        }, 400

    is_sample_order = all(item.get("sku") == "SAMPLE-1" for item in items)
    if is_sample_order:
        return {
            "message": "Shipping quote(s) retrieved successfully.",
            "shippingmethods": [{"methodname": getenv(""), "rate": 0}],
        }, 200
    else:
        return {
            "message": "Shipping quote(s) retrieved successfully.",
            "shippingmethods": [],
        }, 200

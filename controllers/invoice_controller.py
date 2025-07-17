from flask import render_template, make_response
from requests import get
from os import getenv
from weasyprint import HTML
from tempfile import NamedTemporaryFile


def generate_invoice(order_id):
    response = get(
        f"{getenv("SHOPIFY_API_ADMIN_URL")}/admin/api/2025-07/orders/{order_id}.json",
        headers={
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": getenv("SHOPIFY_API_ADMIN_TOKEN"),
        },
    )

    if not response.ok:
        return {
            "status": response.status_code,
            "title": "Failed to fetch",
            "message": f"Failed to fetch order {order_id} from Shopify: {response.text}",
        }

    order = response.json().get("order")

    billing = {
        "name": order["customer"]["first_name"] + " " + order["customer"]["last_name"],
        "address": order["billing_address"]["address1"],
        "address2": order["billing_address"].get("address2", ""),
        "city": order["billing_address"]["city"],
        "province": order["billing_address"]["province_code"],
        "zip": order["billing_address"]["zip"],
        "email": order["customer"]["email"],
        "phone": order["billing_address"].get("phone", ""),
    }

    shipping = {
        "name": f"{order["shipping_address"]["first_name"]} {order["shipping_address"]["last_name"]}",
        "address": order["shipping_address"]["address1"],
        "address2": order["shipping_address"].get("address2", ""),
        "city": order["shipping_address"]["city"],
        "province": order["shipping_address"]["province_code"],
        "zip": order["shipping_address"]["zip"],
        "email": order["customer"]["email"],
        "phone": order["shipping_address"].get("phone", ""),
    }

    items = []
    for line_item in order["line_items"]:
        items.append(
            {
                "sku": line_item["sku"],
                "name": line_item["name"],
                "price": float(line_item["price"]),
                "qty": line_item["quantity"],
            }
        )

    invoice_data = {
        "invoice_number": order["name"],
        "invoice_date": order["created_at"].split("T")[0],
        "billing": billing,
        "shipping": shipping,
        "items": items,
        "subtotal": sum(item["price"] * item["qty"] for item in items),
        "tax_rate": "None",
        "tax_amount": 0,
        "total": sum(item["price"] * item["qty"] for item in items),
    }

    # Render the invoice template
    rendered_invoice = render_template("invoice_template.html", **invoice_data)

    with NamedTemporaryFile(suffix=".pdf", delete=False) as temp_file:
        HTML(string=rendered_invoice).write_pdf(temp_file.name)

        with open(temp_file.name, "rb") as pdf_file:
            response = make_response(pdf_file.read())
            response.headers["Content-Type"] = "application/pdf"
            response.headers["Content-Disposition"] = (
                f"attachment; filename=invoice_{order_id}.pdf"
            )
            return response

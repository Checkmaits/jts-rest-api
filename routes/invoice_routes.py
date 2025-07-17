from flask import Blueprint, request
import controllers.invoice_controller as controller

invoice_blueprint = Blueprint("invoice", __name__)


@invoice_blueprint.route("/", methods=["POST"])
def generate_invoice():
    order_id = request.args.get("id")
    if not order_id:
        return {
            "status": 400,
            "title": "Bad request",
            "message": "Missing Shopify order ID. Please check your request and try again.",
        }, 400

    return controller.generate_invoice(order_id)

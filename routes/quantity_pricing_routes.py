from flask import Blueprint
import controllers.quantity_pricing_controller as controller

quantity_pricing_blueprint = Blueprint("quantity-pricing", __name__)


@quantity_pricing_blueprint.route("/<catalog_id>", methods=["GET"])
def get_featured_brands(catalog_id):
    return controller.get_quantity_pricing(catalog_id)

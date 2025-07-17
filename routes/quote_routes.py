from flask import Blueprint, request
import controllers.quote_controller as controller

quote_blueprint = Blueprint("order", __name__)


@quote_blueprint.route("/", methods=["POST"])
def get_shipping_quote():
    return controller.get_shipping_quote(request.get_json())

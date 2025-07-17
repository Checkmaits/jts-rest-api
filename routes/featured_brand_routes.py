from flask import Blueprint
import controllers.featured_brand_controller as controller

featured_brand_blueprint = Blueprint("featured_brand", __name__)


@featured_brand_blueprint.route("/", methods=["GET"])
def get_featured_brands():
    return controller.get_featured_brands()


# @featured_brand_blueprint.route("/create", methods=["POST"])
# def create_featured_brand():
#     return controller.create_featured_brand(request.get_json())


# @featured_brand_blueprint.route("/edit/<brand_id>", methods=["PUT"])
# def edit_featured_brand(brand_id):
#     return controller.edit_featured_brand(brand_id, request.get_json())


# @featured_brand_blueprint.route("/delete/<brand_id>", methods=["DELETE"])
# def delete_featured_brand(brand_id):
#     return controller.delete_featured_brand(brand_id)

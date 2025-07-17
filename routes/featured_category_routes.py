from flask import Blueprint
import controllers.featured_category_controller as controller

featured_category_blueprint = Blueprint("featured_category", __name__)


@featured_category_blueprint.route("/", methods=["GET"])
def get_featured_categories():
    return controller.get_featured_categories()


# @featured_category_blueprint.route("/create", methods=["POST"])
# def create_featured_category():
#     return controller.create_featured_category(request.get_json())


# @featured_category_blueprint.route("/edit/<category_id>", methods=["PUT"])
# def edit_featured_category(category_id):
#     return controller.edit_featured_category(category_id, request.get_json())


# @featured_category_blueprint.route("/delete/<category_id>", methods=["DELETE"])
# def delete_featured_category(category_id):
#     return controller.delete_featured_category(category_id)

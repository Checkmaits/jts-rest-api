from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from routes.quote_routes import quote_blueprint
from routes.featured_brand_routes import featured_brand_blueprint
from routes.featured_category_routes import featured_category_blueprint
from routes.quantity_pricing_routes import quantity_pricing_blueprint
from routes.invoice_routes import invoice_blueprint

from os import getenv
from mongoengine import connect

load_dotenv()

app = Flask(__name__)

app.config["DEBUG"] = False
CORS(app)
Talisman(app, force_https=False)
limiter = Limiter(get_remote_address, app=app, default_limits=["150 per 15 minutes"])

app.register_blueprint(quote_blueprint, url_prefix="/api/v1/rates")
app.register_blueprint(featured_brand_blueprint, url_prefix="/api/v1/featured-brands")
app.register_blueprint(
    featured_category_blueprint, url_prefix="/api/v1/featured-categories"
)
app.register_blueprint(
    quantity_pricing_blueprint, url_prefix="/api/v1/quantity-pricing"
)
app.register_blueprint(invoice_blueprint, url_prefix="/api/v1/generate-invoice")


@app.errorhandler(404)
def not_found_error(e):
    return {
        "status": 404,
        "title": "Endpoint not found",
        "message": "The requested endpoint does not exist. Please check the URL and try again.",
    }, 404


@app.errorhandler(429)
def rate_limit_error(e):
    return {
        "status": 429,
        "title": "Rate limit exceeded",
        "message": "You have exceeded the allowed number of requests. Please try again later.",
    }, 429


@app.errorhandler(500)
def internal_server_error(e):
    return {
        "status": 500,
        "title": "Internal server error",
        "message": "An unexpected error occurred. Please try again later.",
    }, 500


if __name__ == "__main__":
    if connect(host=getenv("MONGODB_URI")):
        app.run()

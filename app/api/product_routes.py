from flask import Blueprint, request
from app.models import Product, db
from flask_login import current_user, login_required

product_routes = Blueprint('products', __name__)


#GET ALL PRODUCTS
@product_routes.route("/")
def all_products():
  products = Product.query.all()
  return {'products': [product.to_dict() for product in products]}


#GET ONE PRODUCT
@product_routes.route("/<int:id>")
def single_product(id):
  product = Product.query.get(id)
  if product:
    return product.to_dict()
  else:
    return {'errors': {'message': "Product Not Found"}}, 404


#CREATE NEW PRODUCT


#EDIT PRODUCT


#DELETE PRODUCT

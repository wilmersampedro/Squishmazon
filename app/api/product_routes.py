from flask import Blueprint, request
from app.models import Product, Review, db
from flask_login import current_user, login_required
from app.forms import ProductForm, ReviewForm

product_routes = Blueprint('products', __name__)


#GET ALL PRODUCTS that are in stock
@product_routes.route("/")
def all_products():
  products = Product.query.all()
  return {'products': [product.to_dict() for product in products]}


#GET PRODUCTS OF CURRENT USER
@product_routes.route("/current")
@login_required
def current_user_products():
  products = Product.query.filter(Product.vendor_id == current_user.id).all()
  # if products:
  return {'products': [product.to_dict() for product in products]}
  # else:
    # return {'message': 'Current user has no products'}

#GET ONE PRODUCT
@product_routes.route("/<int:id>")
def single_product(id):
  product = Product.query.get(id)
  if product:
    return product.to_dict()
  else:
    return {'errors': {'message': "Product Not Found"}}, 404


#CREATE NEW PRODUCT
@product_routes.route("/new", methods=["POST"])
@login_required
def create_product():
  form = ProductForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    new_product = Product(
      product_name = form.data["product_name"],
      description = form.data["description"],
      price = form.data["price"],
      vendor_id = current_user.id
    )

    db.session.add(new_product)
    db.session.commit()
    return new_product.to_dict(), 201
  else:
    return form.errors, 401


#EDIT PRODUCT
@product_routes.route("/<int:id>", methods=["PUT", "PATCH"])
@login_required
def modify_product(id):
  product = Product.query.get(id)
  if not product:
    return {"errors": {"message": "Product couldn't be found"}}, 404

  form = ProductForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    if current_user.id == product.vendor_id:
      submitted_data = request.json
      product.product_name = form.data["product_name"]
      product.description = form.data["description"]
      product.price = form.data["price"]
      if "in_stock" in submitted_data:
        product.in_stock = submitted_data["in_stock"]
      else:
        product.in_stock = product.in_stock

      db.session.commit()
      return product.to_dict()
    else:
      return {'errors': {'message': 'Unauthorized'}}, 401
  else:
    return form.errors, 401

#DELETE PRODUCT
@product_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_product(id):
  product = Product.query.get(id)
  if not product:
    return {"errors": {"message": "Product couldn't be found"}}, 404

  if current_user.id == product.vendor_id:
    db.session.delete(product)
    db.session.commit()
    return {"message": "Successfully deleted"}
  else:
    return {'errors': {'message': 'Unauthorized'}}, 401


#GET ALL REVIEWS FOR PRODUCT BY ID
@product_routes.route("/<int:id>/reviews")
def product_reviews(id):
  product = Product.query.get(id)
  if not product:
    return {"errors": {"message": "Product couldn't be found"}}, 404

  all_reviews = Review.query.filter(Review.product_id == id).all()
  return {"reviews": [review.to_dict() for review in all_reviews]}


#CREATE REVIEW FOR A PRODUCT BASED ON PRODUCT ID
@product_routes.route("/<int:id>/reviews", methods=["POST"])
@login_required
def create_review(id):
  product = Product.query.get(id)
  if not product:
    return {"errors": {"message": "Product couldn't be found"}}, 404

  if product.vendor_id == current_user.id:
    return {"errors": {"message": "User cannot review their own product"}}, 400

  potensh_reviews = Review.query.filter(Review.user_id == current_user.id).all()
  for rev in potensh_reviews:
    if rev.product_id == id:
      return {"errors": {"message": "User already has a review for this product"}}, 401
  # if potensh_review:
  #   return {"errors": {"message": "User already has a review for this product"}}, 401

  form = ReviewForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    new_review = Review(
      product_id = id,
      user_id = current_user.id,
      review_text = form.data["review_text"],
      stars = form.data["stars"]
    )

    db.session.add(new_review)
    db.session.commit()
    return new_review.to_dict(), 201
  else:
    return form.errors, 400

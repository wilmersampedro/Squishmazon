from flask import Blueprint, request
from app.models import Product, Review, ProductImage, CartItem, db
from flask_login import current_user, login_required
from app.forms import ProductForm, ReviewForm, ImageForm, CartItemForm
from app.api.aws import (
  upload_file_to_s3, get_unique_filename, remove_file_from_s3
)

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
    return form.errors, 400

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
    if(product.product_image[0]):
      [remove_file_from_s3(img.url) for img in product.product_image]
      # remove_file_from_s3(product.product_image[0].url)
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


#Upload image for product based on product id
@product_routes.route("/<int:id>/images", methods=["POST"])
@login_required
def upload_img(id):
  newly_created_prod = Product.query.get(id)
  print("DOES THIS EXIST?????", newly_created_prod.to_dict())
  print("IN THE BACKEND??????")
  form = ImageForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    print("VALID??????")
    image = form.data["image"]
    image.filename = get_unique_filename(image.filename)
    upload = upload_file_to_s3(image)
    print(upload)

    if "url" not in upload:
    # if the dictionary doesn't have a url key
    # it means that there was an error when we tried to upload
    # so we send back that error message (and we printed it above)
      print("URL NOT IN UPLOAD???????")
      return {"errors": upload}

    url = upload["url"]
    new_image = ProductImage(url = url, product_id = id)
    db.session.add(new_image)
    db.session.commit()
    return {"message": "Successfully uploaded image"}
  else:
    print("HITTING THE LAST ELSE??")
    print("FORM ERRORS IN BACKEND",form.errors)
    return form.errors, 400


@product_routes.route("/<int:id>/wishlists", methods=["POST"])
@login_required
def add_to_wishlist(id):
  """
  Creates a new wishlist item for user based on product id
  """
  product_to_add = Product.query.get(id)
  if not product_to_add:
    return {"errors": {"message": "Product couldn't be found"}}, 404

  ## Maybe comment out to add functionality where user cannot wishlist their own product :thinking:?
  if product_to_add.vendor_id == current_user.id:
    return {"errors": {"message": "User cannot wishlist their own product"}}, 400

  if product_to_add in current_user.wishlist:
    return {"errors": {"message": "User already added this product to their wishlist"}}, 401

  current_user.wishlist.append(product_to_add)
  db.session.commit()
  return product_to_add.to_dict(), 201


@product_routes.route("/<int:id>/wishlists", methods=["DELETE"])
@login_required
def delete_wishlist(id):
  """
  Delete wishlist item based on the product id
  """
  product = Product.query.get(id)
  if not product:
    return {"errors": {"message": "Product couldn't be found"}}, 404

  if product not in current_user.wishlist:
    return {"errors": {"message": "User does not have product in their wishlist"}}, 404

  current_user.wishlist.remove(product)
  db.session.commit()

  return {"message": "Successfully removed item from wishlist"}, 202


@product_routes.route("/<int:id>/cart", methods=["POST"])
@login_required
def add_item_to_cart(id):
  """
  CREATE: Adds an item to cart, if item already exists it will increase quantity by one
  """
  product = Product.query.get(id)
  if not product:
    return {"errors": {"message": "Product couldn't be found"}}, 404

  form = CartItemForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    for item in current_user.user_cart:
      if item.product_id == product.id:
        item.quantity = item.quantity + 1
        db.session.commit()
        return item.to_dict(), 200
      else:
        cart_item = CartItem(
          user_id = current_user.id,
          product_id = product.id,
          quantity = form.data["quantity"] if "quantity" in form.data else 1
        )
        db.session.add(cart_item)
        db.session.commit()
        return cart_item.to_dict(), 201
  else:
    return form.errors, 401

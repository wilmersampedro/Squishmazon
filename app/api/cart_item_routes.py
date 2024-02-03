from flask import Blueprint, request
from app.models import CartItem, db
from flask_login import current_user, login_required
from app.forms import CartItemForm

cart_item_routes = Blueprint('cart_items', __name__)


@cart_item_routes.route("/")
@login_required
def cart_items():
   """
   GET all cart items belonging to current user
   """
   cart_items =  CartItem.query.filter(CartItem.user_id == current_user.id).all()
   return {"cart": [item.to_dict() for item in cart_items]}


@cart_item_routes.route("/<int:id>", methods=["PUT", "PATCH"])
@login_required
def update_cart(id):
  cart_item = CartItem.query.get(id)
  if not cart_item:
    return {"errors": {"message": "Cart Item not found"}}

  form = CartItemForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    if cart_item.user_id == current_user.id:
      cart_item.quantity = form.data["quantity"]
      db.session.commit()
      return cart_item.to_dict(), 200
    else:
      return {'errors': {'message': 'Unauthorized'}}, 401
  else:
    return form.errors, 400


@cart_item_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def remove_cart_item(id):
  """
  Deletes an item from cart
  """
  cart_item = CartItem.query.get(id)
  if not cart_item:
    return {"errors": {"message": "Cart Item not found"}}

  if cart_item.user_id == current_user.id:
      print("*********", cart_item)
      db.session.delete(cart_item)
      db.session.commit()
      return {"message": "Successfully deleted"}
  else:
    return {'errors': {'message': 'Unauthorized'}}, 401

from flask import Blueprint, request
from app.models import CartItem, db
from flask_login import current_user, login_required
from app.forms import CartItemForm

cart_item_routes = Blueprint('cart_items', __name__)


@cart_item_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def remove_cart_item(id):
  cart_item = CartItem.query.get(id)
  if not cart_item:
    return {"errors": {"message": "Cart Item not found"}}

  if cart_item.user_id == current_user.id:
      db.session.remove(cart_item)
      db.session.commit()
      return {"message": "Successfully deleted"}
  else:
    return {'errors': {'message': 'Unauthorized'}}, 401

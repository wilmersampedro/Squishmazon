from flask import Blueprint, request
from flask_login import current_user, login_required


wishlist_routes = Blueprint('wishlists', __name__)


@wishlist_routes.route("/")
@login_required
def my_wishlist():
  """
  Get all items in wishlist belonging to current user
  """
  wishlist_items = current_user.wishlist
  return {"wishlist": [product.to_dict() for product in wishlist_items]}

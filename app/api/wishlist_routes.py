from flask import Blueprint, request
from app.models import Wishlist, Product, User, db
from flask_login import current_user, login_required
from app.forms import ProductForm, ReviewForm, ImageForm


wishlist_routes = Blueprint('wishlists', __name__)


@wishlist_routes.route("/")
@login_required
def my_wishlist():
  """
  Get all items in wishlist belonging to current user
  """
  wishlist_items = Wishlist.query.filter(Wishlist.user_id == current_user.id).all()
  return {"wishlist_items": [item.to_dict() for item in wishlist_items]}



@wishlist_routes.route("/<int:user_id>")
@login_required
def view_other_wishlist(user_id):
  """
  Get all items in wishlist belonging to a user by user id **** MIGHT IMPLEMENT LATER
  """
  pass


@wishlist_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_wishlist(id):
  """
  Delete wishlist item based on the id of the wishlist
  """
  wishlist = Wishlist.query.get(id)
  if not wishlist:
    return {"errors": {"message": "Wishlist couldn't be found"}}, 404

  if current_user.id == wishlist.user_id:
    db.session.delete(wishlist)
    db.session.commit()
    return {"message": "Successfully deleted"}
  else:
    return {'errors': {'message': 'Unauthorized'}}, 401

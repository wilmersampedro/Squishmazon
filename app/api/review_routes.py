from flask import Blueprint, request
from app.models import Review, db
from flask_login import current_user, login_required
from app.forms import ReviewForm

review_routes = Blueprint('reviews', __name__)


#EDIT A REVIEW
@review_routes.route("/<int:id>", methods=["PUT", "PATCH"])
@login_required
def edit_review(id):
  review = Review.query.get(id)
  if not review:
    return {"errors": {"message": "Review couldn't be found"}}, 404

  form = ReviewForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    if current_user.id == review.user_id:
      review.review_text = form.data["review_text"]
      review.stars = form.data["stars"]

      db.session.commit()
      return review.to_dict()
    else:
      return {'errors': {'message': 'Unauthorized'}}, 401
  else:
    return form.errors, 401


#DELETE A REVIEW
@review_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_review(id):
  review = Review.query.get(id)
  if not review:
    return {"errors": {"message": "Review couldn't be found"}}, 404

  if current_user.id == review.user_id:
    db.session.delete(review)
    db.session.commit()
    return {"message": "Successfully deleted"}
  else:
    return {'errors': {'message': 'Unauthorized'}}, 401

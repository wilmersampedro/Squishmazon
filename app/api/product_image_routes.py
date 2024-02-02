from flask import Blueprint, request
from app.models import ProductImage, db
from flask_login import current_user, login_required
# from app.forms import ProductForm, ReviewForm, ImageForm
from app.api.aws import remove_file_from_s3

product_image_routes = Blueprint('product_images', __name__)


@product_image_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_product_image(id):
  img = ProductImage.query.get(id)
  if not img:
    return {'errors': {'message': "Image Not Found"}}, 404

  if current_user.id == img.image_product.vendor_id:
    remove_file_from_s3(img.url)
    db.session.delete(img)
    db.session.commit()
    return {"message": "Successfully deleted"}
  else:
    return {'errors': {'message': 'Unauthorized'}}, 401

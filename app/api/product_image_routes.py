from flask import Blueprint, request
from app.models import ProductImage, db
from flask_login import current_user, login_required
from app.forms import ImageForm
from app.api.aws import (
  upload_file_to_s3, get_unique_filename, remove_file_from_s3
)


product_image_routes = Blueprint('product_images', __name__)


@product_image_routes.route("/<int:id>", methods=["PUT", "PATCH"])
@login_required
def update_image(id):
  img = ProductImage.query.get(id)
  if not img:
    return {'errors': {'message': "Image Not Found"}}, 404
  form = ImageForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    if current_user.id == img.image_product.vendor_id:
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
      remove_file_from_s3(img.url)
      url = upload["url"]
      img.url = url
      # new_image = ProductImage(url = url, product_id = img.image_product.id)
      # db.session.add(new_image)
      db.session.commit()
      return img.to_dict()
  else:
    print("*************", form.errors)
    return form.errors, 400

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

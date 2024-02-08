from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .product import Product

class ProductImage(db.Model):
  __tablename__ = 'product_images'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  url = db.Column(db.String, nullable=False)
  #preview_img boolean attribute 
  product_id = db.Column(db.Integer, db.ForeignKey(Product.id), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  image_product = db.relationship('Product', back_populates='product_image')

  def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'product_id': self.product_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

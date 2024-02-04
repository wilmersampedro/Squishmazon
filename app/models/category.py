from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .product import Product

class Category(db.Model):
  __tablename__ = 'categories'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  category_name = db.Column(db.String(128), nullable=False)
  product_id = db.Column(db.Integer, db.ForeignKey(Product.id), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  category_product = db.relationship('Product', back_populates='product_category')

  def to_dict(self):
        return {
            'id': self.id,
            'category_name': self.category_name,
            'product_id': self.product_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

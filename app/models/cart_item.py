from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .product import Product
from .user import User

class CartItem(db.Model):
  __tablename__ = 'cart_items'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
  product_id = db.Column(db.Integer, db.ForeignKey(Product.id), nullable=False)
  quantity = db.Column(db.Integer, default=1, nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  cart_owner = db.relationship('User', back_populates='user_cart')
  cart_product = db.relationship('Product', back_populates='product_cart')

  def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

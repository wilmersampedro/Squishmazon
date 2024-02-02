from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .user import User
from .product import Product

class Wishlist(db.Model):
  __tablename__ = 'wishlists'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  product_id = db.Column(db.Integer, db.ForeignKey(Product.id), nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  wishlist_owner = db.relationship('User', back_populates='wishlist')

  def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

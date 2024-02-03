from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .user import User
from .product import Product

class Wishlist(db.Model):
  __tablename__ = "wishlists"

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  product_id = db.Column(db.Integer, db.ForeignKey(Product.id), primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey(User.id), primary_key=True)



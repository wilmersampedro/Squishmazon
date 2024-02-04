from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .order import Order
from .product import Product

class OrderItem(db.Model):
  __tablename__ = 'order_items'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  product_id = db.Column(db.Integer, db.ForeignKey(Product.id), nullable=False)
  order_id = db.Column(db.Integer, db.ForeignKey(Order.id), nullable=False)
  quantity = db.Column(db.Integer, default=1, nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  item_order = db.relationship('Order', back_populates='order_item')
  item_product = db.relationship('Product', back_populates='product_order_item')

  def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'order_id': self.order_id,
            'quantity': self.quantity,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

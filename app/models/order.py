from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .user import User

class Order(db.Model):
  __tablename__ = 'orders'

  if environment == "production":
        __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
  total_price = db.Column(db.Float, nullable=False)
  created_at = db.Column(db.DateTime, default=datetime.now)
  updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

  order_owner = db.relationship('User', back_populates='user_order')
  order_item = db.relationship('OrderItem', back_populates='item_order', cascade='all, delete-orphan')

  def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_price': self.total_price,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

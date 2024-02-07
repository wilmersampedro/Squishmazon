from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .user import User


class Product(db.Model):
    __tablename__ = "products"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(350), nullable=False)
    price = db.Column(db.Float, nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    in_stock = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    vendor = db.relationship("User", back_populates="product")
    product_review = db.relationship(
        "Review", back_populates="review_product", cascade="all, delete-orphan"
    )
    product_image = db.relationship(
        "ProductImage", back_populates="image_product", cascade="all, delete-orphan"
    )
    product_wishlist = db.relationship(
        "User", secondary=add_prefix_for_prod("wishlists"), back_populates="wishlist"
    )
    product_category = db.relationship(
        "Category", back_populates="category_product", cascade="all, delete-orphan"
    )
    product_cart = db.relationship(
        "CartItem", back_populates="cart_product", cascade="all, delete-orphan"
    )
    product_order_item = db.relationship(
        "OrderItem", back_populates="item_product", cascade="all, delete-orphan"
    )

    def avg_rev(self):
        sum = 0
        for rev in self.product_review:
            sum += rev.stars
        if sum == 0:
            return 0
        return sum / len(self.product_review)

    def to_dict(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "description": self.description,
            "price": self.price,
            "vendor_id": self.vendor_id,
            "in_stock": self.in_stock,
            "product_images": [img.to_dict() for img in self.product_image],
            "avg_reviews": self.avg_rev(),
            "num_reviews": len(self.product_review),
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

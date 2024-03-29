from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, BooleanField
from wtforms.validators import DataRequired, Length, NumberRange, Optional


class ProductForm(FlaskForm):
  product_name = StringField("Product Name", validators=[DataRequired(), Length(max=128, message="Product name must be less than 128 characters")])
  description = StringField("Product Description", validators=[DataRequired(), Length(max=350, message="Product description must be less than 300 characters")])
  price = DecimalField("Price", places=2, number_format=4.90, validators=[DataRequired(), NumberRange(min=0.99, message="Price must be at least 1 dollar")])
  in_stock = BooleanField("In stock", validators=[Optional()])

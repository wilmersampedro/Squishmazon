from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import NumberRange

class CartItemForm(FlaskForm):
  quantity = IntegerField("quantity", validators=[NumberRange(min=1)])

from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length, NumberRange


class ReviewForm(FlaskForm):
  review_text = StringField("Review content", validators=[DataRequired(), Length(max=350, message="Length of the review must be less than 350 characters")])
  stars = IntegerField("stars", validators=[DataRequired(), NumberRange(min=1, max=5, message="rating must be between 1-5")])

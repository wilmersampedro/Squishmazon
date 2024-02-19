from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError, Regexp, Length
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    first_name = StringField(
        'username', validators=[DataRequired(), Regexp(r"^[\w\-\.]{1,}$", message="First Name contains invalid characters"), Length(min=2, max=40, message="First name must be between 2 and 40 characters")])
    last_name = StringField(
        'username', validators=[DataRequired(), Regexp(r"^[\w\-\.]{1,}$", message="Last Name contains invalid characters"), Length(min=2, max=40, message="Last name must be between 2 and 40 characters")])
    email = StringField('email', validators=[DataRequired(), Regexp(r"[\w|\.|-]{1,}@\w{1,}\.\w{2,}(\.\w{2,})?", message="Please enter a valid email."), Length(max=320, message="Email is invalid"), user_exists])
    address = StringField('address', validators=[DataRequired(), Length(min=7, max=50, message="Address must have a character length between 7-50")])
    password = StringField('password', validators=[DataRequired(), Length(min=8, max=64, message="Password must be between 8 and 64 characters")])

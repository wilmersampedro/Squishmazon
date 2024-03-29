from app.models import db, ProductImage, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_product_images():
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/xam.webp",
        product_id = 1
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/molinda.webp",
        product_id = 2
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/tansy.webp",
        product_id = 3
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/fessh.webp",
        product_id = 4
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/sunglasses.webp",
        product_id = 5
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/astr.webp",
        product_id = 6
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/eb59f015a4f84c8e9ce0bdb788ca26de.webp",
        product_id = 7
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/iguana.webp",
        product_id = 8
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/bluewhale.webp",
        product_id = 9
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/bear.webp",
        product_id = 10
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/bterfly.webp",
        product_id = 11
    ))
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/catstr.webp",
        product_id = 12
    ))
    # db.session.add(ProductImage(
    #     product_id = 2,
    #     user_id = 1,
    #     review_text = "I recently bought this adorable plushie, and I am absolutely in love with it! The quality is top-notch, and the material is super soft and cuddly. It's become my new favorite snuggle buddy, and I can't get enough of its cuteness! Highly recommend it for all the plushie lovers out there!",
    #     stars = 5
    # ))
    # db.session.add(ProductImage(
    #     product_id = 3,
    #     user_id = 2,
    #     review_text = "OMG, you won't believe how amazing this is! It exceeded all my expectations. The design is so detailed, and the colors are vibrant and eye-catching. It's incredibly huggable, and the stuffing is just perfect. It brings a smile to my face every time I see it. It's definitely worth every penny!",
    #     stars = 5
    # ))
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_product_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.product_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM product_images"))

    db.session.commit()

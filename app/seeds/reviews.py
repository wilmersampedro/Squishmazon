from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_reviews():
    db.session.add(Review(
        product_id = 1,
        user_id = 3,
        review_text = "This is one of the best products I've ever purchased, I can't believe how amazing this is! Only complaint I have is that some of the fur has a weird texture, but I still love the little guy!",
        stars = 4
    ))
    db.session.add(Review(
        product_id = 2,
        user_id = 1,
        review_text = "I recently bought this adorable plushie, and I am absolutely in love with it! The quality is top-notch, and the material is super soft and cuddly. It's become my new favorite snuggle buddy, and I can't get enough of its cuteness! Highly recommend it for all the plushie lovers out there!",
        stars = 5
    ))
    db.session.add(Review(
        product_id = 3,
        user_id = 2,
        review_text = "OMG, you won't believe how amazing this is! It exceeded all my expectations. The design is so detailed, and the colors are vibrant and eye-catching. It's incredibly huggable, and the stuffing is just perfect. It brings a smile to my face every time I see it. It's definitely worth every penny!",
        stars = 5
    ))
    ##NEW
    db.session.add(Review(
        product_id = 4,
        user_id = 3,
        review_text = "OMG, this plushie is absolutely adorable! The quality is top-notch, and it's so soft and cuddly. Love it!!",
        stars = 5
    ))
    db.session.add(Review(
        product_id = 5,
        user_id = 1,
        review_text = "I'm in love with this plushie! This plushie exceeded my expectations. It's super fluffy and well-made. Perfect for snuggling! It's even cuter in person, and the colors are so vibrant. Definitely worth it!",
        stars = 5
    ))
    db.session.add(Review(
        product_id = 6,
        user_id = 2,
        review_text = "This squishmallow is a total mood lifter! It brings a smile to my face every time I see it. I can't stop hugging it! It's the perfect size, and the material is so plush and cozy.",
        stars = 5
    ))
    db.session.add(Review(
        product_id = 7,
        user_id = 2,
        review_text = "The plushie I received looked nothing like the picture online. The colors were faded and dull.",
        stars = 2
    ))
    db.session.add(Review(
        product_id = 8,
        user_id = 3,
        review_text = "I expected better quality for the price. The material felt cheap and the stuffing was lumpy.",
        stars = 1
    ))
    db.session.add(Review(
        product_id = 9,
        user_id = 1,
        review_text = "The plushie arrived with a weird smell that just wouldn't go away, even after washing it. Super disappointed because I loved the design, but hate the smell!!",
        stars = 1
    ))
    db.session.add(Review(
        product_id = 10,
        user_id = 3,
        review_text = "It's a nice plushie overall, with soft fabric and a decent size. Nothing extraordinary, but still enjoyable.",
        stars = 4
    ))
    db.session.add(Review(
        product_id = 11,
        user_id = 1,
        review_text = "The plushie is cute and cuddly, but the stitching could be stronger for long-term durability.",
        stars = 3
    ))
    db.session.add(Review(
        product_id = 12,
        user_id = 2,
        review_text = "It's a typical plushie, nothing particularly special. The material is soft, but not the softest out there.",
        stars = 3
    ))
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()

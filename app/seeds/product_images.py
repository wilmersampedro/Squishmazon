from app.models import db, ProductImage, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_product_images():
    db.session.add(ProductImage(
        url = "https://wsampaaprojectsbucket.s3.us-west-1.amazonaws.com/xam.webp?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFgaCXVzLXdlc3QtMSJGMEQCICHXOxe6dFcqwJJ9%2F6D7RsqSDoI781jP1L2RyD7wOHN8AiBjtwN4N0jFBpINwWnk%2Fszht8Fpd%2FR3wiGjTCO4H0LobSrkAgghEAAaDDU5MDE4Mzc2OTQ3NyIMXdjxmGJTTSzLWDQDKsECnXVq2YL6eL5cGDkgcc7%2F8zNRg6dc%2FLt1T3F8dDLo%2FLYnphL7aMuyYwnbMGdt2OQeWsh4M%2BsUIL%2FJ%2FGr08i2LneDZnglxMgT8KdEqqdnWIFxArgJUF76jVXR3OlypiQG%2Bjub6APEeuW7qwwE15SDG4c96Hai00JIUUfglXgqGGBFsOBUzgNe5qwoUnR%2FSQS0Li9wlEmwqoXqosNl6%2BkgxMS5L630WvtL9r6mmgy2PMH99CjhCRwYoDKIStoM5hDJPXruAn4XaIMdNGvIJb%2F4kuTqaFc2BmL11mM8s3xVp3bN8jElN%2BY9wzbWOP9un4RqNFo49FaHbffk7sypC%2BBRK%2Fzm1Y6QxzBql15rfeFDMaZ6ZdTh2WlCsMaZBHNbjuehAGUS8wWscLbRP65ZgHYvAHkMZkTlcZJO6PgdZsCMo6RLAMM%2Bb5q0GOrQCxx99qQvA8J%2BlzKTTDjmJk3a47PRtJtinfcBuizLcJnZf3PHa5C%2FWYd4HgpVL5rROuiJP4ohDC2lAygsZWAeW8rJgbytNE0WjQuTF%2F9hx%2FBIOCa2Pf0%2BW%2BU%2FHCZmcdYSW9rlrBgLgWATDu%2BtMkBc7S3dJO7q7VDsfJ9HI5qbfwYawiaH8nwpfX%2B51%2F28XBubXS9uVFDTUD5Qr1wfpWoosGA0%2BzXN0xhzouFG9QvvDygUg%2FfXRjKfM0huPpdbWHtctOKvTfw%2F4tDwntkrkk47ILQf551hYGsWEvuAARZodWMbGmFDloFrVC%2B9vlQA70IhnTgVc%2B%2Bj6sYZY7S68LmNDbg4XzDjP2KoalWJH97S7InNLTMGTB2nGHySgPnG1MWxrjnsYCLUoFwDkkG%2FmAYbBl3qScuw%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240131T010527Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAYS2NRUWCTI3CCDOT%2F20240131%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=f5621ac926a2e00fd79c99b23779602f73cfd3c8b663d3553aef32690f219ad4",
        product_id = 1
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

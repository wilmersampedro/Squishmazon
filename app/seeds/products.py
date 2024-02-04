from app.models import db, Product, environment, SCHEMA
from sqlalchemy.sql import text


def seed_products():
    xam = Product(product_name='Xam', description="Welcome to Xam's nature center! Let this gentle 'Mallow teach you all about caring for the local ecosystem, while you also make new friends from the community. Xam tends to his melon vines the most, and loves to have dishes of fresh sliced muskmelon out for visitors.", price=15.99, vendor_id=1)

    molinda = Product(product_name='Molinda', description="Molinda's favorite way to start the day is high in the sky—she flies a hot air balloon! She gets up bright and early because she loves having a bird's eye view of the sunrise. Molinda always packs a basket of breakfast and coffee and she's got room for one more, so hop in!", price=15.99, vendor_id=2)

    tansy = Product(product_name='Tansy', description="Tansy is a Brown and Cream Sugar Glider with Mustache. He visits every art gallery in his city — even the artists know him by name! This 'Mallow counts down the days to new exhibits, and the multimedia installations are his favorite! Will you join Tansy for a gallery tour?", price=15.99, vendor_id=3)


    db.session.add(xam)
    db.session.add(molinda)
    db.session.add(tansy)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))

    db.session.commit()

from app.models import db, Product, environment, SCHEMA
from sqlalchemy.sql import text


def seed_products():
    xam = Product(product_name='Xam', description="Welcome to Xam's nature center! Let this gentle 'Mallow teach you all about caring for the local ecosystem, while you also make new friends from the community. Xam tends to his melon vines the most, and loves to have dishes of fresh sliced muskmelon out for visitors.", price=15.99, vendor_id=1)

    molinda = Product(product_name='Molinda', description="Molinda's favorite way to start the day is high in the sky—she flies a hot air balloon! She gets up bright and early because she loves having a bird's eye view of the sunrise. Molinda always packs a basket of breakfast and coffee and she's got room for one more, so hop in!", price=15.99, vendor_id=2)

    tansy = Product(product_name='Tansy', description="Tansy is a Brown and Cream Sugar Glider with Mustache. He visits every art gallery in his city — even the artists know him by name! This 'Mallow counts down the days to new exhibits, and the multimedia installations are his favorite! Will you join Tansy for a gallery tour?", price=15.99, vendor_id=3)

    db.session.add(xam)
    db.session.add(molinda)
    db.session.add(tansy)

    db.session.add(Product(
        product_name= 'Refalo',
        description= "Refalo forgets how he started restoring vintage lunch boxes, he just knows he hasn't stopped working on them for decades! There's a whole community of collectors who need help refreshing chipped paint or rusty handles. Refalo owns a few vintage lunch boxes himself, but he prefers repairing them for others.",
        price= 24.99,
        vendor_id= 1
    ))
    db.session.add(Product(
        product_name= "Lamont",
        description= "This well-traveled 'Mallow has a unique perspective on the world and a wonderful sense of humor. He brightens up any conversation with laughter and stories from his travels. Lamont seems to have been everywhere and knows just about everyone! Lamont would love to meet you next!",
        price= 19.99,
        vendor_id= 2
    ))
    db.session.add(Product(
        product_name= "Adventurous Astronaut",
        description= "Ready for cosmic explorations, Adventurous Astronaut ignites the spirit of curiosity and discovery. Embark on thrilling adventures with this space-faring Squishmallow by your side.",
        price= 24.99,
        vendor_id= 3
    ))
    db.session.add(Product(
        product_name= "Boden",
        description= "Boden enjoys spending his vacation camping next to his favorite lake. He brings an inner tube out to the water and floats in the waves all day. Once he accidentally popped a tube with his horns, but thankfully Boden is an excellent swimmer. Want to join Boden on a relaxing lake float?",
        price= 24.99,
        vendor_id= 1
    ))
    db.session.add(Product(
        product_name= "Intuitive Iguana",
        description= "Always one step ahead, Intuitive Iguana is the master of intuition and self-awareness. A source of calm reassurance, this Squishmallow will be your trusty guide through life's twists and turns.",
        price= 15.99,
        vendor_id= 2
    ))
    db.session.add(Product(
        product_name= "Samir",
        description= "Who's that 'Mallow leading the pack? It's Samir! This wonderful whale never planned on being in charge but his kindness and consideration have helped him become an excellent leader. If you need some advice on making the best choice, give Samir a call!",
        price= 12.99,
        vendor_id= 3
    ))
    db.session.add(Product(
        product_name= "Quito",
        description= "Quito wants to take a photo with you! He’s traveling the world snapping selfies with every friend he makes. Quito used to be less sociable, but being behind the camera has made him want to jump in front of the camera! Do you sometimes feel like a shy quokka too?",
        price= 19.99,
        vendor_id= 1
    ))
    db.session.add(Product(
        product_name= "Queen Bee",
        description= "Get ready to snuggle with the Squishmallows Queen Bee plush! This ultra-collectible, ultra-squeezable Adopt Me! plush is made with soft, high-quality materials. Add this detailed Queen Bee plush with adorable sparkly gold wings and stripes to your Squishmallows Squad.",
        price= 19.99,
        vendor_id= 2
    ))
    db.session.add(Product(
        product_name= "Runi",
        description= "She loves outer space, astronomy, and baking! One day Runi will fly to the moon, but for now, she is combining her passions by baking outer space-themed desserts! She has many amazing desserts, but everyone knows her Moon Pies are truly out of this world!",
        price= 19.99,
        vendor_id= 3
    ))

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

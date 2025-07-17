from mongoengine import Document, StringField


class FeaturedCategory(Document):
    meta = {
        "collection": "featuredcategories",
        "strict": False,
    }

    description = StringField(
        required=True,
        min_length=3,
        max_length=255,
    )
    img_src = StringField(
        db_field="imgSrc",
        required=True,
    )
    link = StringField(required=True)

from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from my_little_api import db


engine = create_engine('mysql://hk_blog:c3r1s3@localhost/blog', echo=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()


# Class Articles
class Article(Base):
    __tablename__ = 'Articles'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    date = db.Column(db.DateTime)
    content = db.Column(db.Text)
    latitude = db.Column(db.String(20))
    longitude = db.Column(db.String(20))

    def __init__(self, order=None, content=None):
        self.order = order
        self.content = content

    def __repr__(self):
        js = '{"id":%s, "title":"%s", "year":"%s", "month":"%s", "day":"%s", "content":"%s", "lat":"%s", "long":"%s"}'
        return js % (self.id, self.title, self.date.strftime('%d'), self.date.strftime('%m'), self.date.strftime('%Y'), self.content, self.latitude, self.longitude)


# Class Pictures
class Picture(Base):
    __tablename__ = 'Pictures'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    article_id = Column(Integer, ForeignKey('Articles.id'))
    title = db.Column(db.String(100))

    def __init__(self, order=None, content=None):
        self.order = order
        self.content = content

    def __repr__(self):
        js = '{"id":%s, "title":"%s"}' 
        return js % (self.id, self.title)

# Create tables.
Base.metadata.create_all(bind=engine)

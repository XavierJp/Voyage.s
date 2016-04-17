from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from my_little_api import db


engine = create_engine('mysql://xavier@localhost/Blog', echo=True)
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

    def __init__(self, order=None, content=None):
        self.order = order
        self.content = content

    def __repr__(self):
        js = '{"id":%s, "title":"%s", "date":"%s", "content":"%s"}'
        return js % (self.id, self.title, self.date, self.content)


# Class Pictures
class Picture(Base):
    __tablename__ = 'Pictures'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    article_id = Column(Integer, ForeignKey('Articles.id'))
    title = db.Column(db.String(100))
    description = db.Column(db.String(100))

    def __init__(self, order=None, content=None):
        self.order = order
        self.content = content

    def __repr__(self):
        js = '{"id":%s, "title":"%s", "description":"%s"}'
        return js % (self.id, self.title, self.description)

# Create tables.
Base.metadata.create_all(bind=engine)

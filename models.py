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
    content = db.Column(db.String(100))
    title = db.Column(db.String(100))
    date = db.Column(db.DateTime)
    children_id = Column(Integer, ForeignKey('Articles.id'))

    def __init__(self, order=None, content=None):
        self.order = order
        self.content = content

    def __repr__(self):
        js = '{"id":%s, "title":"%s", "content":"%s", "date":"%s"}'
        return js % (self.id, self.title, self.content, self.date)

# Create tables.
Base.metadata.create_all(bind=engine)

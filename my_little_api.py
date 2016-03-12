#!flask/bin/python

# imports
import json
from flask import Flask, abort, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask import make_response, jsonify
from models import *

# conf and app creation
app = Flask(__name__)
db = SQLAlchemy(app)

# root
@app.route("/", methods=["GET"])
def index():
    return render_template('index.html')


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route('/articles/', methods=['GET'])
def get_all_articles():
    query = str(db_session.query(Article).all())
    task = eval(query)
    if len(task) == 0:
        abort(404)
    return jsonify({'article': task})


@app.route('/articles/<int:art_id>', methods=['GET'])
def get_article(art_id):
    query = str(db_session.query(Article).filter(Article.id == art_id).all())
    task = eval(query)
    if len(task) == 0:
        abort(404)
    return jsonify({'article': task})


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == '__main__':
    app.run(debug=True)

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


@app.route('/article/<int:art_id>', methods=['GET'])
def get_article(art_id):
    q_art = eval(str(Article.query.get(art_id)))
    q_str = eval(str(Picture.query.filter(Picture.article_id == art_id).all()))
    q_art['pictures'] = q_str

    if len(q_art) == 0:
        abort(404)
    return jsonify(q_art)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=8080)

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

featCollec = '{"type":"GeometryCollection","geometries":[]}'

feat = '{ "type":"Point","properties":{"name":"%s", "id":%s}, "coordinates":[%s,%s]}'

# map
@app.route("/map/articles", methods=["GET"])
def get_geo_articles():
    q_art = eval(str(Article.query.all()))
    geo_art_coll =eval(featCollec)
    for art in q_art:
	feat_obj=eval(feat % (art["title"], art["id"], art["lat"], art["long"]))
        geo_art_coll["geometries"].append(feat_obj)
    return jsonify(geo_art_coll)

@app.route("/", methods=["GET"])
def map():
    q_art = eval(str(Article.query.all()))
    return render_template('map.html')


# root
@app.route("/<int:art_id>", methods=["GET"])
def index(art_id):
	art = {'id':str(art_id)}
	return render_template('index.html', article= art)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route('/article/<int:art_id>', methods=['GET'])
def get_article(art_id):

    q_art = eval(str(Article.query.get(art_id)))
    if not q_art or len(q_art) ==0:
        abort(404)
    
    q_str = eval(str(Picture.query.filter(Picture.article_id == art_id).all()))
    q_art['pictures'] = q_str
    return jsonify(q_art)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=80)

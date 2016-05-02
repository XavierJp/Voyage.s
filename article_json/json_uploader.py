#!/usr/bin/python

import MySQLdb
import sys
import json
import os
import shutil

# Open database connection
db = MySQLdb.connect("localhost", "hk_blog", "c3r1s3", "blog")

with open(sys.argv[1]+'.json') as data_file:
    data = json.load(data_file)
    sql = "INSERT INTO blog.Articles SET "
    for pos, k in enumerate(data.keys()):
        sql += k+"='"+data[k]+"'," if pos < len(data.keys()) else "';"


# prepare a cursor object using cursor() method
cursor = db.cursor()

# execute SQL query using execute() method.
cursor.execute(sql)

cursor.execute("SELECT id from blog.articles WHERE title ="+data["title"])

art_id = cursor.fetchall()

print(art_id)

# load new pics
new_pics_dir = "../new_pics/"
for el in os.listdir(new_pics_dir):
    sql_pics = "INSERT INTO blog.Pictures SET article_id = "+art_id+", title='" + el+"'"
    cursor.execute(sql_pics)
    shutil.move(new_pics_dir, target_pics_dir)
    print("save picture :" + el)


target_pics_dir = "../static/resources/pictures/"
# send emails
# disconnect from server
db.close()

#!/usr/bin/python

import MySQLdb
import sys
import json
import os
import shutil


def db_query(sql, db, cursor, r_w):
	print(" *** Execute SQL *** : "+sql)
	cursor.execute(sql)
	if r_w:
		db.commit()



# Open database connection
db = MySQLdb.connect("localhost", "hk_blog", "c3r1s3", "blog")
article_title = ""

with open(sys.argv[1]+'.json') as data_file:
    	data = json.load(data_file)	
    	article_title = data["title"]
    	sql = "INSERT INTO blog.Articles SET "
   	for pos, k in enumerate(data.keys()):
        	sql += k+"='"+data[k]
		sql += "'," if pos < len(data.keys())-1 else "';"


# prepare a cursor object using cursor() method
cursor = db.cursor()

# execute SQL query using execute() method.
db_query(sql, db, cursor, True)
	
sql_get_id = "SELECT id from blog.Articles WHERE title ='"+article_title+"'"
db_query(sql_get_id, db, cursor, True)

art_id = cursor.fetchone()[0]

print("*** Uploading pictures with article_id : "+str(art_id))

# load new pics
new_pics_dir = "../new_pics/"
target_pics_dir = "../static/resources/pictures/"+str(art_id)

os.makedirs(target_pics_dir)

for el in os.listdir(new_pics_dir):
    	sql_pics = "INSERT INTO blog.Pictures SET article_id = "+str(art_id)+", title='" + el+"'"
    	db_query(sql_pics, db, cursor, True)
	shutil.move(new_pics_dir+el, target_pics_dir)
    	print("*** Save picture :" + el)


# send emails
# disconnect from server
	db.close()


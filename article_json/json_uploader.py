#!/usr/bin/python

import MySQLdb
import sys
import json
import os
import shutil


def db_query(sql, db, r_w):
        # prepare a cursor object using cursor() method
        cursor = db.cursor()
	print("*** Execute SQL *** : "+sql)
	cursor.execute(sql)
	if not r_w:
          	a = cursor.fetchone()[0]
        cursor.close()
	if r_w:
		db.commit()
		return 0
	else:
		return a


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



# execute SQL query using execute() method.
db_query(sql, db, True)
	
sql_get_id = "SELECT id from blog.Articles WHERE title ='"+article_title+"'"
art_id = db_query(sql_get_id, db, False)

print("*** Uploading pictures with article_id : "+str(art_id))

# load new pics
new_pics_dir = "../new_pics/"
target_pics_dir = "../static/resources/pictures/"+str(art_id)

os.makedirs(target_pics_dir)

for el in os.listdir(new_pics_dir):
    	sql_pics = "INSERT INTO blog.Pictures (article_id, title) VALUES ("+str(art_id)+",'" + el+"')"
    	db_query(sql_pics, db, True)
    	print("*** Save picture :" + el)
	shutil.move(new_pics_dir+el, target_pics_dir)


# send emails
# disconnect from 
db.close()


#!/usr/bin/python

import MySQLdb

sql = "INSERT INTO blog.Articles SET title='vietnam', date='2016-03-05', content ='premier article';"





# Open database connection
db = MySQLdb.connect("localhost", "hk_blog", "c3r1s3", "blog")

# prepare a cursor object using cursor() method
cursor = db.cursor()

# execute SQL query using execute() method.
cursor.execute(sql)

# disconnect from server
db.close()

# parse element into a dict

# populate article table

# create corresponding pictures entries

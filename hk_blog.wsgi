#!/usr/bin/python
import sys
import logging
logging.basicConfig(stremam=sys.stderr)
sys.path.insert(0, "/var/www/travel_notebook/")

from my_little_api import app as application
application.run()

from flask import Flask,g


app = Flask(__name__)
app.secret_key='daiker666'
app.config.from_object('config')
from app import views
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2018-04-18 21:02:40
# @Author  : daiker (daikersec@gmail.com)
# @Link    : https://daikersec.com
# @Version : $Id$
from flask import request
from app import app,db
from models import *
import json
@app.route('/')
@app.route('/index')
def index():
    consumption = 30
    balance = 80
    t={}
    t['consumption']=consumption
    t['balance']=balance    
    return json.dumps(t,ensure_ascii=False) 

@app.route("/showPlan")
def showPlan():
    print(db.session.query('user').first())
    return "123"

@app.route("/showBill")
def showBill():
    testData = {}
    testData['Bill'] = [
    {	
    	"type":"吃饭",
        "money":50,
        "date":"2018-04-19"
    },
    {
    	"type":"买衣服",
        "money":200,
        "date":"2018-04-19"
    }
    ]
    testData['allSpend'] = 50
    testData['surplus'] = 30
    return json.dumps(testData,ensure_ascii=False)

@app.route("/addPlan")
def addPlan():
    data={}
    print request.args.get('money')
    print request.args.get('startDate')
    print request.args.get('endDate')
    data['status'] = 'success'
    return json.dumps(data,ensure_ascii=False)

@app.route("/addBill")
def addBill():
    data={}
    money =  request.args.get('money')
    typeName = request.args.get('typeName')
    date = request.args.get('date')
    try:
        # db.session.add(Date(date,1))
        # db.session.commit()
        # db.session.add(Category(typeName,money))
        # db.session.commit()
        data['status'] = 'success'
    except Exception as e:
        data['status'] = 'fail'
    return json.dumps(data,ensure_ascii=False)

@app.route("/result")
def result():
    data={}
    print request.args.get('startDate')
    print request.args.get('endDate')
    data['status'] = 'success'
    data['result'] =  [90, 110, 145, 95, 87, 160]
    return json.dumps(data,ensure_ascii=False)

@app.route("/login")
def login():
    data = {}
    data['status'] = 'success'
    data['result'] =  [90, 110, 145, 95, 87, 160]
    return json.dumps(data,ensure_ascii=False)

@app.route("/.well-known/pki-validation/fileauth.txt")
def verity():
    return "20180424101213022w97rnxl5swy0p57qo6uy2rfmr52o3bb05g2c8zaku4pffsj"
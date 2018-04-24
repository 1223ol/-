#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2018-04-18 21:02:40
# @Author  : daiker (daikersec@gmail.com)
# @Link    : https://daikersec.com
# @Version : $Id$
from flask import request
from app import app
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
    print request.args.get('money')
    print request.args.get('typeName')
    print request.args.get('date')
    data['status'] = 'success'
    return json.dumps(data,ensure_ascii=False)
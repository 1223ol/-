#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2018-04-18 21:02:40
# @Author  : daiker (daikersec@gmail.com)
# @Link    : https://daikersec.com
# @Version : $Id$
from flask import request,g,session
from sqlalchemy.sql import func
from app import app,db
from models import *
import json
import sys
import datetime 
import random
import requests                                                                                                
reload(sys)
sys.setdefaultencoding('utf8')
def str2Date(strDate):
    dateList = strDate.split("-")
    return datetime.date(int(dateList[0]),int(dateList[1]),int(dateList[2]))
def date2Str(myDate):
    return str(myDate.year) + "-" + str(myDate.month) + "-" + str(myDate.day)

@app.route('/login')
def login():
    data = {}
    APPID = 'wx69349d4642d367c0'
    SECRET = 'fd33dc688c6e08418787d938dd8ec779'
    JSCODE = request.args.get('js_code')
    url = "https://api.weixin.qq.com/sns/jscode2session?appid={APPID}&secret={SECRET}&js_code={JSCODE}&grant_type=authorization_code".format(APPID=APPID,SECRET=SECRET,JSCODE=JSCODE)
    r = requests.get(url)
    result= eval(r.text)
    openid = result['openid']
    try:
        uid = db.session.query(User.uid).filter_by(openid = openid).first()
        if uid == None:
            myUser = User(openid)
            db.session.add(myUser)
            db.session.commit()
            uid = db.session.query(User.uid).filter_by(openid = openid).first()
        session['uid'] = uid
        data['status'] = 'success'
    except Exception as e:
        data['status'] = 'fail'
        raise e
    return json.dumps(data,ensure_ascii=False)


@app.route('/')
@app.route('/index')
def index():
    data={}
    year = int(request.args.get('year'))
    month = int(request.args.get('month'))
    date = int(request.args.get('date'))
    # if date == '4' :
    #     consumption = 30
    #     balance = 40 - consumption
    # else:
    try:
        dateId = db.session.query(Date.dateId).filter_by(date = datetime.date(year,month,date),uid=1).first()
        if dateId == None:
            data['consumption']= 0
            data['balance'] = 0
        else:
            consumption = db.session.query(func.sum(Category.money)).filter_by(dateId = dateId[0]).first()[0]
            data['consumption'] = consumption
            money = db.session.query(Plan.Money).order_by(Plan.planId.desc()).first()[0]
            data['balance'] = money/30 - consumption
    except Exception as e:
        raise e
    # data['consumption']=consumption
    # data['balance']=balance
    return json.dumps(data,ensure_ascii=False) 

@app.route("/showPlan")
def showPlan():
    # print(db.session.query('user').first())
    return "123"

@app.route("/showBill")
def showBill():
    allBill = db.session.query(Category).all()
    testData = {}
    testData['Bill']  = []
    for i in allBill:
        bill = {}
        bill['type'] = i.name
        bill['money'] = i.money
        bill['date'] = date2Str(db.session.query(Date).filter_by(dateId=i.dateId).first().date)
        testData['Bill'] .append(bill)
    testData['allSpend'] = 30
    testData['surplus'] = 10
    return json.dumps(testData,ensure_ascii=False)

@app.route("/addPlan")
def addPlan():
    data={}
    money =  request.args.get('money')
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    myplan = Plan(str2Date(startDate),str2Date(endDate),money,1)
    try:
        db.session.add(myplan)
        db.session.commit()
        data['status'] = 'success'
    except Exception as e:
        data['status'] = 'Fail'
        print(e)
    return json.dumps(data,ensure_ascii=False)

@app.route("/addBill")
def addBill():
    data={}
    money =  request.args.get('money')
    typeName = request.args.get('typeName')
    date = request.args.get('date')
    try:
        dateId = db.session.query(Date.dateId).filter_by(date=str2Date(date)).first()
        if dateId == None:
            myDate = Date(str2Date(date),1)
            db.session.add(myDate)
            db.session.commit()
            dateId = db.session.query(Date.dateId).filter_by(date=str2Date(date)).first()
        # print(dateId[0])
        bill = Category(unicode(typeName),dateId[0],money)
        db.session.add(bill)
        db.session.commit()
        data['status'] = 'success'
    except Exception as e:
        data['status'] = 'fail'
        raise e
    return json.dumps(data,ensure_ascii=False)

@app.route("/result")
def result():
    data={}
    startDate =  request.args.get('startDate')
    endDate =  request.args.get('endDate')
    db.session.query(Category).filter_by(name=unicode('饮食')).all()
    data['status'] = 'success'
    data['result'] =  [90, 110, 145, 95, 87, 160]
    return json.dumps(data,ensure_ascii=False)

# @app.route("/login")
# def login():
#     data = {}
#     data['status'] = 'success'
#     data['result'] =  [90, 110, 145, 95, 87, 160]
#     return json.dumps(data,ensure_ascii=False)

@app.route("/.well-known/pki-validation/fileauth.txt")
def verity():
    return "20180424101213022w97rnxl5swy0p57qo6uy2rfmr52o3bb05g2c8zaku4pffsj"
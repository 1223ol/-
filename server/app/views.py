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

def havaPlan():
    if db.session.query(Plan.startTime).order_by(Plan.planId.desc()).first() == None:
        return False
    return True

def inPlan(myDate):
    if not havaPlan():
        return False
    startDate = db.session.query(Plan.startTime).order_by(Plan.planId.desc()).first()[0]
    endDate = db.session.query(Plan.endTime).order_by(Plan.planId.desc()).first()[0]
    # print startDate
    # print endDate
    if myDate >= startDate and myDate <= endDate:
        return True
    return False

def countDays():
    startDate = db.session.query(Plan.startTime).order_by(Plan.planId.desc()).first()[0]
    endDate = db.session.query(Plan.endTime).order_by(Plan.planId.desc()).first()[0]
    return (endDate - startDate).days


def balanceCalcu(today):
    print "today"
    print today
    allMoney = db.session.query(Plan.Money).order_by(Plan.planId.desc()).first()[0]
    print "allmoney : {i}".format(i = allMoney)
    startDate = db.session.query(Plan.startTime).order_by(Plan.planId.desc()).first()[0]
    endDate = db.session.query(Plan.endTime).order_by(Plan.planId.desc()).first()[0]
    restDay = (endDate - today).days + 1
    print restDay
    if today == startDate:
        spent = 0
    else:
        spent = db.session.query(func.sum(Category.money)).join(Date).filter(Date.date.between(startDate,(today + datetime.timedelta(days = -1)))).first()[0]
    print "spent = {i}".format(i = spent)
    return (allMoney - spent)/restDay


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
            print "None,I will add it on database!!!"
            myUser = User(openid)
            db.session.add(myUser)
            db.session.commit()
            print "Yep,I hava add it on database"
            uid = db.session.query(User.uid).filter_by(openid = openid).first()
            print uid
        data['openid'] =  openid
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
    if inPlan(datetime.date(year,month,date)):
        data['inPlan'] = 1
    else:
        data['inPlan'] = 0
    # if date == '4' :
    #     consumption = 30
    #     balance = 40 - consumption
    # else:
    try:
        openid = request.args.get('cookie')
        uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
        dateId = db.session.query(Date.dateId).filter_by(date = datetime.date(year,month,date),uid=uid).first()
        days = countDays()
        if dateId == None:
            data['consumption']= 0
            data['isSet'] = 0
        else:
            consumption = db.session.query(func.sum(Category.money)).filter_by(dateId = dateId[0]).first()[0]
            data['consumption'] = consumption
            data['isSet'] = 1
        days = countDays()
        if inPlan(datetime.date(year,month,date)) and days != 0:
            money = db.session.query(Plan.Money).order_by(Plan.planId.desc()).first()[0]
            data['balance'] =  round((balanceCalcu(datetime.date(year,month,date)) - data['consumption']),2)
        else:
            data['balance'] = 0
    except Exception as e:
        raise e
    # data['consumption']=consumption
    # data['balance']=balance
    print data
    return json.dumps(data,ensure_ascii=False) 

@app.route("/showPlan")
def showPlan():
    # print(db.session.query('user').first())
    return "123"

@app.route("/showBill")
def showBill():
    year = int(request.args.get('year'))
    month = int(request.args.get('month'))
    date = int(request.args.get('date'))
    openid = request.args.get('cookie')
    uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
    dateId = db.session.query(Date.dateId).filter_by(date = datetime.date(year,month,date),uid=uid).first()
    if dateId == None:
        allBill = []
    else:      
        allBill = db.session.query(Category).filter_by(dateId = dateId[0]).all()
    testData = {}
    testData['Bill']  = []
    allSpend = 0
    for i in allBill:
        bill = {}
        bill['type'] = i.name
        bill['money'] = i.money
        allSpend += i.money
        bill['date'] = date2Str(db.session.query(Date).filter_by(dateId=i.dateId).first().date)
        testData['Bill'] .append(bill)
    testData['allSpend'] = allSpend
    money = db.session.query(Plan.Money).order_by(Plan.planId.desc()).first()[0]
    days = countDays()
    if days != 0:
        testData['surplus'] = round((balanceCalcu(datetime.date(year,month,day)) - allSpend),2)
    else:
        testData['surplus'] = 0
    return json.dumps(testData,ensure_ascii=False)

@app.route("/addPlan")
def addPlan():
    data={}
    money =  request.args.get('money')
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    openid = request.args.get('cookie')
    if str2Date(startDate) >= str2Date(endDate):
        data['status'] = 'Fail'
        return json.dumps(data,ensure_ascii=False)
    uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
    myplan = Plan(str2Date(startDate),str2Date(endDate),money,uid)
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
    openid = request.args.get('cookie')
    try:
        dateId = db.session.query(Date.dateId).filter_by(date=str2Date(date)).first()
        uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
        if dateId == None:
            myDate = Date(str2Date(date),uid)
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
    eat = db.session.query(func.sum(Category.money)).filter_by(name=unicode('饮食')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).first()[0]
    wear = db.session.query(func.sum(Category.money)).filter_by(name=unicode('服饰装容')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).first()[0]
    live = db.session.query(func.sum(Category.money)).filter_by(name=unicode('生活日用')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).first()[0]
    house = db.session.query(func.sum(Category.money)).filter_by(name=unicode('住房缴费')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).first()[0]
    go = db.session.query(func.sum(Category.money)).filter_by(name=unicode('交通出行')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).first()[0]
    chat = db.session.query(func.sum(Category.money)).filter_by(name=unicode('通讯')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).first()[0]
    data['status'] = 'success'
    # print(dateId)
    # '饮食', '服饰妆容', '生活日用', '住房缴费', '交通出行', '通讯']
    # db.session.query(func.sum(Category.money)).filter_by(name=unicode('饮食')).first()[0]
    data['result'] =  [eat, wear, live, house, go, chat]
    for i,content in enumerate(data['result']):
        if content == None:
            data['result'][i] = 0
    print(data['result'])
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
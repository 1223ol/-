
from flask import request,g,session
from sqlalchemy.sql import func
from app import app,db
from models import *
import json
import sys
import datetime 
import random
import requests
import hashlib
import reply
import receive
import re
                                                                                           
reload(sys)
sys.setdefaultencoding('utf8')
def str2Date(strDate):
    dateList = strDate.split("-")
    # try:
    print strDate
    return datetime.date(int(dateList[0]),int(dateList[1]),int(dateList[2]))
    # except Exception as e:
        # print dateList
def date2Str(myDate):
    return str(myDate.year) + "-" + str(myDate.month) + "-" + str(myDate.day)
"""
sure id is OK
"""
def havaPlan(uid):
    if db.session.query(Plan.startTime).filter_by(uid = uid).order_by(Plan.planId.desc()).first() == None:
        return False
    return True
"""
sure id is OK
"""
def inPlan(myDate,uid):
    if not havaPlan(uid):
        return False
    startDate = db.session.query(Plan.startTime).filter_by(uid = uid).order_by(Plan.planId.desc()).first()[0]
    endDate = db.session.query(Plan.endTime).filter_by(uid = uid).order_by(Plan.planId.desc()).first()[0]
    # print startDate
    # print endDate
    if myDate >= startDate and myDate <= endDate:
        return True
    return False
"""
sure id is OK
"""
def countDays(uid):
    if not havaPlan(uid):
        return 0
    startDate = db.session.query(Plan.startTime).filter_by(uid = uid).order_by(Plan.planId.desc()).first()[0]
    endDate = db.session.query(Plan.endTime).filter_by(uid = uid).order_by(Plan.planId.desc()).first()[0]
    return (endDate - startDate).days

"""
sure id is OK
"""
def balanceCalcu(today,uid):
    # print "today"
    # print today
    allMoney = db.session.query(Plan.Money).filter_by(uid = uid).order_by(Plan.planId.desc()).first()[0]
    # print "allmoney : {i}".format(i = allMoney)
    startDate = db.session.query(Plan.startTime).filter_by(uid = uid).order_by(Plan.planId.desc()).first()[0]
    endDate = db.session.query(Plan.endTime).filter_by(uid = uid).order_by(Plan.planId.desc()).first()[0]
    restDay = (endDate - today).days + 1
    if today >=  datetime.date.today():
        restDay = (endDate - datetime.date.today()).days + 1
    # print restDay
    # print startDate
    # print today + datetime.timedelta(days = -1)
    # print endDate
    spentMon = db.session.query(func.sum(Category.money)).join(Date).filter_by(uid = uid).filter(Date.date.between(startDate,(today + datetime.timedelta(days = -1)))).first()[0]
    if spentMon == None:
        spent = 0
    else:
        spent = spentMon
    # print "spent = {i}".format(i = spent)
    return (allMoney - spent)/restDay


"""
sure id is OK
"""
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

"""
sure id is OK
"""
@app.route('/')
@app.route('/index')
def index():
    data={}
    openid = request.args.get('cookie')
    uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
    year = int(request.args.get('year'))
    month = int(request.args.get('month'))
    date = int(request.args.get('date'))  
    if inPlan(datetime.date(year,month,date),uid):
        data['inPlan'] = 1
    else:
        data['inPlan'] = 0
    # if date == '4' :
    #     consumption = 30
    #     balance = 40 - consumption
    # else:
    # try:
    dateId = db.session.query(Date.dateId).filter_by(date = datetime.date(year,month,date),uid=uid).first()
    days = countDays(uid)
    if dateId == None:
        data['consumption']= 0
        data['isSet'] = 0
    else:
        consumption = db.session.query(func.sum(Category.money)).filter_by(dateId = dateId[0]).first()[0]
        if consumption == None:
            data['consumption'] = 0
        else:
            data['consumption'] = consumption
        data['isSet'] = 1
    days = countDays(uid)
    print data['consumption']
    if inPlan(datetime.date(year,month,date),uid) and days != 0:
        money = db.session.query(Plan.Money).filter_by(uid = uid).order_by(Plan.planId.desc()).first()[0]
        print data['consumption']
        data['balance'] =  round((balanceCalcu(datetime.date(year,month,date),uid) - data['consumption']),2)
    else:
        data['balance'] = 0
    # except Exception as e:
        # raise e
    # data['consumption']=consumption
    # data['balance']=balance
    print data
    return json.dumps(data,ensure_ascii=False) 

# @app.route("/showPlan")
# def showPlan():
#     # print(db.session.query('user').first())
#     return "123"
"""
sure id is OK
"""
@app.route("/showBill")
def showBill():
    testData = {}
    year = int(request.args.get('year'))
    month = int(request.args.get('month'))
    date = int(request.args.get('date'))
    openid = request.args.get('cookie')
    uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
    if inPlan(datetime.date(year,month,date),uid):
        testData['inPlan'] = 1
    else:
        testData['inPlan'] = 0
    dateId = db.session.query(Date.dateId).filter_by(date = datetime.date(year,month,date),uid=uid).first()
    if dateId == None:
        allBill = []
    else:      
        allBill = db.session.query(Category).filter_by(dateId = dateId[0]).all()
    testData['Bill']  = []
    allSpend = 0
    for i in allBill:
        bill = {}
        bill['id'] = i.CategoryId
        bill['type'] = i.name
        bill['money'] = i.money
        allSpend += i.money
        bill['date'] = date2Str(db.session.query(Date).filter_by(dateId=i.dateId).first().date)
        testData['Bill'] .append(bill)
    testData['allSpend'] = allSpend
    if inPlan(datetime.date(year,month,date),uid):
        money = db.session.query(Plan.Money).filter_by(uid=uid).order_by(Plan.planId.desc()).first()[0]
        days = countDays(uid)
        if days != 0:
            testData['surplus'] = round((balanceCalcu(datetime.date(year,month,date),uid) - allSpend),2)
        else:
            testData['surplus'] = 0
        # print(testData)
    else:
        testData['surplus'] = 0
    return json.dumps(testData,ensure_ascii=False)
"""
sure id is OK
"""
@app.route("/delBill")
def delBill():
    data = {}
    openid = request.args.get('cookie')
    id = request.args.get('id')
    id = int(id)
    uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
    if uid == None:
        data['status'] = 'Fail'
    try:
        sql = '''delete from Category where CategoryId = {CategoryId}'''.format(CategoryId = id)
        db.engine.execute(sql)
        # Item = Category(CategoryId = id)
        # db.session.delete(Item)
        # db.session.commit()
        data['status'] = 'Succes'
    except Exception as e:
        data['status'] = 'Fail'
        print e
    return json.dumps(data,ensure_ascii=False)


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
"""
sure id is OK
"""
def addBillLocal(money,typeName,date,openid):
    data = {}
    try:
        uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
        print 1
        dateId = db.session.query(Date.dateId).filter_by(date=str2Date(date),uid=uid).first()
        if dateId == None:
            myDate = Date(str2Date(date),uid)
            db.session.add(myDate)
            db.session.commit()
            dateId = db.session.query(Date.dateId).filter_by(date=str2Date(date),uid=uid).first()
        # print(dateId[0])
        bill = Category(unicode(typeName),dateId[0],money)
        db.session.add(bill)
        db.session.commit()
        data['status'] = 'success'
    except Exception as e:
        data['status'] = 'fail'
        raise e
    return json.dumps(data,ensure_ascii=False)


@app.route("/addBill")
def addBill():
    money =  request.args.get('money')
    typeName = request.args.get('typeName').strip()
    date = request.args.get('date')
    openid = request.args.get('cookie')
    return addBillLocal(money,typeName,date,openid)


@app.route("/showPlan")
def showPlan():
    data = {}
    openid = request.args.get('cookie')
    uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
    money = db.session.query(Plan.Money).filter_by(uid=uid).order_by(Plan.planId.desc()).first()
    if money == None:
        data['have'] = 0
        return json.dumps(data,ensure_ascii=False)
    else:
        data['have'] = 1
        money = money[0]
    startDate = db.session.query(Plan.startTime).filter_by(uid=uid).order_by(Plan.planId.desc()).first()[0]
    dateList = []
    leftMoney = []
    planMoneys = []
    print startDate
    endDate = db.session.query(Plan.endTime).filter_by(uid=uid).order_by(Plan.planId.desc()).first()[0]
    print endDate
    newstartDate = startDate
    i = 0
    while newstartDate <= endDate:
        date_str = newstartDate.strftime("%m-%d")
        dateList.append(date_str)
        allMoney = db.session.query(func.sum(Category.money)).join(Date).filter(Date.date.between(startDate,newstartDate)).filter_by(uid = uid).first()[0]
        allMoney = 0 if allMoney == None else allMoney
        if newstartDate <= datetime.date.today():
            leftMoney.append(money-allMoney)
        days = (endDate - startDate).days
        planMoney = money/days * i
        i += 1
        planMoneys.append(round((money - planMoney),2))
        newstartDate += datetime.timedelta(days=1)

    data['labels'] = dateList
    data['realMoneys'] =  leftMoney
    data['expectMoneys'] =  planMoneys
    print(data)
    return json.dumps(data,ensure_ascii=False)
"""
sure id is OK
"""
@app.route("/result")
def result():
    data={}
    startDate =  request.args.get('startDate')
    endDate =  request.args.get('endDate')
    openid = request.args.get('cookie')
    uid = db.session.query(User.uid).filter_by(openid = openid).first()[0]
    # eat = db.session.query(func.sum(Category.money)).filter_by(name=unicode('饮食 ')).first()[0]
    eat = db.session.query(func.sum(Category.money)).filter_by(name=unicode('饮食')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    wear = db.session.query(func.sum(Category.money)).filter_by(name=unicode('服饰装容')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    live = db.session.query(func.sum(Category.money)).filter_by(name=unicode('生活日用')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    house = db.session.query(func.sum(Category.money)).filter_by(name=unicode('住房缴费')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    go = db.session.query(func.sum(Category.money)).filter_by(name=unicode('交通出行')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    chat = db.session.query(func.sum(Category.money)).filter_by(name=unicode('通讯')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    wen = db.session.query(func.sum(Category.money)).filter_by(name=unicode('文教娱乐')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    health = db.session.query(func.sum(Category.money)).filter_by(name=unicode('健康')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    other = db.session.query(func.sum(Category.money)).filter_by(name=unicode('其他消费')).join(Date).filter(Date.date.between(str2Date(startDate),str2Date(endDate))).filter_by(uid = uid).first()[0]
    data['status'] = 'success'
    print(eat)
    # print(dateId)
    # '饮食', '服饰妆容', '生活日用', '住房缴费', '交通出行', '通讯']
    # db.session.query(func.sum(Category.money)).filter_by(name=unicode('饮食')).first()[0]
    data['result'] =  [eat, wear, live, house, go, chat,wen,health,other]
    flag = 0
    for i,content in enumerate(data['result']):
        if content == None:
            data['result'][i] = 0
        else:
            flag = 1
    data['flag'] = flag
    print(data)
    return json.dumps(data,ensure_ascii=False)

# @app.route("/login")
# def login():
#     data = {}
#     data['status'] = 'success'
#     data['result'] =  [90, 110, 145, 95, 87, 160]
#     return json.dumps(data,ensure_ascii=False)

# @app.route("/.well-known/pki-validation/fileauth.txt")
# def verity():
#     return "20180424101213022w97rnxl5swy0p57qo6uy2rfmr52o3bb05g2c8zaku4pffsj"
# def getAccessToken():
#     appID = "wxda414635ff6fd070"
#     appse  = "7125e4cdd86f80dec33054bb6c7383ea"
#     url = '''https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={appid}&secret={appse}'''
#     url = url.format(appid = appID,appse = appse)
#     r = requests.get(url)
#     return r.text

# def getUnionId(ACCESS_TOKEN,OPENID):
#     url = '''https://api.weixin.qq.com/cgi-bin/user/info?access_token={ACCESS_TOKEN}&openid={OPENID}&lang=zh_CN'''
#     url = url.format(ACCESS_TOKEN = ACCESS_TOKEN,OPENID = OPENID)
#     r = requests.get(url)
#     return r.text

def convertChineseDigitsToArabic(chinese_digits, encoding="utf-8"):
    chs_arabic_map = {u'零':0, u'一':1, u'二':2, u'三':3, u'四':4,
        u'五':5, u'六':6, u'七':7, u'八':8, u'九':9,
        u'十':10, u'百':100, u'千':10 ** 3, u'万':10 ** 4,
        u'〇':0, u'壹':1, u'贰':2, u'叁':3, u'肆':4,
        u'伍':5, u'陆':6, u'柒':7, u'捌':8, u'玖':9,
        u'拾':10, u'佰':100, u'仟':10 ** 3, u'萬':10 ** 4,
        u'亿':10 ** 8, u'億':10 ** 8, u'幺': 1,
        u'０':0, u'１':1, u'２':2, u'３':3, u'４':4,
        u'５':5, u'６':6, u'７':7, u'８':8, u'９':9}
    if isinstance (chinese_digits, str):
        chinese_digits = chinese_digits.decode (encoding)
    number = re.compile(ur'([一二三四五六七八九零十百千万亿]+|[0-9]+[,]*[0-9]+.[0-9]+)')
    pattern = re.compile(number)
    result = pattern.findall(chinese_digits)
    if result == []:
        return None
    else:
        chinese_digits = result[0]
    result  = 0
    tmp     = 0
    hnd_mln = 0
    for count in range(len(chinese_digits)):
        curr_char  = chinese_digits[count]
        curr_digit = chs_arabic_map.get(curr_char, None)
        # meet 「亿」 or 「億」
        if curr_digit == 10 ** 8:
            result  = result + tmp
            result  = result * curr_digit
            # get result before 「亿」 and store it into hnd_mln
            # reset `result`
            hnd_mln = hnd_mln * 10 ** 8 + result
            result  = 0
            tmp     = 0
        # meet 「万」 or 「萬」
        elif curr_digit == 10 ** 4:
            result = result + tmp
            result = result * curr_digit
            tmp    = 0
        # meet 「十」, 「百」, 「千」 or their traditional version
        elif curr_digit >= 10:
            tmp    = 1 if tmp == 0 else tmp
            result = result + curr_digit * tmp
            tmp    = 0
        # meet single digit
        elif curr_digit is not None:
            tmp = tmp * 10 + curr_digit
        else:
            return result
    result = result + tmp
    result = result + hnd_mln
    return result


def addConver(content,pnId):
    mpId = db.session.query(Conver.mpId).filter_by(pnId = pnId).first()
    if mpId != None:
        return "repeat"
    mpId = content.lstrip("激活").strip();
    print mpId
    print pnId
    Reuslt = db.session.query(User).filter_by(openid = mpId).first()
    print "Reuslt"
    print Reuslt
    if Reuslt == None:
        return "no"
    converClass = Conver(mpId,pnId)
    db.session.add(converClass)
    db.session.commit()
    mpId = db.session.query(Conver.mpId).filter_by(pnId = pnId).first()[0]
    return mpId

def idConvert(pnId):
    mpId = db.session.query(Conver.mpId).filter_by(pnId = pnId).first()
    print mpId
    return mpId

def addBillByPn(content,pnId):
    mpId = idConvert(pnId)
    if mpId == None:
        return u"请输入激活码"
    typeList = ["饮食", "服饰妆容", "生活日用", "住房缴费", "交通出行", "通讯", "文教娱乐", "健康", "其他消费"]
    for i in typeList:
        if i in content:
            typeName = i
            break
        else:
            typeName = u'其他消费'

    money = re.findall(r"\d+\.?\d*",content)
    if money == []:
        if convertChineseDigitsToArabic(content) == None:
            return '''输入格式错误，
如果要添加账单,请输入"类型+金钱",如"饮食50"
类型有底下几类
["饮食", "服饰妆容", "生活日用", "住房缴费", "交通出行", "通讯", "文教娱乐", "健康", "其他消费"]
            '''
        money = convertChineseDigitsToArabic(content)
    else:
        money = money[0]
    print typeName
    print money
    date = datetime.datetime.now().strftime('%Y-%m-%d')
    print date
    print mpId[0]
    kk = addBillLocal(money,typeName,date,mpId[0])
    print kk
    result = eval(kk)
    print result
    return result['status']+",类型为: "+typeName+",金额为: "+str(money)
    # return "123"



@app.route("/wx",methods=['POST'])
# @app.route("/wx")
def wx():
    webData = request.data
    print "Handle Post webdata is ", webData
    recMsg = receive.parse_xml(webData)
    # print recMsg.MsgId
    # print (isinstance(recMsg, receive.Msg) and recMsg.MsgType == 'text')
    if isinstance(recMsg, receive.Msg) and (recMsg.MsgType == 'text' or recMsg.MsgType == 'voice'):
        toUser = recMsg.FromUserName
        ToUserName = recMsg.ToUserName
        content = recMsg.Content.strip().rstrip('。')
        pnId = toUser
        replyContent = u"处理异常，请稍后重试"
        if content.startswith("激活"):
            resu = addConver(content,pnId)
            if resu == "no":
                replyContent = "激活失败，请从小程序处复制激活码"
            elif resu == "repeat":
                replyContent = "您已经激活，无需再激活"
            else:
                replyContent = '''激活成功,请尽情使用
如果要添加账单，请输入"类型+金钱"
如"饮食50",类型有底下几类
["饮食", "服饰妆容", "生活日用", "住房缴费", "交通出行", "通讯", "文教娱乐", "健康", "其他消费"]
            '''
        else:
            replyContent = addBillByPn(content,pnId)

        replyMsg = reply.TextMsg(toUser, ToUserName, replyContent)
        # print replyMsg.send()
        return replyMsg.send()
    elif recMsg.MsgType == 'event':
        toUser = recMsg.FromUserName
        ToUserName = recMsg.ToUserName
        replyContent = '''欢迎关注，这里是吃土神器公众号，
此公众号配合小程序"吃土神器"使用
初次使用,请先激活,请先激活,输入"激活+激活码"
如"激活vfbjfbhj(从小程序中获取)"
            '''
        replyMsg = reply.TextMsg(toUser, ToUserName, replyContent)
        # print replyMsg.send()
        return replyMsg.send()
    else:
        print "暂且不处理"
        return "success"
    # print request.form
    # signature = request.args.get('signature')
    # timestamp = request.args.get('timestamp')
    # nonce = request.args.get('nonce')
    # echostr = request.args.get('echostr')
    # token = "daiker"
    # list = [token, timestamp, nonce]
    # list.sort()
    # sha1 = hashlib.sha1()
    # map(sha1.update, list)
    # hashcode = sha1.hexdigest()
    # print "handle/GET func: hashcode, signature: ", hashcode, signature
    # if hashcode == signature:
    #     return echostr
    # else:
    #     return ""    

@app.route("/active")
def active():
    data = {}
    openid = request.args.get('cookie')
    result = db.session.query(Conver).filter_by(mpId = openid).first()
    if result == None:
        data['active'] = 0
    else:
       data['active'] = 1
    print data
    return json.dumps(data,ensure_ascii=False)

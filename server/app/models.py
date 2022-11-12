
from app import db

class User(db.Model):
    __tablename__ = 'user'
    uid = db.Column(db.Integer, primary_key = True)
    openid = db.Column(db.String(64), index = True)
    # date = db.relationship('Date', backref='Customer', lazy='dynamic')
    def __init__(self,openid):
        self.openid = openid
    def __repr__(self):
        return '<User %r>' % (self.uid)



class Date(db.Model):
    __tablename__ = 'date'
    dateId = db.Column(db.Integer,primary_key = True)
    date = db.Column(db.Date,index = True)
    uid = db.Column(db.Integer,db.ForeignKey('user.uid'))
    # category = db.relationship('Category', backref='datetime', lazy='dynamic')
    def __init__(self,date,uid):
        self.date = date
        self.uid = uid
    def __repr__(self):
        return '<Date {did}:{name}>'.format(name = self.date,did = self.dateId)



class Category(db.Model):
    __tablename__ = 'category'
    CategoryId = db.Column(db.Integer,primary_key = True)
    name = db.Column(db.String(64), index = True)
    dateId = db.Column(db.Integer,db.ForeignKey('date.dateId'))
    money = db.Column(db.Float,index = True)
    def __init__(self,name,dateId,money):
        self.name = name
        self.dateId = dateId
        self.money = money


    def __repr__(self):
        return '<Category %r>' % (self.name)



class Plan(db.Model):
    __tablename__ = 'plan'
    planId = db.Column(db.Integer, primary_key = True)
    startTime = db.Column(db.Date,index = True)
    endTime = db.Column(db.Date,index = True)
    Money = db.Column(db.Float,index = True)
    uid = db.Column(db.Integer,db.ForeignKey('user.uid'))

    def __init__(self,startTime,endTime,Money,uid):
        self.startTime = startTime
        self.endTime = endTime
        self.Money = Money
        self.uid = uid
    def __repr__(self):
        return '<Plan {pId}:{sTime}-{eTime}>'.format(pId = self.planId,sTime = self.startTime,eTime = self.endTime)

class Conver(db.Model):
    __tablename__='Conver'
    mpId =  db.Column(db.String(64), index = True)
    pnId =  db.Column(db.String(64), index = True, primary_key = True)

    def __init__(self,mpId,pnId):
        self.mpId = mpId
        self.pnId = pnId

        
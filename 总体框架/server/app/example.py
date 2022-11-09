#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2018-04-25 21:18:48
# @Author  : daiker (daikersec@gmail.com)
# @Link    : https://daikersec.com
# @Version : $Id$

In [2]: from app import models

In [3]: from app import db

In [4]: db.create_all()

In [5]: user = models.User("daiker",001)

In [6]: db.session.add(user)

In [13]: db.session.query(models.User).all()
Out[13]: [<User u'daiker'>]
In [14]: db.session.query(models.User).filter_by(uid=1).all()
Out[14]: [<User u'daiker'>]
In [15]: db.session.query(models.User.uid).filter_by(uid=1).all()
Out[15]: [(1)]


------------------------
In [22]: today = models.Date(datetime.date(2018,4,21),300)

In [23]: db.session.add(today)

In [24]: db.session.commit()

In [17]: today = models.Date(datetime.date(2018,4,10),1)

In [18]: db.session.add(today)

In [19]: db.session.commit()

In [23]: db.session.query(models.Date).filter(models.Date.date.between(datetime.date(2018,04,20),datetime.date(2018,05,01))).all()
Out[23]: [<Date 1:2018-04-21>]


------------------------
In [12]: myplan = models.Plan(datetime.date(2018,04,01),datetime.date(2018,05,01),6000)

In [13]: db.session.add(myplan)

In [14]: db.session.commit()
In [27]: db.session.query(models.Plan).order_by(models.Plan.planId.desc()).first()
Out[27]: <Plan 1:2018-04-01-2018-05-01>

----------------------------------
In [6]: lastday = models.Category(unicode('饮食'),1,200)

In [7]: db.session.add(lastday)

In [8]: db.session.commit()
In [39]: db.session.query(models.Category).filter_by(name=unicode('饮食')).all()
Out[39]: [<Category u'\u996e\u98df'>, <Category u'\u996e\u98df'>]

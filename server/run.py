#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2018-04-18 21:03:46
# @Author  : daiker (daikersec@gmail.com)
# @Link    : https://daikersec.com
# @Version : $Id$

from flask import Flask
from app import app
app.run(debug = True,host="119.29.177.23",port=80,ssl_context=('ssl/tally.slickghost.com.crt', 'ssl/tally.slickghost.com.key'))
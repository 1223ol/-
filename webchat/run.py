#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2018-04-18 21:03:46
# @Author  : daiker (daikersec@gmail.com)
# @Link    : https://daikersec.com
# @Version : $Id$

from flask import Flask
from app import app
if __name__ == '__main__':
    app.run(host='0.0.0.0',port = 80)
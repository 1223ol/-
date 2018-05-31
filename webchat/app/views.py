#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Date    : 2018-04-18 21:02:40
# @Author  : daiker (daikersec@gmail.com)
# @Link    : https://daikersec.com
# @Version : $Id$
from flask import request
from app import app
import hashlib
import reply
import receive

@app.route("/wx",methods=['POST'])
def wx():
    webData = request.data
    print "Handle Post webdata is ", webData
    recMsg = receive.parse_xml(webData)
    # print recMsg.MsgId
    # print (isinstance(recMsg, receive.Msg) and recMsg.MsgType == 'text')
    if isinstance(recMsg, receive.Msg) and (recMsg.MsgType == 'text' or recMsg.MsgType == 'voice'):
        toUser = recMsg.FromUserName
        fromUser = recMsg.ToUserName
        content = recMsg.Content
        replyMsg = reply.TextMsg(toUser, fromUser, content)
        # print replyMsg.send()
        return replyMsg.send()
    else:
        print "暂且不处理"
        return "success"
    # print request.form
    # appID = "wxda414635ff6fd070"
    # appse  = "http://120.78.181.248/wx"
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

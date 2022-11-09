![Tally.png](https://upload-images.jianshu.io/upload_images/5443560-61c4d5fbe65e35f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# wxapp-Tally
[![Tally](https://img.shields.io/badge/Tally-2.0-blue.svg)](https://img.shields.io/badge/Tally-2.0-blue.svg)
[![python](https://img.shields.io/badge/python-2.7-orange.svg)](https://img.shields.io/badge/python-2.7-orange.svg)
[![build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://img.shields.io/badge/build-passing-brightgreen.svg)
[![downloads](https://img.shields.io/badge/downloads-393k-red.svg)](https://img.shields.io/badge/downloads-393k-red.svg)

# 项目描述
------------

-   项目名：基于微信的记账小程序开发
-   项目版本：2.0
-   项目功能简述：用户使用基于微信的记账小程序，使用“计划”功能配合用户自己输入的每天消费实现记录支出的作用。加上图表和公众号，方便用户的记录，查看和使用
-   代码仓库地址：https://gitee.com/SE-Tally/Tally
-   第一负责人：【Ycl】

运行
------------
####    开发配置环境
-   Python环境，运行后端
-   微信开发小程序，做前端开发

####    开发&发布命令

```
  git clone https://gitee.com/SE-Tally/Tally.git
  cd server
  pip install -r requirement.txt
  python run .py
```

####    依赖库
- `certifi==2018.4.16`
- `chardet==3.0.4`
- `click==6.7`
- `Flask==1.0.2`
- `Flask-SQLAlchemy==2.3.2`
- `idna==2.6`
- `itsdangerous==0.24`
- `Jinja2==2.10`
- `MarkupSafe==1.0`
-  `requests==2.18.4`
- `SQLAlchemy==1.2.8`
- `urllib3==1.22`
- `Werkzeug==0.14.1`
####    发布
-   微信小程序端

####    相关人员

角色|人员
-|:-:
产品经理|Ycl
后端开发|daiker
前端开发|ST
后端开发|KeKeFly
测试|JX

## 业务介绍
#### 业务入口

页面目录|页面描述|页面链接
:-:|:-:|:-:
index|首页接口|https://tally.slickghost.com/
login|登陆接口|https://tally.slickghost.com/login
addPlan|添加计划接口|https://tally.slickghost.com/addPlan
addBill|添加流水接口|https://tally.slickghost.com/addBill
result|图表展示接口|https://tally.slickghost.com/result
showPlan|计划展示接口|https://tally.slickghost.com/showPlan
showBill|流水展示接口|https://tally.slickghost.com/showBill
active|激活接口|https://tally.slickghost.com/active
wx|公众号接口|https://tally.slickghost.com/wx

## CHANGELOG
### v2.0 (2018/6/1)
- 更改动态余额查看算法，更人性化
- UI重构，更美观
- 支持金钱燃尽图查看计划
- 图标展示部分进行重构
- 支持长按删除账单
- 新增公众号功能，支持通过语音或者文字增加账单
- 新增激活码机制

### v1.0 (2018/05/12)
- 支持动态余额计算
- 添加计划
- 修复背景图片不能查看bug
- 重构日历
- 支持查看账单明细

### v0.1.1 (2018/05/01)
- 日历
- 查看账单
- 添加账单
- 消费情况查看


## to do list
- [x] 支持公众号添加账单
- [ ] 公众号中的识别更加智能
- [ ] 数据展示增加多种展示 



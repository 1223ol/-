
// pages/plan/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: 0.0,
    billMoney: null,
    startDate: '2016-09-26',
    endDate: '2016-09-26',
    date: '2016-09-26',
    realDate:'2016-06-29',
    array: ['饮食 ', '服饰装容', '生活日用', '住房缴费', '交通出行', " 通讯 ", "文教娱乐", " 健康 ", "其他消费"],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("Flowing onload");
    var util = require('../../utils/util.js');
    var time = util.formatDate(new Date());
    var nextMonth = util.formatDateaddMonth(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      startDate: time,
      endDate: nextMonth,
      date: time,
      realDate:time
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  addPlan: function (event) {
    console.log("addPlan is invoke");
    var that = this;
    wx.request({
      url: 'https://tally.slickghost.com/addPlan', //仅为示例，并非真实的接口地址
      data: {
        money: this.data.money,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        cookie:app.globalData.cookie
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var obj = res.data;
        wx.showToast({
          title: obj.status,
          icon: 'succes',
          duration: 1000,
          mask: true
        });
        console.log("navigate");
        wx.switchTab({
          url: '/pages/scrollline/scrollline',
        });
      },
    });
    

  },
  changMoney: function (event) {
    console.log("changMoney is invoke");
    this.setData({
      money: event.detail.value
    });
  },
  changBillMoney: function (event) {
    console.log("changBillMoney  is invoke");
    this.setData({
      billMoney: event.detail.value
    });
  },
  listenerDatePickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    console.log("listenerDatePickerSelected  is invoke");
    this.setData({
      date: e.detail.value
    });
  },
  listenerPickerSelected: function (e) {
    console.log("listenerPickerSelected  is invoke");
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
  },
  listenerStartDatePickerSelected: function (e) {
    console.log("listenerStartDatePickerSelected  is invoke");
    //调用setData()重新绘制
    this.setData({
      startDate: e.detail.value,
    });
  },
  listenerEndDatePickerSelected: function (e) {
    console.log("listenerEndDatePickerSelected  is invoke");
    var d1 = e.detail.value;
    var d2 = this.data.startDate;
    if((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/")))){
    //调用setData()重新绘制
    this.setData({
      endDate: e.detail.value,
    });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },




  jumpToAddBill: function (event) {
    console.log("jumpToAddBill  is invoke");
    this.setData({
      selectItem: 0
    });

  },

  jumpToPlan: function (event) {
    console.log("jumpToPlan  is invoke");
    this.setData({
      selectItem: 1
    });

  },

})
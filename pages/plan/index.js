// pages/addBill/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0.0,
    startDate: '2016-09-26',
    endDate: '2016-09-26',
    array: ['饮食', '服饰装容', '生活日用', '住房缴费', '交通出行', "通讯", "文教娱乐", "健康", "其他消费"],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var util = require('../../utils/util.js');
    var time = util.formatDate(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      startDate: time,
      endDate:time
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changMoney:function(event){
    this.setData({
      money: event.detail.value
    });
  },
  addPlan:function(event){
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/addPlan', //仅为示例，并非真实的接口地址
      data: {
        money: this.data.money,
        startDate: this.data.startDate,
        endDate:this.data.endDate
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var obj = res.data;
        console.log(obj.status);
      }
    });
  }
  ,
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
  },
  listenerStartDatePickerSelected: function (e) {
    //调用setData()重新绘制
    this.setData({
      startDate: e.detail.value,
    });
  },
  listenerEndDatePickerSelected: function (e) {
    //调用setData()重新绘制
    this.setData({
      endDate: e.detail.value,
    });
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

  }
})
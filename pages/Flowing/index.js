// pages/plan/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billMoney: null,
    startDate: '2016-09-26',
    endDate: '2016-09-26',
    date: '2016-09-26',
    realDate:'2016-06-29',
    code:"",
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
      billMoney: null,
      startDate: time,
      endDate: nextMonth,
      date: time,
      realDate:time,
      code: app.globalData.cookie
    });
    console.log(this.data.code)
  },
  copyTBL:function(e){

    var self = this;
    wx.setClipboardData({
      data: self.data.code,
      success: function (res) {
        // self.setData({copyTip:true}),  
        // wx.showModal({
        //   title: '提示',
        //   content: '复制成功',
        //   success: function (res) {
        //     if (res.confirm) {
        //       console.log('确定')
        //     } else if (res.cancel) {
        //       console.log('取消')
        //     }
        //   }
        // })
      }
    });  

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  addBill: function (event) {
    console.log("addBill is invoked");
    var that = this;
    wx.request({
      url: 'https://tally.slickghost.com/addBill', //仅为示例，并非真实的接口地址
      data: {
        money: that.data.billMoney,
        typeName: that.data.array[that.data.index],
        date: that.data.date,
        cookie: app.globalData.cookie
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var obj = res.data;
        console.log(obj.status);
        wx.showToast({
          title: obj.status,
          icon: 'succes',
          duration: 1000,
          mask: true
        });
        that.setData({
          billMoney: null
        });
      }
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
    this.onLoad()
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
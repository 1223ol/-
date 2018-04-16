// pages/addBill/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
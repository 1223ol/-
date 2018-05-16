// pages/showBill/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    "limit": 1,
    allSpend: 0,
    surplus: 0,
    "bill": [
      {
      },
    ],
    options: {}
  },
  getItem: function () {
    var that = this;
    wx.request({
      url: 'https://tally.slickghost.com/showBill', //仅为示例，并非真实的接口地址
      data: {
        year: that.data.options.year,
        month: that.data.options.month,
        date: that.data.options.date,
        cookie: app.globalData.cookie
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var obj = res.data;
        that.setData({
          bill: obj.Bill,
          allSpend: obj.allSpend,
          surplus: obj.surplus,
        });
      }
    });


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      options: options
    });
    console.log(options);
    this.getItem();

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindDel: function (e) {
    var that = this;
    console.log("invoke");
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          console.log(e.currentTarget.id);
          wx.request({
            url: 'https://tally.slickghost.com/delBill', //仅为示例，并非真实的接口地址
            data: {
              id: e.currentTarget.id,
              cookie: app.globalData.cookie
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
              that.getItem();
            }
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
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
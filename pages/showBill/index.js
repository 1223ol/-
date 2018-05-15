// pages/showBill/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  	"limit":1,
    allSpend:0,
    surplus:0,
    "bill":[
      { 
        "type":"吃饭",
        "money":50,
        "date":"04-05"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
        wx.request({
          url: 'https://tally.slickghost.com/showBill', //仅为示例，并非真实的接口地址
          data: {
            year: options.year,
            month: options.month,
            date: options.date,
            cookie:app.globalData.cookie
          },
          header: {
              'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            var obj = res.data;
            that.setData({
            bill:obj.Bill,
            allSpend: obj.allSpend,
            surplus: obj.surplus,
        });
          }
        });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  bindDel:function(){
    console.log("bindDel invocked!!");
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  onReady: function () {
  
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
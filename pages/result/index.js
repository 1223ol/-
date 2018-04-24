var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var radarChart = null;
Page({
  data: {
    array: ['雷达图', '柱状图', '扇形图', '折线图'],
    index: 0,
    startDate: '2016-09-26',
    endDate: '2016-09-26'
  },
  touchHandler: function (e) {
    console.log(radarChart.getCurrentDataIndex(e));
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
      endDate: time
    });
  },
  onReady: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth-120;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    radarChart = new wxCharts({
      canvasId: 'radarCanvas',
      type: 'radar',
      categories: ['饮食', '服饰妆容', '生活日用', '住房缴费', '交通出行', '通讯'],
      series: [{
        name: '成交量1',
        data: [90, 110, 125, 95, 87, 122]
      }],
      width: windowWidth,
      height: 200,
      extra: {
        radar: {
          max: 200
        }
      }
    });
  }
});
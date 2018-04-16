var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var radarChart = null;
Page({
  data: {
  },
  touchHandler: function (e) {
    console.log(radarChart.getCurrentDataIndex(e));
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
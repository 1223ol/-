// Pie.js
// wxChart 柱状图
let app = getApp()

let WxChart = require('../../utils/wxcharts.js');
let Utils = require("../../utils/util.js");
let getChartInstances = WxChart.getChartInstances;
let tapHandlers = {};



Page({
  data: {
    labels:['饮食', '服饰妆容', '生活日用', '住房缴费', '交通出行', '通讯', '文教娱乐','健康','其他消费'],
    startDate: '2016-09-26',
    endDate: '2016-09-26',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  percentageFormatLabel:function (label, value, index, totalValue) {
    return label + ' (' + (value / totalValue * 100).toFixed(2) + '%)';
  },
  baseDoughnut : function(windowWidth){
    let wxPie = new WxChart.WxDoughnut('baseDoughnut', {
      width: windowWidth-25,
      height: 250,
      title: '  消费情况　',
      point: {
        format: this.percentageFormatLabel
      }
    });

    wxPie.update(Utils.dataGenerator(this.data.labels));

    return {
      chart: wxPie,
      redraw: () => {
        wxPie.update(Utils.dataGenerator(this.data.labels));
      }
    };
  },
  onReady: function () {
    let me = this;
    let windowWidth = 250
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      // do something when get system info failed
    }

    me.baseDoughnutChart = this.baseDoughnut(windowWidth);
    me.baseDoughnutChart.chart.once('draw', function (views) {
      me.baseDoughnutTapHandler = this.mouseoverTooltip(views);
    }, me.baseDoughnutChart.chart);

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
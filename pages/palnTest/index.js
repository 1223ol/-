// Line.js
// wxChart 线形图
let app = getApp()

let WxChart = require('../../utils/wxcharts.js');
let Utils = require("../../utils/util.js");

const labels = ['一月', '二月', '三月', '四月', '五月', '六月', '七月',
                '一月', '二月', '三月', '四月', '五月', '六月', '七月',
                '一月', '二月', '三月', '四月', '五月', '六月', '七月'
               ];

let multiLine = windowWidth => {
  let wxLiner = new WxChart.WxLiner('multiLine', {
    width: windowWidth,
    height: 250,
    title: '销售额',
    yScaleOptions: {
      position: 'left',
      title: '万元'
    },
    legends: [{
      text: '巧克力',
      key: 'chocolate'
    }, {
      text: '水果',
      key: 'fruit'
    }],
    tooltip: {
      model: 'axis'
    }
  });

  wxLiner.update(Utils.dataGenerator(labels, ['chocolate', 'fruit']));
  return {
    chart: wxLiner,
    redraw: () => {
      wxLiner.update(Utils.dataGenerator(labels, ['chocolate', 'fruit']));
    }
  };
};



Page({
  /**
   * 页面的初始数据
   */
  data: {},

  changeChart: function (e) {
    let canvasName = e.target.dataset.canvasName;
    let chart = this[canvasName + 'Chart'];
    chart.redraw();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let me = this;
    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      // do something when get system info failed
    }
    me.multiLineChart = multiLine(windowWidth);

    me.multiLineChart.chart.once('draw', function (views) {
      me.multiLineChartTapHandler = this.mouseoverTooltip(views);
    }, me.multiLineChart.chart);
  }
});
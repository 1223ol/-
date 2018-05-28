// Line.js
// wxChart 线形图
let app = getApp()

let WxChart = require('../../utils/wxcharts.js');
let Utils = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    labels: ['05-01', '05-02', '05-03', '05-04', '05-05',
            //  '05-06', '05-07', '05-08', '05-09', '05-10',
              // '05-11', '05-12', '05-13', '05-14', '05-15',
              // '05-16', '05-17', '05-18', '05-19', '05-20',
              // '05-21', '05-22', '05-23', '05-24', '05-25',
              // '05-26', '05-27', '05-28', '05-29', '05-30',
            ],

  },
  multiLine: function (windowWidth) {
    let wxLiner = new WxChart.WxLiner('multiLine', {
      width: windowWidth*0.85,
      // height: windowWidth*0.75,
      height:250,
      title: '金钱燃尽图',
      yScaleOptions: {
        position: 'left',
        title: '万元'
      },
      legends: [{
        text: '实际',
        key: 'chocolate',
        strokeStyle: '#ff0000'
      }, {
        text: '预计',
        key: 'fruit',
        strokeStyle: '#000000'
      }],
      tooltip: {
        model: 'axis'
      }
    });

    wxLiner.update(Utils.dataGenerator(this.data.labels, ['chocolate', 'fruit']));
    return {
      chart: wxLiner,
      // redraw: () => {
      //   wxLiner.update(Utils.dataGenerator(this.data.labels, ['chocolate', 'fruit']));
      // }
    };
  },

  changeChart: function (e) {
    // let canvasName = e.target.dataset.canvasName;
    // let chart = this[canvasName + 'Chart'];
    // chart.redraw();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let me = this;
    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth - 20;
    } catch (e) {
      // do something when get system info failed
    }
    me.multiLineChart = this.multiLine(windowWidth);

    me.multiLineChart.chart.once('draw', function (views) {
      me.multiLineChartTapHandler = this.mouseoverTooltip(views);
    }, me.multiLineChart.chart);
  }
});
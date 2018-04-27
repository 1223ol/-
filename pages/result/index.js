var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var myChart = null;
var chartData = {
    main: {
        title: '总成交量',
        data: [15, 20, 45, 37],
        categories: ['2012', '2013', '2014', '2015']
    },
    sub: [{
        title: '2012年度成交量',
        data: [70, 40, 65, 100, 34, 18],
        categories: ['1', '2', '3', '4', '5', '6']
    }, {
        title: '2013年度成交量',
        data: [55, 30, 45, 36, 56, 13],
        categories: ['1', '2', '3', '4', '5', '6']
    }, {
        title: '2014年度成交量',
        data: [76, 45, 32, 74, 54, 35],
        categories: ['1', '2', '3', '4', '5', '6']                
    }, {
        title: '2015年度成交量',
        data: [76, 54, 23, 12, 45, 65],
        categories: ['1', '2', '3', '4', '5', '6']
    }]
};
Page({
  data: {
    // array: ['雷达图', '扇形图', '柱状图','折线图'],
    array: ['雷达图', '扇形图'],
    categories: ['饮食', '服饰妆容', '生活日用', '住房缴费', '交通出行', '通讯'],
    index: "0",
    startDate: '2016-09-26',
    endDate: '2016-09-26',
    // radar=>雷达图 pie=>饼状图
    canvasData: [90, 110, 125, 95, 87, 122]
  },
  touchHandler: function (e) {
    console.log(myChart.getCurrentDataIndex(e));
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
    this.submit();
    // this.drawPip();
  },
  drawRadar: function () {
    var that = this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth - 120;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    myChart = new wxCharts({
      canvasId: 'myChart',
      type: 'radar',
      categories: that.data.categories,
      series: [{
        name: '成交量1',
        data: that.data.canvasData
      }],
      width: windowWidth,
      height: 200,
      extra: {
        radar: {
          max: 200
        }
      }
    });

  },
  drawPip: function () {
    var that = this;
    var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        myChart = new wxCharts({
            animation: true,
            canvasId: 'myChart',
            type: 'pie',
            series: [{
              name: that.data.categories[0],
              data: that.data.canvasData[0],
            }, {
                name: that.data.categories[1],
                data: that.data. canvasData[1],
            }, {
                name: that.data.categories[2],
                data: that.data.canvasData[2],
            } , {
              name: that.data.categories[3],
              data: that.data.canvasData[3],
            }, {
              name: that.data.categories[4],
              data: that.data.canvasData[4],
            }, {
              name: that.data.categories[5],
              data: that.data. canvasData[5],
            }
            ],
            width: windowWidth,
            height: 200,
            dataLabel: true,
        });

  },
  drawColumn:function(){
    var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
    myChart = new wxCharts({
            canvasId: 'myChart',
            type: 'column',
            animation: true,
            categories: chartData.main.categories,
            series: [{
                name: '成交量',
                data: chartData.main.data,
                format: function (val, name) {
                    return val.toFixed(2) + '万';
                }
            }],
            yAxis: {
                format: function (val) {
                    return val + '万';
                },
                title: 'hello',
                min: 0
            },
            xAxis: {
                disableGrid: false,
                type: 'calibration'
            },
            extra: {
                column: {
                    width: 15
                }
            },
            width: windowWidth,
            height: 200,
        });


  },
  drawLine:function(){
    var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        
        var simulationData = this.createSimulationData();
        myChart = new wxCharts({
            canvasId: 'myChart',
            type: 'line',
            categories: simulationData.categories,
            animation: true,
            // background: '#f5f5f5',
            series: [{
                name: '成交量1',
                data: simulationData.data,
                format: function (val, name) {
                    return val.toFixed(2) + '万';
                }
            }, {
                name: '成交量2',
                data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
                format: function (val, name) {
                    return val.toFixed(2) + '万';
                }
            }],
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                title: '成交金额 (万元)',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: windowWidth,
            height: 200,
            dataLabel: false,
            dataPointShape: true,
            extra: {
                lineStyle: 'curve'
            }
        });
  },
  listenerStartDatePickerSelected: function (e) {
    this.setData(
      {
        startDate: e.detail.value
      }
    );
  },
  listenerEndDatePickerSelected: function (e) {
    this.setData(
      {
        endDate: e.detail.value
      }
    );
  },
  submit: function (e) {
    var that = this;
    wx.request({
      url: 'http://127.0.0.1/result', //仅为示例，并非真实的接口地址
      data: {
        startDate: that.data.startDate,
        endDate: that.data.endDate
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var obj = res.data;
        console.log(obj.result);
        that.setData(
          {
            canvasData: obj.result
          }
        );
        console.log(that.data.index);
        switch(that.data.index){
          case "0": that.drawRadar();break;
          case "1": that.drawPip();break;
          case "2": that.drawColumn();break;
          default: that.drawLine();break;
        };
        
      }
    });

  },
  listenerPickerSelected:function(e){
    var that = this;
    console.log("listenerPickerSelected is invocked");
    this.setData({
      index: e.detail.value
    });
    switch (that.data.index) {
      case "0": that.drawRadar(); break;
      case "1": that.drawPip(); break;
      case "2": that.drawColumn(); break;
      default: that.drawLine(); break;
    };
  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  onReady: function (e) {
  }
});
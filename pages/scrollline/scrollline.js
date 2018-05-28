var wxCharts = require('../../utils/wxcharts1.js');
var app = getApp();
var lineChart = null;
var startPos = null;
Page({
    data: {
         labels: ['05-01', '05-02', '05-03', '05-04', '05-05',
             // '05-06', '05-07', '05-08', '05-09', '05-10',
              // '05-11', '05-12', '05-13', '05-14', '05-15',
              // '05-16', '05-17', '05-18', '05-19', '05-20',
              // '05-21', '05-22', '05-23', '05-24', '05-25',
              // '05-26', '05-27', '05-28', '05-29', '05-30',
            ],
        expectMoneys: [1200.0, 1161.29, 1122.58, 1083.87, 1045.16],
        realMoneys: [1200.0, 1200.0, 1200.0, 1200.0, 1200.0]
    },
    touchHandler: function (e) {
        lineChart.scrollStart(e);
    },
    moveHandler: function (e) {
        lineChart.scroll(e);
    },
    touchEndHandler: function (e) {
        lineChart.scrollEnd(e);
        lineChart.showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data 
            }
        });        
    },
    createData: function () {
        var that = this;
        wx.request({
          url: 'https://tally.slickghost.com/showPlan', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json' // 默认值
          },
           data: {
              cookie:app.globalData.cookie
            },
          success: function (res) {
            var obj = res.data;
            console.log(obj.result);
            that.setData(
              {
                labels: obj.labels,
                expectMoneys:obj.expectMoneys,
                realMoneys:obj.realMoneys

              }
            );
          }
        });
        var categories = that.data.labels;
        var expectMoneys = that.data.expectMoneys;
        var realMoneys = that.data.realMoneys;
        // console.log(that.data.labels);
        // for (var i = 0; i < that.data.labels.length; i++) {
        //     categories.push(that.data.labels[i]);
        //     expectMoneys.push(Math.random()*(20-10)+10);
        //     realMoneys.push(Math.random()*(20-10)+10);
        // }

        return {
            categories: categories,
            expectMoneys: expectMoneys,
            realMoneys:realMoneys
        }
    },
    onLoad: function (e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        
        var simulationData = this.createData();
        lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: simulationData.categories,
            animation: false,
            series: [{
                name: '预期剩余',
                data: simulationData.expectMoneys,
                format: function (val, name) {
                    return val.toFixed(2);
                }
                },{
                name: '实际剩余',
                data: simulationData.realMoneys,
                format: function (val, name) {
                    return val.toFixed(2);
                }
                }
            ],
            xAxis: {
                disableGrid: false
            },
            yAxis: {
                title: '余额(元)',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: windowWidth-30,
            height: 150,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
                lineStyle: 'curve'
            }
        });
    }
});
var wxCharts = require('../../utils/wxcharts1.js');
var app = getApp();
var lineChart = null;
var startPos = null;
Page({
    data: {
        labels: [1,2,3],
        expectMoneys: [3,2,1],
        realMoneys: [3,2.5,0]
    },
    addPlan:function(e){
        wx.navigateTo({
        url: '../addPlan/index'
      });
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
    draw:function(){
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: this.data.labels,
            animation: false,
            series: [{
                name: '预期剩余',
                data: this.data.expectMoneys,
                format: function (val, name) {
                    return val.toFixed(2);
                }
                },{
                name: '实际剩余',
                data: this.data.realMoneys,
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
    },
    onLoad: function (e) {
        var that = this;
        wx.request({
          url: 'https://tally.slickghost.com/showPlan', //仅为示例，并非真实的接口地址
          data: {
            cookie:app.globalData.cookie
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("success");
            var obj = res.data;
            console.log(obj.expectMoneys);
            that.setData({
                labels:obj.labels,
                expectMoneys:obj.expectMoneys,
                realMoneys:obj.realMoneys,
            });
            console.log("setData complete");
          },
          complete:function(res){  
              that.draw();
          }
        });
        console.log("onLoad complete");
    },
  onReady:function () {
    // console.log("onRead start")
    // console.log(this.data.expectMoneys);
      
  },
  onShow:function () {
    this.onLoad();
  }
});
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
    // labels: ['饮食','服饰妆容'],
    Moneys:[100],
    startDate: '2016-09-26',
    endDate: '2016-09-26',
  },
  onLoad: function (options) {
    var that = this;
    var util = require('../../utils/util.js');
    var time = util.formatDate(new Date());
    // var  nextMonth = util.formatDateaddMonth(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      startDate: time,
      endDate: time,
    });

    wx.request({
      url: 'https://tally.slickghost.com/result', //仅为示例，并非真实的接口地址
      data: {
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        cookie:app.globalData.cookie
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var obj = res.data;
        console.log(obj.result);
        that.setData(
          {
            Moneys: obj.result
          }
        );
      },
      complete:function(){
        that.draw();
      }
    });



  },
  percentageFormatLabel:function (label, value, index, totalValue) {
    return label + ' (' + (value / totalValue * 100).toFixed(2) + '%)';
  },
  indexOf:function(arr){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == 0){return i;}
        }
        return -1;
   },
  remove:function (){
        var index = 0;
        var l = this.data.labels;
        var m = this.data.Moneys;
        console.log("======================");
        console.log(m);
        console.log(l);
        console.log("========================");
        while(index != -1){
          // console.log(m);
          // console.log(l);
          index = this.indexOf(m);
          // console.log(index);
          // console.log("-----------");
          if (index > -1){
          m.splice(index,1);
          l.splice(index,1);
          }
        }

        this.setData({
          labels:l,
          Moneys:m
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
    this.onReady();
  },
  getData : function(labels,Moneys,){
        // console.log(labels);
        // console.log(expectMoneys);
        // console.log(realMoneys);
        let d = [];
        for(let index = 0,len=labels.length; index < len; index++) {
            var myArray=new Array()
            myArray['label'] = labels[index];
            myArray['value'] = Moneys[index];
            d[index] = myArray;
        }
        return d;
    },
  baseDoughnut : function(windowWidth){
    let wxPie = new WxChart.WxDoughnut('baseDoughnut', {
      width: windowWidth-25,
      height:350,
      title: '  消费情况　',


      point: {
        format: this.percentageFormatLabel
      }
    });
    console.log(this.data.labels);
    console.log(this.data.Moneys);
    this.remove();
    // console.log(this.remove(this.data.Moneys));
    // console.log(this.getData(this.data.labels,this.data.Moneys));
    wxPie.update(this.getData(this.data.labels,this.data.Moneys));

    return {
      chart: wxPie,
      redraw: () => {
        wxPie.update(this.getData(this.data.labels,this.data.Moneys));
      }
    };
  },
  draw: function () {
    let me = this;
    let windowWidth = 350;
    var that = this;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      // do something when get system info failed
    };
    
    // console.log("--------------->");
    // console.log(this.data.Moneys);
    // console.log(this.data.labels);
    // console.log("<---------------");
        me.baseDoughnutChart = me.baseDoughnut(windowWidth);
        me.baseDoughnutChart.chart.once('draw', function (views) {
          me.baseDoughnutTapHandler = this.mouseoverTooltip(views);
        }, me.baseDoughnutChart.chart);

  },
  onShow: function () {
    // this.onReady();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
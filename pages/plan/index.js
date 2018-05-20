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
        labels : ['1号', '2号', '3号', '4号'],
        expectMoneys : [30,20,10,1],
        realMoneys : [1,10,20,30]
    },
    multiLine : function(windowWidth){
        let data = this.getData(this.data.labels,this.data.expectMoneys,this.data.realMoneys);
        console.log(data);
        let wxLiner = new WxChart.WxLiner('multiLine', {
            width: windowWidth/1.5,
            height: 250,
            title:'                    金钱燃尽图',
            yScaleOptions: {
                position: 'left',
                title: '剩余金钱(元)'
            },
            legends: [{
                text: '预期花费',
                key: 'expectMoney'
            }, {
                text: '实际花费',
                key: 'realMoney'
            }],
            tooltip: {
              model: 'axis'
            }
        });
        wxLiner.update(data);
        return {
            chart: wxLiner,
            redraw: () => {
                wxLiner.update(data);
                    }
        };
    },


    /**
    获取数据
    */
    getData : function(labels,expectMoneys,realMoneys){
        // console.log(labels);
        // console.log(expectMoneys);
        // console.log(realMoneys);
        let d = [];
        for(let index = 0,len=labels.length; index < len; index++) {
            var myArray=new Array()
            myArray['label'] = labels[index];
            myArray['expectMoney'] = expectMoneys[index];
            myArray['realMoney'] = realMoneys[index];
            d[index] = myArray;
        }
        return d;
    },
    changeChart: function (e) {
        
        let canvasName = e.target.dataset.canvasName;
        let chart = this[canvasName + 'Chart'];
        chart.redraw();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // console.log();
        let me = this;
        let windowWidth = 320;
        try {
            let res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
            console.log(windowWidth);
        } catch (e) {
            // do something when get system info failed
        }
        me.multiLineChart = me.multiLine(windowWidth);
        me.multiLineChart.chart.once('draw', function (views) {
          me.multiLineChartTapHandler = this.mouseoverTooltip(views);
        }, me.multiLineChart.chart);
    }
});
var app = getApp();
Page({
  data: {
    selectDate: "",
    dayList: '',
    currentDayList: '',
    currentObj: '',
    currentDay: '',
    isSet:0,
    consumption: 0,
    balance: 0,
    inPlan:0,
    options:0
  },
  onLoad: function (options) {
    console.log("index onload");
    var that = this;
    var currentObj = that.getCurrentDayString();
    this.setData({
      options:options,
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' ,
      selectDate: currentObj.getDate(),
      currentObj: currentObj
    })
  this.setSchedule(currentObj);
    app.getAuthKey().then(function (res) {
      console.log("login over");
  wx.request({
        url: 'https://tally.slickghost.com/',
        data: {
          year: that.data.currentObj.getFullYear(),
          month: that.data.currentObj.getMonth() + 1,
          date: currentObj.getDate(),
          cookie:app.globalData.cookie
        },
        header: {
          'content-type': 'application/json' 
        },
        success: function (res) {
          var obj = res.data;
          that.setData({
            consumption: obj.consumption,
            balance: obj.balance,
            inPlan: obj.inPlan,
            isSet: obj.isSet
          });
        }
      });
});
  },
  doDay: function (e) {
    var that = this
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = currentObj.getDate();
    var str = ''
    if (e.currentTarget.dataset.key == 'left') {
      m -= 1
      if (m <= 0) {
        str = (Y - 1) + '/' + 12 + '/' + d
      } else {
        str = Y + '/' + m + '/' + d
      }
    } else {
      m += 1
      if (m <= 12) {
        str = Y + '/' + m + '/' + d
      } else {
        str = (Y + 1) + '/' + 1 + '/' + d
      }
    }
    currentObj = new Date(str)
    this.setData({
      currentDate: currentObj.getFullYear() + '年' + (currentObj.getMonth() + 1) + '月' ,
      currentObj: currentObj,

    })
    this.setSchedule(currentObj);
  },
  getCurrentDayString: function () {
    var objDate = this.data.currentObj
    if (objDate != '') {
      return objDate
    } else {
      var c_obj = new Date()
      var a = c_obj.getFullYear() + '/' + (c_obj.getMonth() + 1) + '/' + c_obj.getDate()
      return new Date(a)
    }
  },
  jumpToBill: function (event) {
    var that = this;
    console.log(event.currentTarget.id);
    wx.navigateTo({
      url: '../showBill/index?year=' + that.data.currentObj.getFullYear() + '&month=' + (that.data.currentObj.getMonth() + 1) + "&date=" + event.currentTarget.id
    })

  },
  tapName: function (event) {
    var that = this;
    if (event.currentTarget.id != '') {
      wx.request({
        url: 'https://tally.slickghost.com/', //仅为示例，并非真实的接口地址
        data: {
          year: that.data.currentObj.getFullYear(),
          month: that.data.currentObj.getMonth() + 1,
          date: event.currentTarget.id,
          cookie:app.globalData.cookie
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          var obj = res.data;
          that.setData({
            selectDate: event.currentTarget.id,
            consumption: obj.consumption,
            balance: obj.balance,
            inPlan:obj.inPlan,
            isSet:obj.isSet
          });
          // console.log("-------------");
          // console.log(that.data.isSet);
          // console.log(that.data.inPlan);
          // console.log("-------------");
        }
      });
    }
  },
  setSchedule: function (currentObj) {
    var that = this
    var m = currentObj.getMonth() + 1
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '/' + m + '/' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 2);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = []
    var f = 0
    for (var i = 0; i < 42; i++) {
      let data = []
      if (i < firstKey - 1) {
        currentDayList[i] = '';
      } else {
        if (f < currentDayNum) {
          currentDayList[i] = f + 1;
          f = currentDayList[i];
        } else if (f >= currentDayNum) {
          currentDayList[i] = ''
        }
      }
    }
    that.setData({
      currentDayList: currentDayList
    })
  },
  onShow:function(){
    this.onLoad(this.data.options);
  }
})
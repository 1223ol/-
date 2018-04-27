//app.js
App({
  onLaunch: function () {
      wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code);
          wx.request({
            url: 'http://127.0.0.1/login', //仅为示例，并非真实的接口地址
            data: {
              js_code:res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              var app = getApp();
              var obj = res.data;
              app.globalData.cookie = obj.openid;
        }
      });

        }
      }
    });
  },
  globalData:{
  cookie:''
  }
})
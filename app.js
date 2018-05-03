App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    // var that = this;
  },
  getAuthKey: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
        // 调用登录接口
        wx.login({
          success: function (res) {
            if (res.code) {
              console.log(res.code);
              wx.request({
                url: 'https://tally.slickghost.com/login', //仅为示例，并非真s实的接口地址
                data: {
                  js_code: res.code
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log("sucess");
                  var app = getApp();
                  var obj = res.data;
                  app.globalData.cookie = obj.openid;
                  var res = {
                    status: 200,
                  }
                  resolve(res);
                }
              });
            } else {
              console.log('获取用户登录态失败！' + res.errMsg);
              var res = {
                status: 300,
                data: '错误'
              }
              reject('error');
            }  
          }
        })
    });
  },
globalData:{
  cookie:''
}
});
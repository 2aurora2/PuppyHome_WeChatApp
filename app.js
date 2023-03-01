// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log(res.code)
          var that = this;
          wx.request({
            url: 'http://localhost:3000/wx/login', //将res.code发送到服务器地址
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: res.code
            },
            success(res) {
              wx.setStorageSync('token', res.data.data.token); //将返回的token存入本地缓存
              console.log(res.data.data.token);
              if (res.data.data.hasObj) {
                that.globalData.hasEvenLogin = true;
                //调用接口获取用户信息
                wx.request({
                  url: 'http://localhost:3000/user/get/info', //用户存在用于获取其信息的接口
                  method: 'GET',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    token: wx.getStorageSync('token')
                  },
                  success(res) {
                    that.globalData.userInfo = res.data.data.user; //存储用户信息
                    console.log(res.data.data.user);
                  }
                })
              } else {
                that.globalData.hasEvenLogin = false;
              }
            }
          })
        }
      },
      fail: res => {
        console.log('Login Failed', res.msg)
      }
    })
  },
  globalData: {
    userInfo: null,
    hasEvenLogin: null
  }
})
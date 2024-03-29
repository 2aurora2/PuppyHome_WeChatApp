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
          // console.log(res.code)
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
              // console.log(res.data.data.token);
              // console.log(res.data.data.hasObj);
              // console.log(res.data.data.hasObj === "true");
              if (res.data.data.hasObj === "true") {
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
                    // that.globalData.userInfo = res.data.data.user; //存储用户信息
                    var userObj = res.data.data.user;
                    // console.log(userObj)
                    userObj['haveNewMsg'] = res.data.data.haveNewMsg;
                    // console.log(userObj)
                    that.globalData.userInfo = userObj;
                    // console.log(res.data.data.user);
                  },
                  fail(res) {
                    // console.log(res);
                  }
                })
              } else {
                that.globalData.hasEvenLogin = false;
                // 默认用户信息
                that.globalData.userInfo = {
                  "nickName": "wx_user",
                  "avatar": that.globalData.cdnHost + "userinfo/defaultAvatar.png",
                  "realName": "wx_user",
                  "age": 100,
                  "gender": 1,
                  "telephone": "12345678910",
                  "authentication": 0, //用户身份默认为普通用户("0")
                  "haveNewMsg" : "false"
                }
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
    userInfo: {},
    hasEvenLogin: null,
    cdnHost: "https://exampleBucket-111111111.cos.ap-guangzhou.myqcloud.com/"
  }
})
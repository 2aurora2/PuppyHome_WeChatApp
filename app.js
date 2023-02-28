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
        if(res.code){
          wx.request({
            url: 'https://localhost:3000/wx/login',//服务器接口地址
            method: 'POST',//请求方式
            header:{
              'content-type':'application/x-www-form-urlencoded'
            },
            data:{
              code: res.code
            },
            success(res){
              wx.setStorageSync('token',res.data.token)
            }
          })
        }
      },
      fail:res=>{
        console.log('Login Failed',res.msg)
      }
    })
  },
  globalData: {
    userInfo: null
  }
})

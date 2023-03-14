Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  onLoad(options) {
    
  },
  onShow() {
    setTimeout(function () {
      wx.switchTab({
        url: "/pages/home/home",
      })
    }, 1500)
  }
})
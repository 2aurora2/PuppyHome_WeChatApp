Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  onShow() {
    setTimeout(function () {
      wx.switchTab({
        url: "/pages/home/home",
      })
    }, 1800)
  }
})
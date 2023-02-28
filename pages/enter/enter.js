Page({
  data: {

  },

  onLoad(options) {

  },

  onReady() {

  },

  onShow() {
    setTimeout(function () {
      wx.switchTab({
        url: "/pages/home/home",
      })
    }, 3000)
  }
})
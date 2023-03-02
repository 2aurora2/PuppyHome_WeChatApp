const app = getApp();

Page({
  data: {
    AvatarUrl: app.globalData.userInfo.avatar,
    bordeStyle: "",
  },
  onLoad() {
    // 用户身份标识
    if (app.globalData.userInfo.authentication == 0) {
      this.setData({
        bordeStyle: "5px lightslategray solid" //普通用户“灰色”标识
      })
    } else if (app.globalData.userInfo.authentication == 1) {
      this.setData({
        bordeStyle: "5px deepskyblue solid" //管理员“蓝色”标识
      })
    } else if (app.globalData.userInfo.authentication == 2) {
      this.setData({
        bordeStyle: "5px firebrick solid" //超级管理员“红色”标识
      })
    }
  }
})
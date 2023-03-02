// pages/home/home.js
const app = getApp();
Page({
  data: {
    background: [{
        id: 0,
        url: app.globalData.cdnHost + "swiper/img01.jpg"
      },
      {
        id: 1,
        url: app.globalData.cdnHost + "swiper/img02.jpg"
      },
      {
        id: 2,
        url: app.globalData.cdnHost + "swiper/img03.jpg"
      },
      {
        id: 3,
        url: app.globalData.cdnHost + "swiper/img04.jpg"
      },
    ],
    btns: [{
      text: "前往"
    }],
    dialogText: "首次登录请前往完善个人信息",
    isshow: ""
  },
  onLoad() {
    this.setData({
      isshow: app.globalData.hasEvenLogin
    })
  },
  ToSetUserInfo() {
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/setUserInfo/setUserInfo",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  }
})
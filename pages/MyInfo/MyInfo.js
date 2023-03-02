const app = getApp();

Page({
  data: {
    AvatarUrl: "",
    bordeStyle: "",
  },
  onLoad() {
    // 用户身份标识
    console.log(app.globalData.userInfo.avatar)
    if (app.globalData.userInfo.authentication == 0) {
      this.setData({
        AvatarUrl: app.globalData.userInfo.avatar,
        bordeStyle: "5px lightslategray solid" //普通用户“灰色”标识
      })
    } else if (app.globalData.userInfo.authentication == 1) {
      this.setData({
        AvatarUrl: app.globalData.userInfo.avatar,
        bordeStyle: "5px deepskyblue solid" //管理员“蓝色”标识
      })
    } else if (app.globalData.userInfo.authentication == 2) {
      this.setData({
        AvatarUrl: app.globalData.userInfo.avatar,
        bordeStyle: "5px firebrick solid" //超级管理员“红色”标识
      })
    }
  },
  ToSetUserInfo(){
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/setUserInfo/setUserInfo",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  ToMySelect(){
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/mySelect/mySelect",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  ToMyPublish(){
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/myPublish/myPublish",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  ToPublishManaga(){
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/PublishManaga/PublishManaga",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  ToApplyForAdmin(){
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/applyForAdmin/applyForAdmin",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  ToAdminAudit(){
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/adminAudit/adminAudit",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  ToAdminManage(){
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/adminManage/adminManage",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  ToAboutUs(){
    wx.navigateTo({
      url: "/pages/MyInfoSubPages/aboutUs/aboutUs",
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res)
      }
    })
  }
})
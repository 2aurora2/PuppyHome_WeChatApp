Page({
  data: {
    currentItemId: null,
    dialogText: "是否确认删除此管理员？",
    isShowDialog: false,
    btn: [{
      type: "warn",
      text: "移除",
      data: null
    }],
    btns: [{
      text: "确认"
    }, {
      text: "取消"
    }],
    adminList: [],
    length: 0
  },
  onLoad() {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/admin/general',
      method: "GET",
      data: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        that.setData({
          adminList: res.data.data.generalAdmin,
          length: res.data.data.generalAdmin.length
        })
      },
      fail(res) {
        // console.log(res.errMsg)
      }
    })
  },
  // 是否确认删除的弹窗
  CheckSureDelete(e) {
    this.setData({
      isShowDialog: true,
      currentItemId: e.currentTarget.dataset.id
    })
  },
  ChooseRes(e) {
    if (e.detail.item.text === "取消") {
      this.setData({
        isShowDialog: false
      })
    } else {
      var that = this;
      wx.request({
        url: 'http://localhost:3000/apply/delete/admin',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          userId: that.data.currentItemId
        },
        success(res) {
          that.onLoad();
          that.setData({
            isShowDialog: false
          });
        },
        fail(res) {
          that.onLoad();
          that.setData({
            isShowDialog: false
          });
        }
      })
    }
  }
})
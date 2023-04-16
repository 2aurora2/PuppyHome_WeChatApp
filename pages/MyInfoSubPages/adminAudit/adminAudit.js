Page({
  data: {
    applicators: [],
    length: 0
  },
  onLoad() {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/apply/show/all',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        that.setData({
          applicators: res.data.data.applications
        })
        // 新增属性isshow初始化为false不展示
        var applyArray = that.data.applicators;
        for (var i = 0; i < applyArray.length; i++) {
          applyArray[i].isshow = false;
          applyArray[i].iconUrl = "/image/MyInfo/down.png";
        }
        that.setData({
          applicators: applyArray,
          length: applyArray.length
        })
      },
      fail(res) {
        // console.log(res.errMsg)
      }
    })
  },
  //折叠展开
  ShowDetails(e) {
    var applyArray = this.data.applicators;
    for (var i = 0; i < applyArray.length; i++) {
      if (applyArray[i].id === e.currentTarget.dataset.id) {
        if (applyArray[i].isshow === false) {
          applyArray[i].isshow = true;
          applyArray[i].iconUrl = "/image/MyInfo/up.png"
        } else {
          applyArray[i].isshow = false;
          applyArray[i].iconUrl = "/image/MyInfo/down.png"
        }
        break;
      }
    }
    this.setData({
      applicators: applyArray
    })
  },
  // 接受申请Func
  acceptApply(e) {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/apply/accept',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        userId: e.currentTarget.dataset.id
      },
      success(res) {
        that.onLoad();
      },
      fail(res) {
        // console.log(res)
      }
    })
  },
  // 拒绝申请Func
  rejectApply(e) {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/apply/reject',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        userId: e.currentTarget.dataset.id
      },
      success(res) {
        //console.log(res);
        that.onLoad();
      },
      fail(res) {
        // console.log(res)
      }
    })
  }
})
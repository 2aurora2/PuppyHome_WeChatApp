Page({
  data: {
    adopters: [{
      id: 0,
      avatar: "https://puppyhome-1317060763.cos.ap-guangzhou.myqcloud.com/userinfo/test01.jpg",
      realName: "疯狂的麦吉",
      telephone: "12345678910",
      articleTitle: "有没有人来领养拉布拉多呀！很可爱噢~"
    }],
    numOfAdopter: 1,
    currentAdopter: null,
    agreeBtns: [{
      text: "考虑一下"
    }, {
      text: "拒绝"
    }, {
      text: "同意"
    }],
    agreeTxt: "是否同意此用户领养？",
    isShowAgreeDiglog: false
  },
  onLoad() {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/adopt/show',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        var getMsg = res.data.data.adopt;
        var finalList = [];
        for (var i = 0; i < getMsg.length; ++i) {
          var obj = {};
          obj['id'] = getMsg[i].id;
          obj['avatar'] = getMsg[i].user.avatar;
          obj['realName'] = getMsg[i].user.realName;
          obj['telephone'] = getMsg[i].user.telephone;
          obj['articleTitle'] = getMsg[i].article.title;
          finalList.push(obj);
        }
        that.setData({
          adopters: finalList
        });
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  agreeAdoptHandle(e) {
    if (e.detail.index === 0) {
      this.setData({
        isShowAgreeDiglog: false
      })
    } else if (e.detail.index === 1) {
      // 拒绝领养
      var that = this;
      wx.request({
        url: 'http://localhost:3000/adopt/ignore',
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          adoptId: currentAdopter
        },
        success(res) {
          that.setData({
            isShowAgreeDiglog: false
          });
          that.onLoad();
        },
        fail(res) {
          console.log(res)
        }
      })
    } else {
      // 同意领养
      var that = this;
      wx.request({
        url: 'http://localhost:3000/adopt/accept',
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          adoptId: currentAdopter
        },
        success(res) {
          that.setData({
            isShowAgreeDiglog: false
          });
          that.onLoad();
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  },
  isOrNotAgreeAdopt(e) {
    this.setData({
      isShowAgreeDiglog: true,
      currentAdopter: e.currentTarget.dataset.idx
    })
  }
})
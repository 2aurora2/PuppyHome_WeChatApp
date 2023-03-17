Page({
  data: {
    adopters: [],
    numOfAdopter: 0,
    currentAdopters: [],
    currentNum: 0,
    perShow: 8,
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
          adopters: finalList,
          numOfAdopter: finalList.length
        });
        if (that.data.adopters != []) {
          // 页面懒加载逻辑
          var currentList = that.data.currentAdopters;
          var currentN = that.data.currentNum;
          if (that.data.adopters.length < that.data.perShow) {
            that.setData({
              currentAdopters: that.data.adopters,
              currentNum: that.data.adopters.length
            })
          } else {
            for (var i = currentN; i < currentN + that.data.perShow; i++) {
              currentList.push(that.data.adopters[i])
            }
            that.setData({
              currentAdopters: currentList,
              currentNum: currentN + that.data.perShow
            })
          }
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  // 上拉触底lazy load
  onReachBottom() {
    var currentList = this.data.currentAdopters;
    var currentN = this.data.currentNum;
    if (this.data.adopters.length - currentList.length < this.data.perShow) {
      this.setData({
        currentAdopters: this.data.adopters,
        currentNum: this.data.adopters.length
      })
    } else {
      for (var i = currentN; i < currentN + this.data.perShow; i++) {
        currentList.push(this.data.adopters[i])
      }
      this.setData({
        currentAdopters: currentList,
        currentNum: currentN + this.data.perShow
      })
    }
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
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          adoptId: that.data.currentAdopter
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
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          adoptId: that.data.currentAdopter
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
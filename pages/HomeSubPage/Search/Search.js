var util = require("../../../utils/util.js")

Page({
  data: {
    subType: "",
    articleList: [],
    currentArticleList: [],
    currentNum: 0,
    perShow: 8,
    haveSearch: false
  },
  getSubType(e) {
    this.setData({
      subType: e.detail.value
    })
  },
  getSearchResult() {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/search/article',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        subType: that.data.subType
      },
      success(res) {
        var articles = res.data.data.articles;
        var dogs = res.data.data.dogs;
        var finalList = [];
        for (var i = 0; i < articles.length; i++) {
          var obj = {};
          obj['id'] = articles[i].id;
          obj['title'] = articles[i].title;
          var tmpTime = articles[i].publishTime;
          obj['publishTime'] = util.js_date_time(tmpTime / 1000); // 时间戳转换
          obj['photo'] = dogs[i].photo;
          finalList.push(obj);
        }
        that.setData({
          articleList: finalList,
          haveSearch: true
        })
        if (that.data.articleList != []) {
          // 页面懒加载逻辑
          var currentList = that.data.currentArticleList;
          var currentN = that.data.currentNum;
          if (that.data.articleList.length < that.data.perShow) {
            that.setData({
              currentArticleList: that.data.articleList,
              currentNum: that.data.articleList.length
            })
          } else {
            for (var i = currentN; i < currentN + that.data.perShow; i++) {
              currentList.push(that.data.articleList[i])
            }
            that.setData({
              currentArticleList: currentList,
              currentNum: currentN + that.data.perShow
            })
          }
        }
      }
    })
  },
  // 上拉触底lazy load
  onReachBottom() {
    var currentList = this.data.currentArticleList;
    var currentN = this.data.currentNum;
    if (this.data.articleList.length - currentList.length < this.data.perShow) {
      this.setData({
        currentArticleList: this.data.articleList,
        currentNum: this.data.articleList.length
      })
    } else {
      for (var i = currentN; i < currentN + this.data.perShow; i++) {
        currentList.push(this.data.articleList[i])
      }
      this.setData({
        currentArticleList: currentList,
        currentNum: currentN + this.data.perShow
      })
    }
  }
})
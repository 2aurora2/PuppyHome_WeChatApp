var util = require("../../utils/util.js")
const app = getApp();
Page({
  data: {
    background: [{
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
    isshow: "",
    articleList: [],
    currentArticleList: [],
    currentNum: 0,
    perShow: 3
  },
  onLoad() {
    this.setData({
      isshow: app.globalData.hasEvenLogin
    });
    var that = this;
    // 请求文章列表数据
    wx.request({
      url: 'http://localhost:3000/article/except',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token')
      },
      success(res) {
        var articles = res.data.data.articles;
        var dogs = res.data.data.dogs;
        var finalList = [];
        for (var i = 0; i < articles.length; i++) {
          var obj = {};
          obj['id'] = articles[i].id;
          obj['title'] = articles[i].title;
          obj['publishTime'] = util.js_date_time(articles[i].publishTime); // 时间戳转换
          obj['photo'] = dogs[i].photo;
          finalList.push(obj);
        }
        that.setData({
          articleList: finalList
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
  },
  ToSetUserInfo() {
    this.setData({
      isshow: true
    })
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
  ToPublish() {
    wx.navigateTo({
      url: "/pages/HomeSubPage/Publish/Publish"
    })
  },
  ToSearch() {
    wx.navigateTo({
      url: "/pages/HomeSubPage/Search/Search"
    })
  },
  ToIdentify() {
    wx.navigateTo({
      url: "/pages/HomeSubPage/Identify/Identify"
    })
  },
  getArticleDetails(e){
    wx.navigateTo({
      url: '/pages/HomeSubPage/ArticleDetails/ArticleDetails?id='+e.currentTarget.dataset.id,
    })
  }
})
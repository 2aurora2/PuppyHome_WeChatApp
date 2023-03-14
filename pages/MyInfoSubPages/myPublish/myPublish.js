var util = require("../../../utils/util.js");
Page({
  data: {
    adoptedList:[],
    unAdoptedList:[],
    currentAdopt: 0,
    currentUnAdopt: 0
  },
  onShow() {
    var that = this;
    // 拿到未被领养的公告列表
    wx.request({
      url: 'http://localhost:3000/article/mine/unadopted',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token')
      },
      success(res){
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
          unAdoptedList: finalList,
          currentUnAdopt: finalList.length
        })
      },
      fail(res){
        console.log(res)
      }
    }),
    // 拿到已被领养的公告列表
    wx.request({
      url: 'http://localhost:3000/article/mine/adopted',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token')
      },
      success(res){
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
          adoptedList: finalList,
          currentAdopt: finalList.length
        })
        console.log(that.data.adoptedList)
      },
      fail(res){
        console.log(res)
      }
    })
  },
  getArticleDetails(e) {
    wx.navigateTo({
      url: '/pages/HomeSubPage/ArticleDetails/ArticleDetails?id=' + e.currentTarget.dataset.id + "&isOwner=true"
    })
  }
})
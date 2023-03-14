var util = require("../../../utils/util.js");
Page({
  data: {
    adoptedList:[{
      id: 1,
      title: "有没有人来领养拉布拉多呀！很可爱噢~",
      photo: "https://puppyhome-1317060763.cos.ap-guangzhou.myqcloud.com/swiper/img04.jpg",
      publishTime: "2023-3-8 20:04:30"
    }],
    unAdoptedList:[],
    currentAdopt: null,
    currentUnAdopt: null
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
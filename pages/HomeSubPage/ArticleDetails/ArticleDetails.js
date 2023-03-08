Page({
  data: {
    articleId: null,
    articleDetails: {}
  },
  onLoad(options) {
    this.setData({
      articleId: options.id
    })
    var that = this;
    wx.request({
      url: 'url',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id : that.data.articleId
      },
    })
  },
})
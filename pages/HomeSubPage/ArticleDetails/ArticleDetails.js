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
  },
})
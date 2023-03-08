const pageTitle = '<h1 style="color: #708090">领养公告</h1>'
// articleDetails测试
// title: "有没有人来领养拉布拉多呀！真的很可爱噢~",
// publishTime: "2023-3-8 20:04:30",
// description: "这只狗陪伴我很多年了，我很舍不得，但是因为我个人的原因不得不将其托付给其他人抚养，我希望找到一个温柔、负责的人来成为它的新主人，如果你有意愿的话请通过此平台的领养功能，我会在收到消息后和你联系，说明详细情况，以下是拉布拉多的详细信息，各位可以先看看"

// dogsDetails测试
// dogName: "哈尼",
// photo: "https://puppyhome-1317060763.cos.ap-guangzhou.myqcloud.com/dogs/labuladuo.png",
// gender: 1,
// age: 4,
// type: "拉布拉多"
Page({
  data: {
    pageTitle,
    articleId: null,
    articleDetails: {},
    dogsDetails: {},
    dogAge: "",
    dogGender: "",
    genderList: ['雌性', '雄性'],
    ageList: ['不确定', '1岁以下', '1岁', '2岁', '3岁', '4岁', '5岁', '6岁', '7岁', '8岁', '9岁', '10岁', '10岁以上'],
  },
  onLoad(options) {
    this.setData({
      articleId: options.id
    })
    var that = this;
    wx.request({
      url: 'http://localhost:3000/article/msg',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        articleId: that.data.articleId
      },
      success(res) {
        that.setData({
          articleDetails: res.data.data.article,
          dogsDetails: res.data.data.dog,
          dogAge: that.data.ageList[res.data.data.dog[age]],
          dogGender: that.data.genderList[res.data.data.dog[gender]],
        })
      }
    })
  },
  getImageDetail() {
    var that = this;
    wx.previewImage({
      urls: [that.data.dogsDetails.photo],
    })
  }
})
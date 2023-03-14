const app = getApp()
var util = require("../../../utils/util.js")
// 前后端测试无误后把测试数据都删除
Page({
  data: {
    tips: "确认领养后，送养人会在“我的消息”中得到领养人的相关信息（姓名、电话），请送养人在联系到满意的领养人后在“我的消息”中进行“同意”或“拒绝”选择,便于后台进行数据的处理",
    articleId: null,
    articleDetails: {
      title: "有没有人来领养拉布拉多呀！真的很可爱噢~",
      publishTime: "2023-3-8 20:04:30",
      description: "这只狗陪伴我很多年了，我很舍不得，但是因为我个人的原因不得不将其托付给其他人抚养，我希望找到一个温柔、负责的人来成为它的新主人，如果你有意愿的话请通过此平台的领养功能，我会在收到消息后和你联系，说明详细情况，以下是拉布拉多的详细信息，各位可以先看看"
    },
    dogsDetails: {
      dogName: "哈尼",
      photo: "https://puppyhome-1317060763.cos.ap-guangzhou.myqcloud.com/swiper/img04.jpg",
      gender: 1,
      age: 4,
      type: "拉布拉多"
    },
    dogAge: "年龄不详",
    dogGender: "雄性",
    genderList: ['雌性', '雄性'],
    ageList: ['年龄不详', '1岁以下', '1岁', '2岁', '3岁', '4岁', '5岁', '6岁', '7岁', '8岁', '9岁', '10岁', '10岁以上'],
    isShowDelete: false,
    isCollect: false,
    isConfirmDelete: false,
    isConfirmAdopt: false,
    collectUrl: "/image/Home/icons/noCollect.png",
    collectTxt: "收藏",
    btns: [{
      text: "取消"
    }, {
      text: "确认"
    }],
    adoptBtns: [{
      text: "确认"
    }],
    deleteDialogText: "是否确认删除此领养公告？",
    adoptDialogText: "是否向送养人发送领养意愿？",
    error: "请勿重复提交领养申请！",
    isShowError: false,
    success: "成功发送领养申请！",
    isShowSuccess: false,
    isOwner: null
  },
  onLoad(options) {
    console.log(options);
    this.setData({
      articleId: options.id,
      isOwner: JSON.parse(options.isOwner)
    })
    // 删除按钮展示与否
    if (app.globalData.userInfo.authentication === 1 || app.globalData.userInfo.authentication === 2) {
      this.setData({
        isShowDelete: true
      })
    }
    var that = this;
    wx.request({
      url: 'http://localhost:3000/article/msg',
      method: "GET",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        articleId: that.data.articleId
      },
      success(res) {
        that.setData({
          articleDetails: res.data.data.article,
          dogsDetails: res.data.data.dog,
          dogAge: that.data.ageList[res.data.data.dog.age],
          dogGender: that.data.genderList[res.data.data.dog.gender],
          isCollect: res.data.data.isCollect
        });
        var tmpArticleDetails = that.data.articleDetails;
        tmpArticleDetails.publishTime = util.js_date_time(tmpArticleDetails.publishTime / 1000);
        console.log(tmpArticleDetails);
        that.setData({
          articleDetails: tmpArticleDetails
        });
        // 收藏与否展示
        if (that.data.isCollect === true) {
          that.setData({
            collectUrl: "/image/Home/icons/evenCollect.png",
            collectTxt: "已收藏"
          })
        } else {
          that.setData({
            collectUrl: "/image/Home/icons/noCollect.png",
            collectTxt: "收藏"
          })
        }
      }
    })
  },
  getImageDetail() {
    var that = this;
    wx.previewImage({
      urls: [that.data.dogsDetails.photo],
    })
  },
  collectHandle() {
    var that = this;
    if (that.data.isCollect === false) {
      // 添加收藏wx.request
      wx.request({
        url: 'http://localhost:3000/collect/add',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          articleId: that.data.articleId
        },
        success(res) {
          console.log(res);
          that.setData({
            isCollect: true,
            collectUrl: "/image/Home/icons/evenCollect.png",
            collectTxt: "已收藏"
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    } else {
      // 取消收藏wx.request
      wx.request({
        url: 'http://localhost:3000/collect/delete',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          articleId: that.data.articleId
        },
        success(res) {
          console.log(res);
          that.setData({
            isCollect: false,
            collectUrl: "/image/Home/icons/noCollect.png",
            collectTxt: "收藏"
          })
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  },
  deleteHandle() {
    this.setData({
      isConfirmDelete: true
    })
  },
  adoptHandle() {
    this.setData({
      isConfirmAdopt: true
    })
  },
  isOrnotDelete(e) {
    if (e.detail.index === 0) {
      this.setData({
        isConfirmDelete: false
      })
    } else {
      var that = this;
      wx.request({
        url: 'http://localhost:3000/article/delete',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          articleId: that.data.articleId
        },
        success(res) {
          console.log(res)
          wx.navigateBack({
            delta: 1
          });
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  },
  isOrnotAdopt(e) {
    if (e.detail.index === 0) {
      this.setData({
        isConfirmAdopt: false
      })
    } else {
      var that = this;
      wx.request({
        url: 'http://localhost:3000/adopt/send',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          token: wx.getStorageSync('token'),
          articleId: that.data.articleId
        },
        success(res) {
          that.setData({
            isConfirmAdopt: false
          });
          console.log(res)
          if (res.data.code != 200) {
            that.setData({
              error: res.data.msg,
              isShowError: true
            })
          } else {
            wx.navigateBack({
              delta: 1
            });
          }
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  },
  repeatAdoptDialog() {
    this.setData({
      isShowError: false
    })
  },
  successAdoptDialog() {
    this.setData({
      isShowSuccess: false
    })
  }
})
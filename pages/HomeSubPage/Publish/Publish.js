var COS = require('../../../utils/cos-wx-sdk-v5.js'); // 图片上传所需接口
const app = getApp();

// 创建一个 COS SDK 实例
// SECRETID 和 SECRETKEY 请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'SECRETID',
  SecretKey: 'SECRETKEY',
  SimpleUploadMethod: 'putObject', // 强烈建议，高级上传、批量上传内部对小文件做简单上传时使用putObject,sdk版本至少需要v1.3.0
});

const pageTitle = '<h1 style="color: #696969">领养公告发布</h1>'
const pageSubTitle1 = '<h3 style="color: #696969">标题</h2>'
const pageSubTitle2 = '<h3 style="color: #696969">修勾信息</h2>'
const pageSubTitle3 = '<h3 style="color: #696969">具体领养描述</h2>'
Page({
  data: {
    dialogText: "发布成功",
    btns: [{
      text: "确认"
    }],
    isShowDialog: false,
    pageTitle,
    pageSubTitle1,
    pageSubTitle2,
    pageSubTitle3,
    title: "",
    description: "",
    photo: [],
    dogName: "",
    age: "",
    dogGender: 0,
    //mp-uploader
    sizeType: ['original'], //压缩上传,可以是['original', 'compressed']
    sourceType: ['album', 'camera'], //相册,或拍照
    maximgs: 1,
    gender: [{
      name: "雌性",
      value: 0,
      checked: true
    }, {
      name: "雄性",
      value: 1,
      checked: false
    }],
    ageList: ['年龄不详', '1岁以下', '1岁', '2岁', '3岁', '4岁', '5岁', '6岁', '7岁', '8岁', '9岁', '10岁', '10岁以上'],
    ageIdx: 0,
    dogType: [],
    typeIdx: 0
  },
  onLoad() {
    this.setData({
      //通过bind(this)将函数绑定到this上,以后函数内的this就是指全局页面
      //setdata以后,这两个函数就可以传递给mp-uploader了
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
    // 获取狗的品种信息
    var that = this;
    wx.request({
      url: 'http://localhost:3000/dogs/type',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {},
      success(res) {
        that.setData({
          dogType: res.data.data.typeList
        })
      }
    })
  },
  dogAgeChoose(e) {
    this.setData({
      ageIdx: e.detail.value
    })
  },
  dogTypeChoose(e) {
    this.setData({
      typeIdx: e.detail.value
    })
  },
  getTitle(e) {
    this.setData({
      title: e.detail.value,
    })
  },
  getDesc(e) {
    this.setData({
      description: e.detail.value
    })
  },
  getDogNickname(e) {
    this.setData({
      dogName: e.detail.value
    })
  },
  getGender(e) {
    this.setData({
      dogGender: e.detail.value
    })
  },
  // 图片上传相关函数
  // Func01：uplaodFile，必须返回Promise
  uplaodFile(files) {
    //Promise的callback里面必须resolve({urls})表示成功，否则表示失败
    return new Promise((resolve, reject) => {
      const tempFilePaths = files.tempFilePaths;
      const that = this;
      let finished = {
        urls: []
      } //本次上次成功的URL存入这个变量,被success方法的e.detail承接

      for (var i = 0; i < tempFilePaths.length; i++) {
        let filePath = tempFilePaths[i] //原名
        let cloudPath = new Date().getTime() + '-' + filePath.substr(filePath.lastIndexOf('/') + 1) //云存储文件名
        cos.postObject({
          Bucket: 'BUCKETNAME', //对象储存桶的名称
          Region: 'ap-guangzhou', //所属地域
          Key: 'dogs/' + cloudPath, //存储在dogs文件夹里面
          FilePath: filePath,
          onProgress: function (info) {
            console.log('进度条', JSON.stringify(info));
          }
        }, function (err, data) {
          // 这里用的是回调函数的形式，也可以用promise方式
          if (err) {
            console.log('上传失败', err);
          } else {
            finished.urls.push({
              url: app.globalData.cdnHost + 'dogs/' + cloudPath
            }) //成功一个存一个到本次上传成功列表
            //如果本次上传的文件都完成 或全局已经存满1张,resolve退出
            if (finished.urls.length === tempFilePaths.length || that.data.files.length + finished.urls.length == this.data.maximgs) {
              resolve(finished)
            }
          }
        });
      }
    })
  },
  // Func02：uploadSuccess，上传成功函数
  uploadSuccess(e) {
    console.log('upload success', e.detail)
    this.data.photo = this.data.photo.concat(e.detail.urls)
    this.setData({
      photo: this.data.photo
    })
    wx.hideLoading()
  },
  // Func03：delimg删除图片
  // detail为{index, item}，index表示删除的图片的下标，item为图片对象。
  delimg(e) {
    this.data.photo.splice(this.data.photo.findIndex(item => item == e.detail.item), 1)
  },
  // Func04：uploadError，上传失败函数
  uploadError(e) {
    console.log('upload error', e.detail)
    wx.hideLoading()
  },
  // Func05：selectFile，mpuploader选择图片时的过滤函数，返回true表示图片有效
  selectFile(files) {
    wx.showLoading({
      title: '',
    })
  },
  publishRes() {
    wx.navigateBack({
      delta: 1
    })
  },
  publishArticle() {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/article/create',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        age: that.data.ageIdx,
        description: that.data.description,
        dogName: that.data.dogName,
        gender: that.data.dogGender,
        photo: that.data.photo[0].url,
        publishTime: new Date(),
        title: that.data.title,
        type: that.data.dogType[that.data.typeIdx]
      },
      success(res) {
        that.setData({
          isShowDialog: true
        })
      },
      fail(res) {
        // console.log(res)
      }
    })
  }
})
var COS = require('../../../utils/cos-wx-sdk-v5.js'); // 图片上传所需接口
const app = getApp()

// 创建一个 COS SDK 实例
// SECRETID 和 SECRETKEY 请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKID20s1AbvHVhsthK1XTDiwvxkM5btz4Rcc',
  SecretKey: 'xlMlz51rbGydCiNdpnmaN9qlgde0GOL7',
  SimpleUploadMethod: 'putObject', // 强烈建议，高级上传、批量上传内部对小文件做简单上传时使用putObject,sdk版本至少需要v1.3.0
});

Page({
  data: {
    bgUrl: "https://puppyhome-1317060763.cos.ap-guangzhou.myqcloud.com/others/backgroundImg.jpg",
    toIdentifyUrl: null,
    identifyType: null,
    identifyPercent: null,
    isHaveIdentify: false,
    isSuccessIdentify: null,
    isShowLoading: false,
    btns:[{
      text: '确认'
    }],
    failText: "识别失败，请重新识别！"
  },
  ReturnHome(){
    wx.navigateBack({
      delta: 1
    })
  },
  isRestartIdentify(){
    this.setData({
      isSuccessIdentify: null,
      isHaveIdentify: false
    })
  },
  // 上传并识别图片Func
  UpLoadImg(){
    this.setData({
      isSuccessIdentify: null,
      isHaveIdentify: false
    })
    var that = this;
    // 选择图片上传
    wx.chooseMedia({
      count: 1, // 上传1张图片
      mediaType: ['image'], 
      sourceType: ['album','camera'], // 拍摄图片或从相册选择图片
      success(res){
        var filePath = res.tempFiles[0].tempFilePath;
        var cloudPath = filePath.substr(filePath.lastIndexOf('/') + 1)
        // 使用腾讯云COS对象存储
        cos.postObject({
          Bucket: 'puppyhome-1317060763', //对象储存桶的名称
          Region: 'ap-guangzhou', //所属地域
          Key: 'identify/' + cloudPath, //存储在identify文件夹里面
          FilePath: filePath,
          onProgress: function (info) {
            console.log('进度条', JSON.stringify(info));
          }
        }, function (err, data) {
          // 这里用的是回调函数的形式，也可以用promise方式
          if (err) {
            console.log('上传失败', err);
          } else {
            // 上传成功赋值toIdentifyUrl
            that.setData({
              // 要识别的图片地址
              toIdentifyUrl: app.globalData.cdnHost + 'identify/' + cloudPath
            }),
            // 给后端传送要识别的图片并拿到识别结果
            that.setData({
              isShowLoading: true
            })
            setTimeout(function () {}, 1000);
            console.log(that.data.toIdentifyUrl);
            wx.request({
              url: 'http://localhost:3000/image/predict', 
              method: 'GET',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                url: that.data.toIdentifyUrl
              },
              success(res){
                that.setData({
                  isShowLoading: false,
                  isHaveIdentify: true,
                  isSuccessIdentify: true,
                  identifyType: res.data.data.className,
                  identifyPercent: res.data.data.probability
                })
              },
              fail(res){
                that.setData({
                  isShowLoading: false,
                  isHaveIdentify: true,
                  isSuccessIdentify: false
                })
              }
            })
          }
        });
      }
    })
  }
})
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
    AvatarUrl: app.globalData.cdnHost + "userinfo/defaultAvatar.png",
    NickName: "wx_user",
    RealName: "wx_user",
    Gender: 1,
    Age: 100,
    Telephone: "12345678910",
    bordeStyle: "5px lightslategray solid",
    successSetInfo: false,
    successSetText: "修改成功！",
    btns: [{
      text: "确认"
    }]
  },
  onLoad() {
    this.setData({
      // 当前用户信息，若首次登入则为默认信息
      NickName: app.globalData.userInfo.nickName,
      AvatarUrl: app.globalData.userInfo.avatar,
      RealName: app.globalData.userInfo.realName,
      Age: app.globalData.userInfo.age,
      Gender: app.globalData.userInfo.gender,
      Telephone: app.globalData.userInfo.telephone,
    });
    // 用户身份标识
    if (app.globalData.userInfo.authentication == 0) {
      this.setData({
        bordeStyle: "5px lightslategray solid", //普通用户“灰色”标识
      })
    } else if (app.globalData.userInfo.authentication == 1) {
      this.setData({
        bordeStyle: "5px deepskyblue solid", //管理员“蓝色”标识
      })
    } else if (app.globalData.userInfo.authentication == 2) {
      this.setData({
        bordeStyle: "5px firebrick solid", //超级管理员“红色”标识
      })
    }
  },
  // 设置用户头像
  setAvatarUrl() {
    var that = this;
    // 选择头像上传
    wx.chooseMedia({
      count: 1, // 上传1张图片
      mediaType: ['image'],
      sourceType: ['album', 'camera'], // 拍摄图片或从相册选择图片
      success(res) {
        var filePath = res.tempFiles[0].tempFilePath;
        var cloudPath = filePath.substr(filePath.lastIndexOf('/') + 1)
        // 使用腾讯云COS对象存储
        cos.postObject({
          Bucket: 'puppyhome-1317060763', //对象储存桶的名称
          Region: 'ap-guangzhou', //所属地域
          Key: 'userinfo/' + cloudPath, //存储在userinfo文件夹里面
          FilePath: filePath,
          onProgress: function (info) {
            console.log('进度条', JSON.stringify(info));
          }
        }, function (err, data) {
          // 这里用的是回调函数的形式，也可以用promise方式
          if (err) {
            console.log('上传失败', err);
          } else {
            that.setData({
              // 上传成功赋值AvatarUrl
              AvatarUrl: app.globalData.cdnHost + 'userinfo/' + cloudPath
            })
          }
        });
      }
    })
  },
  // 设置昵称
  setNickName(e) {
    this.setData({
      NickName: e.detail.value
    })
  },
  // 设置姓名
  setRealName(e) {
    this.setData({
      RealName: e.detail.value
    })
  },
  // 设置年龄
  setAge(e) {
    this.setData({
      Age: e.detail.value
    })
  },
  // 设置手机号码
  setTelephone(e) {
    this.setData({
      Telephone: e.detail.value
    })
  },
  // 设置性别
  setGender(e) {
    this.setData({
      Gender: parseInt(e.detail.value)
    })
  },
  saveUserInfo() {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/user/set/info',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        nickName: that.data.NickName,
        avatar: that.data.AvatarUrl,
        realName: that.data.RealName,
        age: that.data.Age,
        gender: that.data.Gender,
        telephone: that.data.Telephone
      },
      success(res){
        app.globalData.hasEvenLogin = true;
        app.globalData.userInfo.nickName = that.data.NickName;
        app.globalData.userInfo.realName = that.data.RealName;
        app.globalData.userInfo.avatar = that.data.AvatarUrl;
        app.globalData.userInfo.age = that.data.Age;
        app.globalData.userInfo.gender = that.data.Gender;
        app.globalData.userInfo.telephone = that.data.Telephone;
        that.setData({
          successSetInfo: true
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },
  successSetInfo(){
    this.setData({
      successSetInfo: false
    })
  }
})
var COS = require('../../utils/cos-wx-sdk-v5.js');

// 创建一个 COS SDK 实例
// SECRETID 和 SECRETKEY 请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKID20s1AbvHVhsthK1XTDiwvxkM5btz4Rcc',
  SecretKey: 'xlMlz51rbGydCiNdpnmaN9qlgde0GOL7',
  SimpleUploadMethod: 'putObject', // 强烈建议，高级上传、批量上传内部对小文件做简单上传时使用putObject,sdk版本至少需要v1.3.0
});

Page({
  data: {
    imgList: []
  },
  // 上传图片至腾讯云COS
  uploadImg() {
    var that = this;
    wx.chooseMedia({
      count: 1, // 限制一张图片
      mediaType: ['image'], //类型为图片
      sizeType: ['original'], // 是否压缩
      sourceType: ['album', 'camera'], // 指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res);
        that.setData({
          imgList: res.tempFiles
        });
        var filePath = that.data.imgList[0].tempFilePath;
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1);
        cos.postObject({
          Bucket: 'puppyhome-1317060763', //对象储存桶的名称
          Region: 'ap-guangzhou', //所属地域
          Key: 'userinfo/' + Key, //存储在userinfo文件夹里面
          FilePath: filePath,
          onProgress: function (info) {
            console.log('进度条', JSON.stringify(info));
          }
        }, function (err, data) {
          // 这里用的是回调函数的形式，也可以用promise方式
          if (err) {
            console.log('上传失败', err);
          } else {
            console.log('上传成功', data);
          }
        });
      },
    });
  }
})
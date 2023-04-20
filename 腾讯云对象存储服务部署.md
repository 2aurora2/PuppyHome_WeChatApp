### 腾讯云对象存储服务部署

1. 进入[腾讯云对象存储服务 - 控制台](https://console.cloud.tencent.com/cos)，创建存储桶Bucket，并在存储桶中创建identify（存储识别图片）、dogs（存储修勾照片）、userinfo（存储用户头像）三个文件夹；

2. 小程序里请求 COS 需要登录到 [微信公众平台](https://mp.weixin.qq.com/)，选择**开发 > 开发管理 > 开发设置 > 服务器域名**，配置域名白名单，修改服务器域名中的**request合法域名**和**uploadFile合法域名**为自建的**存储桶域名**；

3. 进入[腾讯云访问密钥 - 控制台](https://console.cloud.tencent.com/cam/capi)，新建密钥得到SECRETID 和 SECRETKEY用于后续前端访问特定存储桶；

4. 进入前端代码 ***PuppyHome_WeChatApp/pages/HomeSubPage/Identify/Identify.js*** 文件，将创建的COS实例中的SECRETID 和 SECRETKEY更改为步骤2中得到的SECRETID 和 SECRETKEY；同文件下更改以下配置：

   ```js
   Bucket: 'BucketName', // 修改为自建存储桶名称
   Region: 'ap-guangzhou', // 修改为自建存储桶所在地域
   Key: 'identify/' + cloudPath, //存储在identify文件夹里面
   FilePath: filePath,
   onProgress: function (info) {
       console.log('进度条', JSON.stringify(info));
   }
   ```

5. 进入前端代码 ***PuppyHome_WeChatApp/pages/HomeSubPage/Publish/Publish.js*** 文件，执行和步骤3中一样的操作；

6. 进入前端代码 ***PuppyHome_WeChatApp/pages/MyInfoSubPages/setUserInfo/setUserInfo.js*** 文件，执行和步骤3一样的操作；

7. 修改 ***app.js*** 文件中 **globalData** 中的 **cdnHost** 为自建的存储桶域名（记得以斜杆结尾）
Page({
  data: {
    dialogText: "本平台欢迎各位有志之士申请管理员辅助超管进行发布内容的审核。对于管理员，我们希望您能充满热情、有干劲、心地善良，如果您准备好加入我们这个大家庭，就开始申请吧！",
    btns: [{
      text: "确认"
    }],
    isshow: true,
    name: "",
    tele: "",
    reason: "",
    showSuccess: false,
    successText: ""
  },
  ReadyApply() {
    this.setData({
      isshow: false
    })
  },
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  teleInput(e) {
    this.setData({
      tele: e.detail.value
    })
  },
  reasonInput(e) {
    this.setData({
        reason: e.detail.value
      }),
      console.log(this.data.name, this.data.tele, this.data.reason)
  },
  SubmitApply() {
    var that = this;
    wx.request({
      url: 'http://localhost:3000/apply/send',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        name: this.data.name,
        telephone: this.data.tele,
        description: this.data.reason
      },
      success(res) {
        console.log(res.data),
        that.setData({
            name: "",
            tele: "",
            reason: "",
            showSuccess: true,
            successText: res.data.message
        })
        console.log(res.data.message)
      }
    })
  },
  SuccessApply() {
    wx.navigateBack({
      delta: 1
    });
  }
})
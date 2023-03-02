Page({
  data: {
    dialogText: "本平台欢迎各位有志之士申请管理员辅助超管进行发布内容的审核。对于管理员，我们希望您能充满热情、有干劲、心地善良，如果您准备好加入我们这个大家庭，就开始申请吧！",
    btns: [{
      text: "确认"
    }],
    isshow: true,
  },
  ReadyApply(){
    this.setData({
      isshow: false
    })
  }
})
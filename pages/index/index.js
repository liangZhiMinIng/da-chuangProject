// index.js
// 获取应用实例
const mapObj = require("../../libs/map")
const app = getApp()
let plugin = requirePlugin('routePlan');
let key = '4WXBZ-T7ZCU-AWPVP-2AMVB-UYQFV-U2FYX';  //使用在腾讯位置服务申请的key
let referer = 'dachuang';   //调用插件的app的名称
let endPoint = JSON.stringify({  //终点
  'name': '水上公园',
  'latitude': 39.894806,
  'longitude': 116.321592
});

// 同声传译
var soundPlugin = requirePlugin("WechatSI")
let manager = soundPlugin.getRecordRecognitionManager()
Page({
  data: {
    transformcontext:"",
  
    // 同声传译变量
    currentText: '',
    translateText: '',
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    // 同声传译
    this.initRecord()

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    
  },
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  // 同声传译
  // 语音识别按钮部分
  streamRecord:function(){
    manager.start({
      lang:'zh_CN',
    })
  },
  endStreamRecord:function(){
    manager.stop()
  },

  initRecord:function(){
    // 有心得识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        currentText:text,
      })
      // transformcontent.name=currentText
    },
    manager.onStop = (res) => {
      let text = res.result
      // text = "小白楼"
      if(text == ''){
        // 用户没有说话时，可以做一下提示处理
        // wx.showLoading({
        //   title: '请说话...',
        // })
        return
      }
      this.setData({
        currentText:text,
      })
      endPoint = JSON.stringify({  //终点
        'name': text,
        'latitude': 39.894806,
        'longitude': 116.321592
      });
      // 得到完整识别内容就可以去翻译了
      this.translateTextAction()
    }
  },
  translateTextAction:function(){

  },
  // 翻译结果
  translateTextAction:function(){
    let Ifrom = 'zh_CN'
    let Ito = 'zh_CN'
    plugin.translate({
      Ifrom:Ifrom,
      Ito:Ito,
      content:this.data.currentText,
      tts:true,//需要合成语音
      success:(resTrans) => {
        // 翻译可以得到 翻译文本，翻译文本的合成语音，合成语音的过期时间
        let text = resTrans.result
        this.setData({
          translateText:text,
        })
        // 得到合成语音让它自动播放出来
        wx.playBackgroundAudio({
          dataUrl: resTrans.filename,
          title:'',
        })
      },
    })
    
  },
  


  gotoOne(e){
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint 
    })
  }
})

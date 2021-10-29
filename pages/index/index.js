var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    currentText: '',
    translateText: '',
  },
  onLoad: function(){
    this.initRecord()   
  },

  // 语音识别按钮部分
  streamRecord: function(){  
    manager.start({      
      lang: 'zh_CN',
    })
      
  },
      
  endStreamRecord: function(){
    manager.stop()  
  },
  // 语音识别按钮部分。
  initRecord: function(){
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        currentText: text,
      })
    
    }  
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if(text == '') {
       // 用户没有说话，可以做一下提示处理...
       wx.showLoading({
        title: '请说话...',
        })
       return 
      }
    
      this.setData({
    
        currentText: text,
    
      })
    
      // 得到完整识别内容就可以去翻译了
    
      this.translateTextAction()
    
    }
  },
  translateTextAction: function(){},
    
  // 翻译结果
  translateTextAction: function(){
    let lfrom =  'en_US'     
    let lto = 'zh_CN'     
    plugin.translate({     
      lfrom: lfrom,     
      lto: lto,     
      content: this.data.currentText,     
      tts: true, // 需要合成语音     
      success: (resTrans)=>{     
        // 翻译可以得到 翻译文本，翻译文本的合成语音，合成语音的过期时间     
        let text = resTrans.result      
        this.setData({      
          translateText: text,     
        })
        wx.navigateTo({
          url: "/pages/test/test?searchcontent="+text
        })
      },
    })
      
  },
  // 路由跳转
  gotoOne(e){
      wx.navigateTo({
        url:  e.currentTarget.dataset.url
      })
    },
  ttt(){
    wx.navigateTo({
      url: "/pages/test/test?searchcontent=小白楼"
    })
  }
})
  
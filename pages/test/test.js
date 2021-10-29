const amapFile = require('../../libs/amap-wx.js');
var plugin = requirePlugin("WechatSI")
const key = "d9e54bbc6b36b0fc57a15bd1e2a8b328";
let myAmapFun;
let lonlat;
let city;
let searchcontent;
Page({
  data: {
    markers: [],
    distance: '',
    cost: '',
    polyline: [],
    steps:{},
    destination:"",
    tips: {},
    latitude:"",
    longitude:""
  },
  onLoad: function(options) {
    console.log(options)
    searchcontent = options.searchcontent
    var that = this;
    myAmapFun = new amapFile.AMapWX({key});
    myAmapFun.getRegeo({
      iconPath: "../../img/marker.png",
      iconWidth: 22,
      iconHeight: 32,
      success: function(data){
        console.log(data)
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        }]
        that.setData({
          markers: marker,
          latitude: data[0].latitude,
          longitude: data[0].longitude
        });
        that.bindInput2()
      },
      fail: function(info){
        // wx.showModal({title:info.errMsg})
      }
    })
  },
  goDetail: function(){
    var that = this;
    myAmapFun.getDrivingRoute({
      origin: `${that.data.longitude},${that.data.latitude}`,
      destination: that.data.destination,
      success: function(data){
        if(data.paths && data.paths[0] && data.paths[0].steps){
          that.setData({
            steps: data.paths[0].steps
          });
        }
          
      },
      fail: function(info){

      }
    })

    myAmapFun.getDrivingRoute({
      origin: `${that.data.longitude},${that.data.latitude}`,
      destination: that.data.destination,
      success: function(data){
        var points = [];
        let pathstr = ""
        if(data.paths && data.paths[0] && data.paths[0].steps){
          var steps = data.paths[0].steps;
          for(var i = 0; i < steps.length; i++){
            var poLen = steps[i].polyline.split(';');
            for(var j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            } 
            pathstr += data.paths[0].steps[i].instruction
          }
          console.log(10000000,pathstr)
          let lfrom =  'en_US'
          let lto  = 'zh_CN'
          plugin.translate({    
            lfrom ,   
            lto ,
            content:pathstr,
            tts: true, // 需要合成语音
            success: (resTrans)=>{             
              // 翻译可以得到 翻译文本，翻译文本的合成语音，合成语音的过期时间
              let text = resTrans.result
              console.log(2000000,text)              
              // 得到合成语音让它自动播放出来            
              wx.playBackgroundAudio({            
                dataUrl: resTrans.filename,            
                title: '',            
              })              
            },
              
          })
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if(data.paths[0] && data.paths[0].distance){
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if(data.taxi_cost){
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }
          
      },
      fail: function(info){

      }
    })
  },
  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    myAmapFun.getInputtips({
      keywords: keywords,
      location: lonlat,
      city: city,
      success: function(data){
        console.log(data)
        if(data && data.tips){
          that.setData({
            tips: data.tips
          });
        }
      }
    })
  },
  bindInput2: function(){
    var that = this;
    var keywords = searchcontent; 
    myAmapFun.getInputtips({
      keywords: keywords,
      location: lonlat,
      city: city,
      success: function(data){
        console.log(data)

        if(data && data.tips){
          console.log(data.tips)
          that.setData({
            destination:data.tips[0].location
          })
          that.goDetail()
        }
      }
    })
  },
  bindSearch: function(e){
    // console.log(e)
    console.log(e.currentTarget.dataset.location)
    this.setData({
      tips: [],
      destination:e.currentTarget.dataset.location
    })
  },

})
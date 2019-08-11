//  因为echart 是通过canvas绘制而成 此插件没有做适配 所以我们自己在微信小程序做适配 插件wx-echart
/* 
  1.首先 在wxml中定义变量canvas的宽高
  <canvas canvas-id="ringCanvas"  style="width:{{canvasWidth}}px;height:{{canvasHeight}}px" ></canvas>
*/
//2.在微信小程序data中定义初始变量
  data:{
    canvasWidth:''
    canvasHeight:''
  }
//3.在小程序的生命周期中获取 可视屏幕的宽高 小程序严格模式 没有 window 所以查看微信的API 发现可以调用 wx.getSystemInfo方法能拿到宽高
onShow: function ( ) {
    var _this = this;
    // echart图表插件 自适应
    var myCanvasWidth, myCanvasHeight
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        myCanvasWidth = res.windowWidth/2.53  //除以的比例 根据项目需要的进行换算
        myCanvasHeight = res.windowHeight/4   //除以的比例 根据项目需要的进行换算
      }
    })
    _this.setData({
      canvasWidth: myCanvasWidth,
      canvasHeight: myCanvasHeight
    })
// 可以在wx-echart中使用
var chart = new wxCharts({
    animation: true,
    canvasId: 'ringCanvas',
    type: 'ring',
    extra: {
      ringWidth: 25,
      pie: {
        offsetAngle: -45
      },
    },
    title: {
      name: '暂无数据',
      // color: '#FBA53F',
      color: '#f00',
      fontSize: 10
    },
    // subtitle: {
    //   name: '暂无数据',
    //   color: '#666666',
    //   fontSize: 15
    // },
    series: [{
      name: '会员返现',
      data: res.data.awardThisMonth.returnAward,
      color: "#217CF9",
      stroke: false
    }, {
      name: '团队奖金',
      data: res.data.awardThisMonth.teamAward,
      color: "#FBA53F",
      stroke: false
    }],
    disablePieStroke: true,
    width: _this.data.canvasHeight, //将赋值可以根据屏幕大小转变的进行操作
    height: _this.data.canvasWidth, //将赋值可以根据屏幕大小转变的进行操作
    dataLabel: false,
    legend: false,
    padding: 0,
  })
   // 解决canvas在手机上覆盖其他的问题
   var context = wx.createCanvasContext('ringCanvas');
   //绘制图片
   context.draw(false,

     setTimeout(
       function () {
         wx.canvasToTempFilePath({
           canvasId: 'ringCanvas',
           success: function (res) {
             var tempFilePath = res.tempFilePath;
             console.log(tempFilePath);
             _this.setData({
               imagePath: tempFilePath,
             });
             wx.hideToast()
           },
           fail: function (res) {
             console.log(res);
           }
         })
       }, 1200
     )
   )
};
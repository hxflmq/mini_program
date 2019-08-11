// 小程序用到Canvas会有层级最高问题 比如弹框会被canvas覆盖 怎么解决这个问题呢？ 不提供样式!
 /*
  canvas 图表 可以选择微信的API 也可以选择三方插件 道理是一样的  这里我选择的是 wx-wxcharts插件  此插件 在github本地址utils文件中
  利用微信的wx.canvasToTempFilePath API 解决
  */
 // 1. 引入插件 
import wxCharts from '../../../utils/wxcharts-min.js'
// 下面是微信小程序wxml核心代码
 // 因为canvas为原生组件 层级最高 所以找图片
/* 
 <view class='canvas'>  
  <canvas canvas-id="lineCanvas" disable-scroll="true" class="lineCanvas" hidden='{{hasCanvas}}'></canvas>   
</view>
<image src="{{imagePath}}" class="lucky-index-round" hidden='{{noCanvasImg}}'></image>  //保存绘制后的图片
 */
 new wxCharts({
    canvasId: 'lineCanvas',
    type: 'area',
    categories: month,
    animation: true,
    legend: false,
    series: [{
      name: '成交量1',
      data: [1,0,3,0,0,0],
      data: amount,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      },
      color: '#FFDE70'
    }],
    xAxis: {
      disableGrid: false,
      fontColor:'#fff', 
    },
    yAxis: {
      title: '成交金额 (万元)',
      format: function (val) {
        return val.toFixed(2);
      },
      min: 0
    },
    yAxis: {
      title: '成交金额 (万元)',
      format: function (val) {
        return val.toFixed(2);
      },
      min: 0,
      disableGrid: false
    },
    width: 380,
    height: 300,
    background: '#F66D20',
    dataLabel: false,
    dataPointShape: false,
    disablePieStroke:false,
    extra: {
      lineStyle: 'curve'
    }
  }) 
/* 
  此时绘制好了 但是会覆盖其他组件 因为原生组件嘛 
   下面就是解决问题的核心代码
*/
 //下面是微信小程序js核心代码
 // 解决canvas在手机上覆盖其他的问题
    var context = wx.createCanvasContext('lineCanvas');
    //绘制图片
    context.draw(false,
      setTimeout(
        function () {
          wx.canvasToTempFilePath({
            canvasId: 'lineCanvas',  //要与 wxml中的 canvas-id一致
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              console.log(tempFilePath);
              _this.setData({
                imagePath: tempFilePath,  // 在微信小程序js中data 定义 imagePath：""
              });
              wx.hideToast()
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }, 1200
      )
    );
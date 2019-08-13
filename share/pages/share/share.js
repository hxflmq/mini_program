
var app = getApp();
// const W = wx.getSystemInfoSync().windowWidth;
// const rate = 750.0 / W;

// // 300rpx 在6s上为 150px
// const qrcode_w = 300 / rate;

// 二维码生成
import wxqrcode from '../../weapp.qrcode.min.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: "../../image/Bitmap(1).png", //背景图
    inputValue: "",
    maskHidden: false,
    employeeName: "推荐码",
    employeperson: "推荐人",
    cardCode: "", //二维码
    taskCouponId: '',
    employeeId: '',
    savePiceture: true,
    inteCode: "",
    inteperson: "",
    ishowQr: false,
    canvasWidth: '',
    canvasHeight: '',
    imagePath: '',
    codeMa:'',
    ishowMa:true,
    imgCodeMa:false

    // qrcode_w: qrcode_w  //canvas 自适应
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 生产二维码
  produltCode: function () {
    var _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          canvasWidth :300,
          canvasHeight :300
        })
      }
    })
    wxqrcode({
      width: 300,
      height: 300,//_this.data.canvasWidth
      canvasId: 'myQrcode',
      ctx: wx.createCanvasContext('myQrcode'),
      text: `https://www.baidu.com`,
    })
  },
  onLoad: function (options) {
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    // echart图表插件 自适应
    // 解决canvas在手机上覆盖其他的问题
    var context = wx.createCanvasContext('myQrcode');
    //绘制图片
    context.draw(false,

      setTimeout(
        function () {
          wx.canvasToTempFilePath({
            canvasId: 'myQrcode',
            fileType: 'jpg',
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              console.log(tempFilePath);
              _this.setData({
                codeMa: tempFilePath,
              });
              wx.hideToast()
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }, 1500
      )
    );


    _this.produltCode()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    //  拿到邀请码
    var _this = this;
    var title = '电商小程序';
    var path = `https:www.baidu.com`
    var imageUrl = '../../image/Bitmap(1).png';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
        console.log('成功', res)
      },
      fail: function (res) {
        wx.showToast({
          title: "分享失败",
          duration: 1000,
          icon: "success"
        })
      }
    }
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    console.log(that.data.cardCode)
    that.setData({
      ishowQr: false,
      imgCodeMa:true
    })
    var context = wx.createCanvasContext('mycanvas');
    
    context.setFillStyle("#ffffff") //填充整体的色调#697fde  ffe200
    // 设置上部的图片 /images/gobg.png
    context.fillRect(0, 0, 375, 667)
    var path = that.data.img;
    // var path1 = that.data.myQrcodeImg;
    var path1 = that.data.codeMa;
    console.log(path1)
    //将模板图片绘制到canvas
    context.drawImage(path, 0, 20, 375, 460);
    // context.drawImage(path1, 20, 10, 350, 420);//测试
    context.drawImage(path1, 20, 200, 240, 240);
    //绘制领券标语
    context.setFontSize(17);
    context.setFillStyle('#333333');
    context.setLineWidth(0.5)
    context.setTextAlign('right');
    context.rect(90, 510, 260, 120) //绘制矩形
    context.fillText(that.data.employeeName, 160, 550);
    context.fillText(that.data.inteCode, 330, 550);
    context.fillText(that.data.employeperson, 160, 600);
    context.fillText(that.data.inteperson, 330, 600);

    context.stroke();
    context.stroke();
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',  
        fileType:'jpg',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(res)
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//这里是用户同意授权后的回调
              that.formSubmit();
            },
            fail() {//这里是用户拒绝授权后的回调
              that.setData({
                saveImgBtnHidden: true,
                openSettingBtnHidden: false
              })
            }
          })
        } else {//用户已经授权过了
          that.formSubmit();
        }
      }
    })
    that.setData({
      savePiceture: false,
      ishowQr: false,
      imgCodeMa: true
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        console.log(res)
        wx.showModal({
          content: '图片已保存到系统相册，去发朋友圈晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false,
                imgCodeMa: false
              })
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function (e) {
    console.log(e)
    var that = this;
    this.setData({
      maskHidden: false,
      savePiceture: false,
      // imgCodeMa:true
    });
    setTimeout(function () {
      that.setData({
        imgCodeMa: true
      })
      console.log(2)
    }, 1100)
    wx.showToast({
      title: '生成图片中...',
      icon: 'loading',
      duration: 1000,
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      wx.vibrateLong();
      that.setData({
        maskHidden: true,
        ishowQr: false
      });
    }, 1200)
  },
  // 点击关闭生成的图片
  closeThisPostBtn() {
    this.setData({
      maskHidden: false,
      imgCodeMa:false
    });
  },

  handleSetting: function (e) {
    let that = this;
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
      that.setData({
        saveImgBtnHidden: true,
        openSettingBtnHidden: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      that.setData({
        saveImgBtnHidden: false,
        openSettingBtnHidden: true
      })
    }
  },
})
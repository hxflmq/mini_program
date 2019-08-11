var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();
// 二维码生成
import wxqrcode from '../../../utils/weapp.qrcode.min.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: "/static/image/Bitmap(1).png", //背景图
    inputValue: "",
    maskHidden: false,
    employeeName: "",
    cardCode: "https://goldsys.oss-cn-hangzhou.aliyuncs.com/1553047102000.jpg", //二维码
    taskCouponId: '',
    employeeId: '',
    savePiceture: true,
    inteCode: wx.getStorageSync('userInfo').invitationCodeMine,
    inteperson: wx.getStorageSync('userInfo').nickName,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this;
    wxqrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      ctx: wx.createCanvasContext('myQrcode'),
      text: `/pages/index/index?invitationCodeMine=${_this.data.inteCode}`,
  //     // v1.0.0+版本支持在二维码上绘制图片
  //     image: {
  //       imageResource: '/static/image/Bitmap.png',
  //       dx: 70,
  //       dy: 70,
  //       dWidth: 60,
  //       dHeight: 60
  //     }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    //  拿到邀请码
    var _this = this;
    var title = '电商小程序';
    var path = `/pages/index/index?invitationCodeMine=${_this.data.inteCode}`
    var imageUrl = '/static/image/Bitmap.png';
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
        console.log('成功', res)
      },
      fail: function(res) {
        wx.showToast({
          title: "分享失败",
          duration: 1000,
          icon: "success"
        })
      }
    }
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function() {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffffff") //填充整体的色调#697fde  ffe200
    // 设置上部的图片 /images/gobg.png
    context.fillRect(0, 0, 375, 667)
    var path = that.data.img;
    var path1 = that.data.cardCode;
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示   //绘制二维码touxiang
    context.drawImage(path, 48, 20, 280, 460);
    context.drawImage(path1, 136, 520, 100, 100);
    //绘制领券标语
    context.setFontSize(17);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(that.data.employeeName + "邀请您领券，一起购物!", 185, 510);
    context.stroke();
    //绘制领码提醒
    context.setFontSize(14);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText('长按识别二维码', 185, 650);
    context.stroke();
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function(res) {
          console.log(res);
        }
      });
    }, 200);
  },
  //点击保存到相册
  baocun: function() {
    var that = this
    that.setData({
      savePiceture: false
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到系统相册，去发朋友圈晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function(res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          },
          fail: function(res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //点击生成
  formSubmit: function(e) {
    var that = this;
    this.setData({
      maskHidden: false,
      savePiceture: false
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function() {
      wx.hideToast()
      that.createNewImg();
      wx.vibrateLong();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },
  // 点击关闭生成的图片
  closeThisPostBtn() {
    this.setData({
      maskHidden: false
    });
  },
})
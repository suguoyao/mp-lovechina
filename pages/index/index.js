//index.js
const Util = require('../../utils/util')
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ctx: null,
    showAuth: false,
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.initCanvas()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.initCanvas()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          this.initCanvas()
        }
      })
    }
  },
  onShow: function() {
    if (app.globalData.currentImg) {
      this.drawAvatar(app.globalData.currentImg)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    return {
      title: '定制属于你的爱中头像',
      imageUrl: '/images/70.png',
      path: '/pages/index/index'
    }
  },
  /**
   * 打开授权弹窗
   */
  showAuthModel() {
    this.setData({
      showAuth: true
    })
  },
  /**
   * 关闭授权弹窗
   */
  closeAuthModel() {
    this.setData({
      showAuth: false
    })
  },
  getUserInfo: function(e) {
    if (!e.detail.userInfo) {
      Util.toast('请先允许授权')
      return
    }
    this.closeAuthModel()
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.initCanvas()
  },
  initCanvas() {
    const ctx = wx.createCanvasContext('canvas')
    this.setData({
      ctx: ctx
    })
    this.drawAvatar()
  },
  drawAvatar(url) {
    if (!this.data.ctx) return
    const ctx = this.data.ctx
    // 绘制头像
    if (url) {
      ctx.drawImage(url, 0, 0, 300, 300);
      ctx.drawImage('/images/head-2.png', 0, 0, 300, 300);
      ctx.draw(true)
    } else {
      let avatarUrl = this.data.userInfo.avatarUrl
      avatarUrl = avatarUrl.replace('/132', '/0') // 换成高清头像
      wx.getImageInfo({
        src: avatarUrl,
        success(res) {
          console.log(res)
          ctx.drawImage(res.path, 0, 0, 300, 300);
          ctx.drawImage('/images/head-2.png', 0, 0, 300, 300);
          ctx.draw(true)
        }
      })
    }
    wx.hideLoading()
  },
  /**
   * 更改图片
   */
  changeImg() {
    if (!this.data.hasUserInfo) {
      this.showAuthModel()
      return
    }
    wx.navigateTo({
      url: '/pages/cutInside/cutInside'
    })
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success: (res) => {
    //     console.log(res)
    //     // tempFilePath可以作为img标签的src属性显示图片
    //     const tempFilePaths = res.tempFilePaths
    //     this.drawAvatar(tempFilePaths[0])
    //   }
    // })
  },
  /**
   * 保存头像
   */
  saveAvatar() {
    if (!this.data.hasUserInfo) {
      this.showAuthModel()
      return
    }

    const that = this
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success(res) {
        console.log('canvasToTempFilePath： ', res);
        const imgPath = res.tempFilePath
        // 询问并获取访问手机本地相册权限
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) { //判断权限
              wx.authorize({ //获取权限
                scope: 'scope.writePhotosAlbum',
                success() {
                  console.log('授权成功')
                  that.saveImg(imgPath)
                },
                fail(err) {
                  console.log('拒绝授权相册权限')
                  Util.toast('请允许授权后才能保存图片')
                  // 直接预览图片
                  wx.previewImage({
                    urls: [imgPath]
                  })
                }
              })
            } else {
              that.saveImg(imgPath)
            }
          }
        })
      }
    })
  },
  saveImg(imgPath) {
    // 将图片保存到相册
    wx.saveImageToPhotosAlbum({
      filePath: imgPath,
      success(data) {
        console.log(data);
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail(err) {
        Util.toast('保存失败，请重试')
      }
    });
  }
})
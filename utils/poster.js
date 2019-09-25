const Util = require('../utils/util')
const app = getApp()


const drawAvatar = (avatarUrl) => {
  wx.getImageInfo({
    src: avatarUrl,
    success(res) {
      console.log(res)
      const ctx = wx.createCanvasContext('canvas')
      let canvasWidthPx = app.globalData.windowWidth / 750 * 300
      // ctx.clearRect(0, 0, 550, 770)
      // ctx.draw()

      // 绘制头像
      let avatarW = 300 * canvasWidthPx / 750;
      let avatarH = 300 * canvasWidthPx / 750;
      ctx.drawImage(avatarUrl, 0, 0, 300, 300);

      ctx.draw(true) // 绘制
      wx.hideLoading()
    }
  })
}

/**
 * 圆头像绘制方法
 */
const darwAvatarArc = (ctx, url, x, y, w, h = w) => {
  wx.getImageInfo({
    src: url,
    success(res) {
      console.log(res)
      const src = res.path
      /*
          ctx: 画布对象
          src: 头像缓存路径
          x: 头像起始位置 横坐标
          y: 头像起始位置 纵坐标
          w: 头像宽度
          h: 头像高度，不传为w
        */
      // 保存绘图上下文。
      ctx.save();
      // 开始创建一个路径。需要调用 fill 或者 stroke 才会使用路径进行填充或描边
      ctx.beginPath()
      // 设创建一个圆可以指定 起始弧度为 0，终止弧度为 2 * Math.PI。
      // 用 stroke 或者 fill 方法来在 canvas 中画弧线。
      ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2, false);
      /* 从原始画布中剪切任意形状和尺寸。
      一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（
      不能访问画布上的其他区域）。可以在使用 clip 方法前通过使用 save 方法对当前画布区域进行保存，并在以后的任意时间通过restore方法对其进行恢复。
      */
      ctx.clip()
      // 画头像
      ctx.drawImage(src, x, y, w, h);
      // 恢复之前保存的绘图上下文。
      ctx.restore()
      ctx.draw(true)
    }
  })
}

/**
 * 保存图片
 */
const savePoster = (canvasId) => {
  wx.canvasToTempFilePath({
    canvasId: canvasId,
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
                saveImg(imgPath)
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
            saveImg(imgPath)
          }
        }
      })
    }
  })
}
const saveImg = (imgPath) => {
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

module.exports = {
  savePoster,
  drawAvatar
}
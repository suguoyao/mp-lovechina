//app.js
App({
  onLaunch: function() {
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        // 屏幕宽度 375px = 750rpx，1px=2rpx
        // 1px = （750 / 屏幕宽度）rpx；
        // 1rpx = （屏幕宽度 / 750）px;
        this.globalData.windowWidth = res.windowWidth
        this.globalData.windowHeight = res.windowHeight
        this.globalData.ratio = 750 / res.windowWidth
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    windowWidth: 0,
    windowHeight: 0,
    ratio: 0,
    currentImg: ''
  }
})
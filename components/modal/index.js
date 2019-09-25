// components/modal/index.js
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    // 弹窗大小
    width: {
      type: String,
      value: '680rpx'
    },
    // 取消按钮文字
    cancelBtnText: {
      type: String,
      value: '关闭'
    },
    // 确定按钮文字
    okBtnText: {
      type: String,
      value: '确定'
    },
    // 隐藏取消按钮
    hideCancelBtn: {
      type: Boolean,
      value: false
    },
    // 隐藏所有按钮组
    // 用于自定义按钮
    hideBtn: {
      type: Boolean,
      value: false
    },
    // 显示success图标
    showSuccessIcon: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _close() {
      this.triggerEvent('close')
    },
    _ok() {
      this.triggerEvent('ok')
    }
  }
})
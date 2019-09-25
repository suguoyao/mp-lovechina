const formatTime = date => {
  if (!date) {
    date = new Date()
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatToDatetimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return ''
  let ymd = startTime.split(' ')[0]
  let startHM = startTime.split(' ')[1].substring(0, 5)
  let endHM = endTime.split(' ')[1].substring(0, 5)
  return `${ymd} ${startHM} - ${endHM}`
}

/**
 * toast消息提示框
 */
const toast = (title, duration) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: duration || 1000
  })
}

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const validatePhone = (phone) => {
  let pattern = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  // let pattern = /1\d{10}$/
  return pattern.test(phone)
}


/**
 * 函数节流 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param func 需要调用的函数
 * @param delay 延迟时间，单位毫秒
 * @returns {Function} 实际调用函数
 */
const throttle = (func, delay) => {
  let last = 0
  return function() {
    let curr = +new Date()
    if (curr - last > delay) {
      func.apply(this, arguments)
      last = curr
    }
  }
}

/**
 * 函数去抖 返回函数连续调用时，空闲时间必须大于或等于wait，func才会执行
 * @param func 需要调用的函数
 * @param wait 空闲时间，单位毫秒
 * @param immediate 是否立即执行
 * @returns {Function}  实际调用函数
 */
const debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

module.exports = {
  formatTime,
  formatToDatetimeRange,
  toast,
  validateEmail,
  validatePhone,
  throttle,
  debounce,
}
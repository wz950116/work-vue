/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
/**
 * 校验特殊字符
 * @param {*} str 待校验字符串
 * @returns {boolean}
 */
export function validateSpecialCharacter(str) {
  const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
  const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
  return regEn.test(str) || regCn.test(str)
}
/**
 * 校验正整数
 * @param {*} str 待校验的数字
 * @returns {boolean}
 */
export function validatePositiveInteger(str) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  return reg.test(str)
}
/**
 * 校验非负整数
 * @param {*} str 待校验的数字
 * @returns {boolean}
 */
export function validNonnegativeInteger(str) {
  const reg = /^\d+$/
  return reg.test(str)
}

// 计算表达式的值
export function evil(fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}

// 判断字符串长度
export function getBLen(str) {
  if (str == null) return 0
  if (typeof str !== 'string') {
    str += ''
  }
  // eslint-disable-next-line
  return str.replace(/[^\x00-\xff]/g, '01').length
}
// 验证时间格式
export function verifyTime(str) {
  var reg = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]) ?(PM|AM)?$/ // 时间
  return reg.test(str)
}
// 验证时间格式
export function verifyTimeHM(str) {
  var reg = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]) ?(PM|AM)?$/ // 时间
  return reg.test(str)
}
// 转换为hhmmss,不够两位补零
export function datatime(str) {
  if (str.indexOf('AM') !== -1) {
    str = str.replace('AM', '').trim()
    const arr = str.split(':')
    arr[0] = Number(arr[0]) < 10 ? '0' + Number(arr[0]) : arr[0]
    arr[1] = Number(arr[1]) < 10 ? '0' + Number(arr[1]) : arr[1]
    arr[2] = Number(arr[2]) < 10 ? '0' + Number(arr[2]) : arr[2]
    return arr[0] + arr[1] + arr[2]
  } else if (str.indexOf('PM') !== -1) {
    str = str.replace('PM', '').trim()
    const arr = str.split(':')
    arr[0] = Number(arr[0]) < 12 ? 12 + Number(arr[0]) : arr[0]
    arr[1] = Number(arr[1]) < 10 ? '0' + Number(arr[1]) : arr[1]
    arr[2] = Number(arr[2]) < 10 ? '0' + Number(arr[2]) : arr[2]
    return arr[0] + arr[1] + arr[2]
  } else {
    const arr = str.split(':')
    arr[0] = Number(arr[0]) < 10 ? '0' + Number(arr[0]) : arr[0]
    arr[1] = Number(arr[1]) < 10 ? '0' + Number(arr[1]) : arr[1]
    arr[2] = Number(arr[2]) < 10 ? '0' + Number(arr[2]) : arr[2]
    return arr[0] + arr[1] + arr[2]
  }
}
// 上传文件转换为字典码表value值
export function numFormat(cellLable, dataDictLang) {
  if (!cellLable || !dataDictLang) return
  let text = ''
  for (let i = 0; i < dataDictLang.length; i++) {
    if (dataDictLang[i] && dataDictLang[i].label === cellLable) {
      text = dataDictLang[i].value
      break
    } else {
      text = cellLable
    }
  }
  return text
}
export function num(s) {
  return s < 10 ? '0' + s : s
}
// 验证时间是否有效

export function toDateFromString(strDate) {
  if (strDate.length !== 8) {
    return false
  }
  var dtDate = null
  var nYear = parseInt(strDate.substring(0, 4), 10)
  var nMonth = parseInt(strDate.substring(4, 6), 10)
  var nDay = parseInt(strDate.substring(6, 8), 10)
  if (
    isNaN(nYear) === true ||
    isNaN(nMonth) === true ||
    isNaN(nDay) === true
  ) {
    return false
  }
  dtDate = new Date(nYear, nMonth - 1, nDay)
  if (
    nYear !== dtDate.getFullYear() ||
    nMonth - 1 !== dtDate.getMonth() ||
    nDay !== dtDate.getDate()
  ) {
    return false
  }
  return strDate
}

// 验证是数字
export function verifyNamber(str) {
  var fre = /^[-\\+]?[0-9]+.?[0-9]*$/ // 数字
  return fre.test(str)
}
// 验证是正数
export function verifyInteger(str) {
  var fre = /^[0-9]+.?[0-9]*$/
  return fre.test(str)
}
// 百分比-小数
export function toPoint(percent) {
  var str = percent.replace('%', '')
  str = str / 100
  return str
}
// 小数--百分比
export function toPercent(point) {
  var percent = Number(point * 100).toFixed(1)
  percent += '%'
  return percent
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

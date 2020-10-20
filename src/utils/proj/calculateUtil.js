// 计算工具 加减乘除、连续加减 fixNum为保留小数位数(连续加减不支持)
export function add(val1, val2, fixNum) {
  if (val1 === null || val2 === null) {
    return null
  }
  if (val1 === undefined || val2 === undefined) {
    return 0
  }
  if (Number.isNaN(val1) || Number.isNaN(val2)) {
    return 0
  }
  val1 = Number(val1)
  val2 = Number(val2)
  if (Number.isInteger(val1) && Number.isInteger(val2)) {
    return val1 + val2
  }
  var l1, l2, m
  try {
    l1 =
      val1.toString().indexOf('.') > -1
        ? val1.toString().split('.')[1].length
        : 0
  } catch (e) {
    l1 = 0
  }
  try {
    l2 =
      val2.toString().indexOf('.') > -1
        ? val2.toString().split('.')[1].length
        : 0
  } catch (e) {
    l2 = 0
  }
  m = Math.pow(10, Math.max(l1, l2))
  var result = (mul(val1, m) + mul(val2, m)) / m
  if (!fixNum || Number.isNaN(fixNum)) {
    return result
  } else {
    return result.toFixed(fixNum)
  }
}

export function sub(val1, val2, fixNum) {
  if (val1 === null || val2 === null) {
    return null
  }
  if (val1 === undefined || val2 === undefined) {
    return 0
  }
  if (Number.isNaN(val1) || Number.isNaN(val2)) {
    return 0
  }
  val1 = Number(val1)
  val2 = Number(val2)
  if (Number.isInteger(val1) && Number.isInteger(val2)) {
    return val1 - val2
  }
  var l1, l2, m
  try {
    l1 =
      val1.toString().indexOf('.') > -1
        ? val1.toString().split('.')[1].length
        : 0
  } catch (e) {
    l1 = 0
  }
  try {
    l2 =
      val2.toString().indexOf('.') > -1
        ? val2.toString().split('.')[1].length
        : 0
  } catch (e) {
    l2 = 0
  }
  m = Math.pow(10, Math.max(l1, l2))
  var result = (mul(val1, m) - mul(val2, m)) / m
  if (!fixNum || Number.isNaN(fixNum)) {
    return result
  } else {
    return result.toFixed(fixNum)
  }
}

export function mul(val1, val2, fixNum) {
  if (val1 === null || val2 === null) {
    return null
  }
  if (val1 === undefined || val2 === undefined) {
    return 0
  }
  if (Number.isNaN(val1) || Number.isNaN(val2)) {
    return 0
  }
  val1 = Number(val1)
  val2 = Number(val2)
  if (Number.isInteger(val1) && Number.isInteger(val2)) {
    return val1 * val2
  }
  var m = 0
  try {
    m +=
      val1.toString().indexOf('.') > -1
        ? val1.toString().split('.')[1].length
        : 0
  } catch (e) {
    m = 0
  }
  try {
    m +=
      val2.toString().indexOf('.') > -1
        ? val2.toString().split('.')[1].length
        : 0
  } catch (e) {
    m = 0
  }
  var result =
    (Number(val1.toString().replace('.', '')) *
      Number(val2.toString().replace('.', ''))) /
    Math.pow(10, m)
  if (!fixNum || Number.isNaN(fixNum)) {
    return result
  } else {
    return result.toFixed(fixNum)
  }
}

export function div(val1, val2, fixNum) {
  if (val1 === null || val2 === null) {
    return null
  }
  if (!val1 || !val2) {
    return 0
  }
  if (Number.isNaN(val1) || Number.isNaN(val2) || val2 === 0) {
    return 0
  }
  val1 = Number(val1)
  val2 = Number(val2)
  var result = 0
  if (Number.isInteger(val1) && Number.isInteger(val2)) {
    result = val1 / val2
  } else {
    var l1 = 0
    var l2 = 0
    try {
      l1 =
        val1.toString().indexOf('.') > -1
          ? val1.toString().split('.')[1].length
          : 0
    } catch (e) {}
    try {
      l2 =
        val2.toString().indexOf('.') > -1
          ? val2.toString().split('.')[1].length
          : 0
    } catch (e) {}
    result =
      Number(val1.toString().replace('.', '')) /
      Number(val2.toString().replace('.', ''))
    var l3 = 0
    if (result.toString().indexOf('.') > -1) {
      var inteStr = result.toString().split('.')[0]
      var deciStr = result.toString().split('.')[1]
      l3 = deciStr.length
      if (l3 > 100) {
        result = Number(inteStr + deciStr.substring(0, 100))
        l3 = 100
      } else {
        result = Number(inteStr + deciStr)
      }
    }
    result =
      l2 - l1 - l3 > 0
        ? result * Math.pow(10, l2 - l1 - l3)
        : result / Math.pow(10, l1 - l2 + l3)
  }
  if (!fixNum || Number.isNaN(fixNum)) {
    return result
  } else {
    return result.toFixed(fixNum)
  }
}

export function continuousCal(...params) {
  if (
    params.some(item => {
      return item === null
    })
  ) {
    return null
  }
  var sum = params.reduce((prev, curr) => {
    return add(prev, curr)
  }, 0)
  return sum
}

export function toFixedNumber(num, fixNum) {
  if (num === null || num === undefined) {
    return null
  }
  if (typeof num === 'string') {
    return Number(Number(num).toFixed(fixNum))
  }
  return Number(num.toFixed(fixNum))
}

export function decimalSplit(num, sNum) {
  if (num === null || num === undefined) {
    return null
  }
  var numStr = num.toString()
  if (numStr.indexOf('.') < 0) {
    return Number(num)
  }
  var dLength = numStr.split('.')[1].length
  if (sNum >= dLength) {
    return num
  } else {
    return numStr.substring(0, numStr.length - (dLength - sNum))
  }
}

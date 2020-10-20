import Vue from 'vue'

// json
Vue.filter('jsonFormat', function (cellValue, json) {
  let text = cellValue
  if (json && json[cellValue]) {
    text = json[cellValue]
  }
  return text
})

// 数据字典
Vue.filter('dataDictFormat', function (cellValue, dataDictLang) {
  if (!cellValue || !dataDictLang) return
  const type = typeof cellValue
  let text = ''
  if (type === 'object') {
    for (let i = 0; i < dataDictLang.length; i++) {
      if (cellValue.includes(dataDictLang[i] && dataDictLang[i].value)) {
        text += dataDictLang[i].label + ','
      }
    }
    return text.substring(0, text.length - 1)
  } else if (type === 'string') {
    for (let i = 0; i < dataDictLang.length; i++) {
      if (dataDictLang[i] && dataDictLang[i].value === cellValue) {
        text = dataDictLang[i].label
        break
      }
    }
    return text
  }
})

// 请求下拉框数据回显
// value: 默认传入原值
// data: 需要遍历的数组
// paramsFn: 需要获取回显的字段名
// params: 判断依据字段
Vue.filter('dataListFormat', function (value, data, paramsFn, params = 'id') {
  for (const i in data) {
    if (data[i][params] === value) return data[i][paramsFn]
  }
})

// 数量num:'###,###'
Vue.filter('num', function (value) {
  return thousands(value, 0)
})

// 整数integer:'###,###'
Vue.filter('integer', function (value) {
  if (value === '' || value === undefined || value === null || isNaN(value)) return
  value = Number(value).toFixed(0)
  if (/\./.test(value)) {
    return value.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\d{3}(?![.]|$)/g, '$&')
  } else {
    return value.replace(/\d(?=(\d{3})+$)/g, '$&,')
  }
})

// 重量  weight:'###,###.000'
Vue.filter('weight', function (value) {
  return thousands(value, 6)
})

// 单价 price:'###,###.00'
Vue.filter('price', function (value) {
  return thousands(value, 8)
})

// 金额 money:'###,###.00'
Vue.filter('money', function (value) {
  return thousands(value, 2)
})
Vue.filter('is', function (value) {
  return +value ? '是' : '否'
})
Vue.filter('isState', function (value) {
  return +value ? '启用' : '停用'
})
Vue.filter('isAccType', function (value) {
  return +value === 1 ? '记' : '转'
})
// 汇率 exchangeRate:'###,###.0000'
Vue.filter('exchangeRate', function (value) {
  return thousands(value, 4)
})
// 无税单价 exprice:'###,###.000000'
Vue.filter('exprice', function (value) {
  return thousands(value, 6)
})

// 税率 taxrate:'###,###.00'
Vue.filter('taxrate', function (value) {
  const taxrate = thousands(value, 2)
  return taxrate ? taxrate + '%' : taxrate
})

// 百分数
Vue.filter('percent', function (value) {
  if (value === '' || value === undefined || value === null || isNaN(value)) return
  return value ? value + '%' : value
})

// 千分位化
Vue.filter('thousands', function (value, digit) {
  return thousands(value, digit)
})

function thousands(value, digit) {
  if (value === '' || value === undefined || value === null || isNaN(value)) return
  if (!digit) {
    value = value.toString()
  } else {
    value = Number(value).toFixed(digit)
  }
  if (/\./.test(value)) {
    return value.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\d{3}(?![.]|$)/g, '$&')
  } else {
    return value.replace(/\d(?=(\d{3})+$)/g, '$&,')
  }
}

// 2、传入 时间参数 返回 type 形式 String
Vue.filter('dateFormat', function (value, type) {
  if (!value) return
  // yyyyMMdd 转 yyyy-MM-dd
  if (typeof value === 'string') {
    if (type === 'HH:mm:ss' && value.length === 6) {
      return value.substr(0, 2) + ':' + value.substr(2, 2) + ':' + value.substr(4, 6)
    } else if (value.length === 8) {
      return value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2)
    } else if (value.length === 19 && type === 'yyyy-MM-dd') {
      return value.substr(0, 10)
    }
  }
  // new Date 转 YYYY-MM-DD 或其他格式
  if (type === 'YYYY-MM-DD') {
    return type.replace(/([a-z]+)/gi, function (a, b, c, d) {
      if (/Y{2,}/.test(b)) {
        return b.length === 4 ? value.getFullYear() : ('' + value.getFullYear()).substr(2)
      } else if (/M{2}/.test(b)) {
        return value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1
      } else if (/D{2}/.test(b)) {
        return value.getDate() < 10 ? '0' + value.getDate() : value.getDate()
      } else if (/h{2}/.test(b)) {
        return value.getHours() < 10 ? '0' + value.getHours() : value.getHours()
      } else if (/m{2}/.test(b)) {
        return value.getMinutes() < 10 ? '0' + value.getMinutes() : value.getMinutes()
      } else if (/s{2}/.test(b)) {
        return value.getSeconds() < 10 ? '0' + value.getSeconds() : value.getSeconds()
      } else {
        return 0
      }
    })
  } else if (type === 'yyyyMMdd') {
    var o = {
      'M+': value.getMonth() + 1,
      'd+': value.getDate(),
      'h+': value.getHours(),
      'm+': value.getMinutes(),
      's+': value.getSeconds(),
      'q+': Math.floor((value.getMonth() + 3) / 3),
      S: value.getMilliseconds()
    }
    if (/(y+)/.test(value)) {
      value = value.replace(
        RegExp.$1,
        (value.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(value)) {
        value = value.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return value
  } else if (type === 'YYYY-MM-DD 24hh:mm:ss') {
    if (typeof value === 'string') {
      return value.substr(0, 19)
    }
  }
})

// 动态商品属性KEY取NAME
Vue.filter('dataDictAttrFormat', function (cellValue, dataDictLang) {
  let text = ''
  for (let i = 0; i < dataDictLang.length; i++) {
    if (dataDictLang[i] && dataDictLang[i].key === cellValue) {
      text = dataDictLang[i].label
      break
    }
  }
  return text
})

// 格式化金额/单价/数量 digit：金额：2 单价： 8 数量： 3
Vue.filter('numFilter', function (value, digit) {
  if (value === undefined || !digit) return
  return Number(value).toFixed(digit)
})

import Vue from 'vue'
import store from '../../store'

// 将小数转换为百分比
Vue.filter('toPercent', function(val, acc) {
  let num = parseFloat(val)
  if (isNaN(num)) {
    num = 0
  }
  let accuracy = parseInt(acc)
  if (isNaN(accuracy) || accuracy < 0 || accuracy > 10) {
    accuracy = 2
  }
  return (num * 100).toFixed(accuracy) + '%'
})

// 格式化单价小数位
Vue.filter('priceFilter', function(value, digit) {
  digit = store.getters.precision.priceDigit
  if (value === undefined || !digit) {
    digit = 2
  }
  if (value === undefined) {
    return ''
  } else {
    return Number(value).toFixed(digit)
  }
})

// 格式化数量小数位
Vue.filter('quantityFilter', function(value, digit) {
  digit = store.getters.precision.quantityDigit
  if (value === undefined || !digit) {
    digit = 3
  }
  if (value === undefined) {
    return ''
  } else {
    return Number(value).toFixed(digit)
  }
})

// 格式化金额小数位
Vue.filter('moneyFilter', function(value, digit) {
  digit = store.getters.precision.moneyDigit
  if (value === undefined || !digit) {
    digit = 6
  }
  if (value === undefined) {
    return ''
  } else {
    return Number(value).toFixed(digit)
  }
})

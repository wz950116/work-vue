import Vue from 'vue'
import { Decimal } from 'decimal.js'
const toolUtil = {

  getDefaultPickerOptions() {
    return {
      shortcuts: [
        {
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        },
        {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }
      ]
    }
  },

  dataFormat(func = 'dataDictFormat', value, list) {
    return Vue.filter(func)(value, list)
  },
  // 最近一周
  getLatestWeek() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    return [this.dateFormateToYYYYMMDD(start), this.dateFormateToYYYYMMDD(end)]
  },

  // 最近一个月
  getLatestMonth() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    return [this.dateFormateToYYYYMMDD(start), this.dateFormateToYYYYMMDD(end)]
  },
  // 最近三个月
  getLatestThreeMonth() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    return [this.dateFormateToYYYYMMDD(start), this.dateFormateToYYYYMMDD(end)]
  },
  getScopeThreeMonth() {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 45)
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 45)
    return [this.dateFormateToYYYYMMDD(start), this.dateFormateToYYYYMMDD(end)]
  },
  getDayAfter(addDayCount) {
    var dd = new Date()
    dd.setDate(dd.getDate() + addDayCount) // 获取AddDayCount天后的日期
    var y = dd.getFullYear()
    var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
    return y + '' + m + '' + d
  },
  formatDate(value) {
    if (value === null || value === undefined) {
      return ''
    }
    if (value.length === 8) {
      return value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2)
    }
    return value
  },
  // 时间格式化
  dateFormateToYYYYMMDD(value) {
    return value.getFullYear() + '' + (value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1 + '') + (value.getDate() < 10 ? '0' + value.getDate() : value.getDate() + '')
  },
  /**
   * 取得当前日期(yyyyMMdd)
   */
  todayYYYYMMDD() {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const d = now.getDate()
    return (y * 10000 + m * 100 + d).toString()
  },
  /**
   * 取得当前日期(yyyy-MM-dd)
   */
  todayStr() {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const d = now.getDate()
    return y + (m < 10 ? '-0' : '-') + m + (d < 10 ? '-0' : '-') + d
  },

  /**
   * 取得当前时间
   */
  timeStr() {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    const d = now.getDate()
    const h = now.getHours()
    const n = now.getMinutes()
    const s = now.getSeconds()
    return y + (m < 10 ? '-0' : '-') + m + (d < 10 ? '-0' : '-') + d + (h < 10 ? ' 0' : ' ') + h + (n < 10 ? ':0' : ':') + n + (s < 10 ? ':0' : ':') + s
  },
  /**
   * 取得当前时间（hhnnss）
   */
  currentTimeStr() {
    const now = new Date()
    const h = now.getHours()
    const n = now.getMinutes()
    const s = now.getSeconds()
    return h + (n < 10 ? '0' : '') + n + (s < 10 ? '0' : '') + s
  },

  isEmpty(obj) {
    return obj === undefined || obj === null || obj === ''
  },
  isNotEmpty(obj) {
    return !this.isEmpty(obj)
  },
  /**
 * 取得当前生产年度(yyyy)
 */
  getProductYear() {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + 1
    if (m < 6) {
      return (y - 1).toString()
    }
    return y.toString()
  },
  /**
   * 计算两个日期之间的天数
   * @param dateFromStr  开始日期 yyyy-MM-dd
   * @param dateToStr  结束日期 yyyy-MM-dd
   * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
   */
  getDaysBetween(dateFromStr, dateToStr) {
    const startDate = Date.parse(this.formatDate(dateFromStr))
    const endDate = Date.parse(this.formatDate(dateToStr))
    if (startDate > endDate) {
      return 0
    }
    const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000) + 1
    return isNaN(days) ? null : days
  },
  /**
   * 默认值
   *
   * @param {*} obj 当前值
   * @param {*} defaultVal 默认值
   */
  defaultVal(obj, defaultVal) {
    if (this.isNotEmpty(obj)) {
      return obj
    }
    if (this.isNotEmpty(defaultVal)) {
      return defaultVal
    }
    return obj
  },
  /**
   * 格式化
   *
   * @param {String} text 文本
   * @param {Array} array 占位值数值
   */
  format(text, array) {
    if (this.isEmpty(text)) {
      return ''
    }
    if (array && Array.isArray(array)) {
      if (array.length < 1) {
        return text
      }
      for (const index in array) {
        text = text.replace('{' + index + '}', array[index])
      }
    }
    return text
  },
  /**
   * 数字转换
   * @param  字符串 str
   */
  toNum(str) {
    if (typeof str === 'string') {
      str = str.trim()
      str = str.replace(/([^(\d|\.|\-)])/g, '')
    }
    const num = parseFloat(str)
    return isNaN(num) ? null : num
  },
  toString(obj) {
    if (obj === null || obj === undefined) {
      return ''
    } else {
      return obj.toString()
    }
  },
  /**
   * 取得EditFrom自身的数据
   * @param {Object} self 自身this
   * @returns EditFrom数据
   */
  getDataEditFromSelf(self) {
    if (self.$children[0].editForm) {
      return self.$children[0].editForm
    }
    if (self.$children[0].$children[0].editForm) {
      return self.$children[0].$children[0].editForm
    }
    let refForm = self.$children[0].$children[0].$refs['refForm']
    if (Array.isArray(refForm)) {
      refForm = refForm[0]
    }
    return refForm.model
  },
  /**
   * 取得Tab自身的数据
   * @param {Object} self 自身this
   * @returns Tab表格数据
   */
  getDataTabFromSelf(self) {
    return self.$children[0].tableData
  },
  /**
   * 从编辑页中取得Tab表格数据
   * @param {Object} self  自身this
   * @param {String} tabName  标签名
   * @returns Tab表格数据
   */
  getDataTabFromEdit(self, tabName) {
    const tabRef = this.getRefTabFromEdit(self, tabName)
    if (tabRef == null) {
      return null
    }
    return tabRef.$children[0].tableData
  },
  /**
   * 从Tab页中取得EditFrom数据
   * @param {Object} self 自身this
   * @returns EditFrom数据
   */
  getDataEditFromTab(self) {
    if (self.$parent.$parent.$parent.editForm) {
      return self.$parent.$parent.$parent.editForm
    } else {
      return self.editForm
    }
  },
  /**
   * 从Tab页中取得Tab表格数据
   * @param {Object} self  自身this
   * @param {String} tabName  标签名
   * @returns Tab表格数据
   */
  getDataTabFromTab(self, tabName) {
    if (Array.isArray(self.$parent.$refs[tabName])) {
      return self.$parent.$refs[tabName][0].$children[0].tableData
    } else if (Array.isArray(self.$parent.$parent.$parent.$refs[tabName])) {
      return self.$parent.$parent.$parent.$refs[tabName][0].$children[0].tableData
    } else {
      return null
    }
  },
  /**
   * 从编辑页中取得Tab的引用
   * @param {Object} self 自身this
   * @param {String} tabName  标签名
   * @returns Tab的引用，可以执行其中的方法
   */
  getRefTabFromEdit(self, tabName) {
    if (self.$children[0].componentName === 'QmRouteEdit') {
      if (Array.isArray(self.$children[0].$refs[tabName])) {
        return self.$children[0].$refs[tabName][0]
      } else {
        return null
      }
    }
    if (Array.isArray(self.$children[0].$refs.qmRouteEdit.$refs[tabName])) {
      return self.$children[0].$refs.qmRouteEdit.$refs[tabName][0]
    } else {
      return null
    }
  },
  /**
   * 从Tab页中取得EditFrom的引用
   * @param {Object} self 自身this
   * @returns EditFrom的引用，可以执行其中的方法
   */
  getRefEditFromTab(self) {
    if (self.$parent.$parent.$children[0].componentName === 'QmRouteEdit') {
      return self.$parent.$parent
    }
    return self.$parent.$parent.$parent.$parent.$parent
  },
  /**
   * 从Tab页中取得Tab的引用
   * @param {Object} self  自身this
   * @param {String} tabName  标签名
   * @returns Tab的引用，可以执行其中的方法
   */
  getRefTabFromTab(self, tabName) {
    if (Array.isArray(self.$parent.$refs[tabName])) {
      return self.$parent.$refs[tabName][0]
    } else if (Array.isArray(self.$parent.$parent.$parent.$refs[tabName])) {
      return self.$parent.$parent.$parent.$refs[tabName][0]
    } else {
      return null
    }
  },

  /**
   * 取得表单项目定义
   * @param {Object} self  自身this
   * @param {String} itemName 项目名称
   * @returns 表单项目定义
   */
  getDefDialogItemByProp(self, itemName) {
    const formData = self.dialog.formData
    if (Array.isArray(formData)) {
      for (let i = 0; i < formData.length; i++) {
        if (formData[i].prop) {
          if (formData[i].prop === itemName) {
            return formData[i]
          }
        } else if (Array.isArray(formData[i].props)) {
          for (let j = 0; j < formData[i].props.length; j++) {
            if (formData[i].props[j] === itemName) {
              return formData[i]
            }
          }
        }
      }
    }
  },
  /**
   * 取得表单项目定义
   * @param {Object} self  自身this
   * @param {String} itemName 项目名称
   * @returns 表单项目定义
   */
  getDefFormItemByProp(self, itemName) {
    const formData = self.edit.formData
    if (Array.isArray(formData)) {
      for (let i = 0; i < formData.length; i++) {
        if (formData[i].prop) {
          if (formData[i].prop === itemName) {
            return formData[i]
          }
        } else if (Array.isArray(formData[i].props)) {
          for (let j = 0; j < formData[i].props.length; j++) {
            if (formData[i].props[j] === itemName) {
              return formData[i]
            }
          }
        }
      }
    } else {
      for (const partName in formData) {
        const part = formData[partName].content
        for (let i = 0; i < part.length; i++) {
          if (part[i].prop) {
            if (part[i].prop === itemName) {
              return part[i]
            }
          } else if (Array.isArray(part[i].props)) {
            for (let j = 0; j < part[i].props.length; j++) {
              if (part[i].props[j] === itemName) {
                return part[i]
              }
            }
          }
        }
      }
    }
  },
  /**
   * 取得表格列的定义
   * @param {Object} self  自身this
   * @param {String} tabName 标签名
   * @param {String} colName 列名称
   * @returns 表格列的定义
   */
  getDefTableColByProp(self, tabName, colName) {
    const tblRef = this.getRefTabFromEdit(self, tabName)
    if (tblRef == null) {
      return null
    }
    const tbl = tblRef.tab.table
    const cols = tbl.cols
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].prop === colName) {
        return cols[i]
      }
    }
  },
  /**
   * 通过prop获取定义项
   * @param {Array} defItems 定义项集合
   * @param {String} prop prop
   */
  getDefItemByProp(defItems, prop) {
    defItems = defItems || []
    for (const defItem of defItems) {
      if (defItem.prop === prop) {
        return defItem
      }
    }
    return {}
  },
  /**
   * 通过label获取定义项
   * @param {Object} self this对象
   * @param {Array} defItems 定义项集合
   * @param {String} label label值
   */
  getDefItemByLabel(self, defItems, label) {
    defItems = defItems || []
    for (const defItem of defItems) {
      if (self.$t(defItem.label) === label) {
        return defItem
      }
    }
    return {}
  },
  uuid() {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)
    let str = new Date().getTime().toString(16)
    for (let i = 0; i < 16; i++) {
      if (array[i] < 16) {
        str += '0'
      }
      str += array[i].toString(16)
    }
    return str.substr(0, 32)
  },
  arraySort(array, comparator) {
    if (!Array.isArray(array)) {
      return
    }
    if (array.length <= 1) {
      return
    }
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i + 1; j < array.length; j++) {
        const cp = comparator(array[i], array[j])
        if (cp > 0) {
          const tmp = array[j]
          array[j] = array[i]
          array[i] = tmp
        }
      }
    }
  },
  arraySortByProps(array, props) {
    if (!Array.isArray(array)) {
      return
    }
    if (array.length <= 1) {
      return
    }
    if (arguments.length < 2) {
      return
    }
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i + 1; j < array.length; j++) {
        const e1 = array[i]
        const e2 = array[j]
        var c = 0
        for (let k = 1; k < arguments.length; k++) {
          const prop = arguments[k]
          const v1 = e1[prop]
          const v2 = e2[prop]
          if (v1 === v2) {
            continue
          }
          if (v1 === undefined) {
            c = -1
            break
          } else if (v2 === undefined) {
            c = 1
            break
          } else if (v1 === null) {
            c = -1
            break
          } else if (v2 === null) {
            c = 1
            break
          } else if (v1 === false) {
            c = -1
            break
          } else if (v2 === false) {
            c = 1
            break
          }
        }
        if (c > 0) {
          array[i] = e2
          array[j] = e1
        }
      }
    }
  },
  toDecimal(param) {
    if (param === null || param === undefined || param === '') {
      return null
    }
    if (typeof param === 'number') {
      return new Decimal(param)
    }
    const str = param.toString().replace(/([^(\d|\.|\-)])/g, '')
    return new Decimal(str)
  },
  /**
   * 为空时 默认为0
   * @param param
   * @returns {Decimal}
   */
  toDecimal2(param) {
    if (param === null || param === undefined || param === '') {
      return new Decimal(0)
    }
    if (typeof param === 'number') {
      return new Decimal(param)
    }
    const str = param.toString().replace(/([^(\d|\.|\-)])/g, '')
    return new Decimal(str)
  },
  getConversionRate() {
    return 22.0462
  },
  /**
   * 单位换算 美分/磅 => 美元/吨
   */
  convertCentsPound2UsdTon(val) {
    if (this.isEmpty(val)) {
      return null
    }
    const pri = this.toNum(val)
    if (pri === null) {
      return null
    }
    // 22.046226218
    return pri * this.getConversionRate()
  },
  /**
   * 单位换算 美元/吨 => 美分/磅
   */
  convertUsdTon2CentsPound(val) {
    if (this.isEmpty(val)) {
      return null
    }
    const pri = this.toNum(val)
    if (pri === null) {
      return null
    }
    // 0.045359237
    return pri * 0.0453592
  },
  /**
   * 计算金额保留小数
   */
  toFixedMoney(val) {
    return val.toFixed(2)
  },
  /**
   * 计算价格保留小数
   */
  toFixedPrice(val) {
    return val.toFixed(2)
  },
  /**
   * 计算无税单价保留小数
   */
  toFixedExPrice(val) {
    return val.toFixed(6)
  },
  /**
   * 计算数量保留小数
   */
  toFixedWeight(val) {
    return val.toFixed(6)
  }
}

window.dateFormateToYYYYMMDD = value => {
  return value.getFullYear() + '' + (value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1 + '') + (value.getDate() < 10 ? '0' + value.getDate() : value.getDate() + '')
}
export default toolUtil

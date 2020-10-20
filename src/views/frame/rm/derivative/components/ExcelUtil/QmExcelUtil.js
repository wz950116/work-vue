const QmExcelUtil = {
  /**
   * 将Excel列的数字形式转换为AA形式
   * @param {number} num Excel列的数字形式(从1开始)
   * @returns {string} Excel列的AA形式
   */
  excelNumToCol(num) {
    const baseCharCode = 'A'.charCodeAt()
    if (num <= 26) {
      return String.fromCharCode(baseCharCode + num - 1)
    } else if (num <= 702) {
      let n1 = num % 26
      let n2 = parseInt(Math.floor(num / 26))
      if (n1 === 0) {
        n1 = 26
        n2 = n2 - 1
      }
      return String.fromCharCode(baseCharCode + n2 - 1) + String.fromCharCode(baseCharCode + n1 - 1)
    } else {
      let n1 = num % 26
      let nx = parseInt(Math.floor(num / 26))
      if (n1 === 0) {
        n1 = 26
        nx = nx - 1
      }
      let n2 = nx % 26
      let n3 = parseInt(Math.floor(nx / 26))
      if (n2 === 0) {
        n2 = 26
        n3 = n3 - 1
      }
      return String.fromCharCode(baseCharCode + n3 - 1) + String.fromCharCode(baseCharCode + n2 - 1) + String.fromCharCode(baseCharCode + n1 - 1)
    }
  },
  /**
   * 将Excel列的AA形式转换为数字形式
   * @param {string} col Excel列的AA形式
   * @returns {number} Excel列的数字形式(从1开始)
   */
  excelColToNum(col) {
    const baseCharCode = 'A'.charCodeAt()
    if (col.length === 1) {
      const n1 = col.charCodeAt() - baseCharCode + 1
      return n1
    } else if (col.length === 2) {
      const n1 = col.substr(0, 1).charCodeAt() - baseCharCode + 1
      const n2 = col.substr(1, 1).charCodeAt() - baseCharCode + 1
      return n1 + n2 * 26
    } else {
      const n1 = col.substr(0, 1).charCodeAt() - baseCharCode + 1
      const n2 = col.substr(1, 1).charCodeAt() - baseCharCode + 1
      const n3 = col.substr(2, 1).charCodeAt() - baseCharCode + 1
      return n1 + n2 * 26 + n3 * 26 * 26
    }
  },
  /**
   * 将Excel参照范围的A1:G5的形式转换为{ left:1, top:1, right:7, bottom:5 }的形式
   * @param {string} ref Excel参照范围的A1:G5的形式
   * @returns {object}  Excel参照范围的{ left:1, top:1, right:7, bottom:5 }的形式
   */
  excelNumRange(ref) {
    const spIdx = ref.indexOf(':')
    const cellLT = ref.substr(0, spIdx)
    const cellRB = ref.substr(spIdx + 1)
    let left = ''
    let top = ''
    let right = ''
    let bottom = ''
    for (let i = 0; i < cellLT.length; i++) {
      const c = cellLT.charAt(i)
      if (c >= 'A' && c <= 'Z') {
        left = left + c
      } else if (c >= '0' && c <= '9') {
        top = top + c
      }
    }
    for (let i = 0; i < cellRB.length; i++) {
      const c = cellRB.charAt(i)
      if (c >= 'A' && c <= 'Z') {
        right = right + c
      } else if (c >= '0' && c <= '9') {
        bottom = bottom + c
      }
    }
    return {
      left: this.excelColToNum(left),
      top: parseInt(top),
      right: this.excelColToNum(right),
      bottom: parseInt(bottom)
    }
  },
  /**
   * 日期转换为数字
   * @param {date} date 日期
   * @returns {number} 数字
   */
  excelDate2Num(date) {
    const ms1970_1900 = 2208988800000
    const offset = parseInt((date.getTime() + ms1970_1900) / 1000) - date.getTimezoneOffset() * 60
    return offset / 86400 + 2
  },
  /**
   * 数字转换为日期
   * @param {number} num 数字
   * @returns {date} 日期
   */
  excelNum2Date(num) {
    const ms1970_1900 = 2208988800000
    var dt = new Date()
    num = (num - 2) * 86400 + dt.getTimezoneOffset() * 60
    num = num * 1000 - ms1970_1900
    dt.setTime(num)
    return dt
  },
  isEmpty(sheet, ref) {
    const cell = sheet[ref]
    if (cell === undefined) {
      return true
    }
    if (cell.t === 'z') {
      return true
    }
    if (cell.t === 's') {
      if (cell.v.trim() === '') {
        return true
      } else {
        return false
      }
    }
    return cell.v === undefined || cell.v === null
  },
  /**
   * 以字符串形式取得单元格的值
   * @param {*} sheet Sheet
   * @param {string} ref 单元格的位置，比如A1
   * @returns {string} 单元格的值
   */
  excelCellText(sheet, ref) {
    const cell = sheet[ref]
    if (cell === undefined) {
      return ''
    }
    let str = cell.w
    if (str === undefined) {
      str = '' + cell.v
    }
    return str.trim()
  },
  /**
   * 以字符串形式取得单元格的值
   * @param {*} sheet Sheet
   * @param {string} ref 单元格的位置，比如A1
   * @returns {string} 单元格的值
   */
  excelCellTextMap(sheet, ref, map) {
    const cell = sheet[ref]
    if (cell === undefined) {
      return null
    }
    let str = cell.w
    if (str === undefined) {
      str = '' + cell.v
    }
    str = str.trim()
    const mapV = map[str]
    if (mapV === undefined) {
      return null
    }
    return mapV
  },
  /**
   * 以数字形式取得单元格的值
   * @param {*} sheet Sheet
   * @param {string} ref 单元格的位置，比如A1
   * @returns {number} 单元格的值
   */
  excelCellNum(sheet, ref) {
    const cell = sheet[ref]
    if (cell === undefined) {
      return null
    }
    if (cell.t === 'n') {
      return cell.v
    } else if (cell.t === 'd') {
      return this.excelDate2Num(cell.v)
    } else if (cell.t === 's') {
      const str = cell.v
      if (/^(-)?(\d+[,\d]*)(\.\d+)?$/.test(str)) {
        return parseFloat(str)
      } else {
        return null
      }
    } else if (cell.t === 'b') {
      return null
    }
  },
  /**
   * 以日期形式取得单元格的值
   * @param {*} sheet Sheet
   * @param {string} ref 单元格的位置，比如A1
   * @returns {string} 单元格的值(yyyyMMdd)
   */
  excelCellDate(sheet, ref) {
    const cell = sheet[ref]
    if (cell === undefined) {
      return null
    }
    if (cell.t === 'd') {
      const y = cell.v.getFullYear()
      const m = cell.v.getMonth() + 1
      const d = cell.v.getDate()
      return this.ymdToDateStr(y, m, d)
    } else if (cell.t === 'n') {
      const date = this.excelNum2Date(cell.v)
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      return this.ymdToDateStr(y, m, d)
    } else if (cell.t === 's') {
      const str = cell.v.trim()
      if (/^\d{4}\-\d{1,2}\-\d{1,2}( +\d{1,2}:\d{1,2}(:\d{1,2})?)?$/.test(str)) {
        const idx1 = str.indexOf('-')
        const idx2 = str.lastIndexOf('-')
        const y = parseInt(str.substring(0, idx1))
        const m = parseInt(str.substring(idx1 + 1, idx2))
        const d = parseInt(str.substring(idx2 + 1))
        return this.ymdToDateStr(y, m, d)
      } else if (/^\d{4}\/\d{1,2}\/\d{1,2}$( +\d{1,2}:\d{1,2}(:\d{1,2})?)?/.test(str)) {
        const idx1 = str.indexOf('/')
        const idx2 = str.lastIndexOf('/')
        const y = parseInt(str.substring(0, idx1))
        const m = parseInt(str.substring(idx1 + 1, idx2))
        const d = parseInt(str.substring(idx2 + 1))
        return this.ymdToDateStr(y, m, d)
      } else {
        return null
      }
    } else {
      return null
    }
  },
  excelCellTime(sheet, ref) {
    const cell = sheet[ref]
    if (cell === undefined) {
      return null
    }
    if (cell.t === 'd') {
      const h = cell.v.setHours()
      const m = cell.v.getMinutes()
      const s = cell.v.getSeconds()
      return this.hmsToTimeStr(h, m, s)
    } else if (cell.t === 'n') {
      const date = this.excelNum2Date(cell.v)
      const h = date.setHours()
      const m = date.getMinutes()
      const s = date.getSeconds()
      return this.hmsToTimeStr(h, m, s)
    } else if (cell.t === 's') {
      let str = cell.v.trim()
      if (/^(\d{4}\-\d{1,2}\-\d{1,2} +)?\d{1,2}:\d{1,2}(:\d{1,2})?$/.test(str)) {
        if (str.indexOf(' ') > 0) {
          str = str.substring(str.indexOf(' ') + 1)
        }
        let h = 0
        let m = 0
        let s = 0
        const idx1 = str.indexOf(':')
        const idx2 = str.lastIndexOf(':')
        if (idx2 > idx1) {
          h = parseInt(str.substring(0, idx1))
          m = parseInt(str.substring(idx1 + 1, idx2))
          s = parseInt(str.substring(idx2 + 1))
        } else {
          h = parseInt(str.substring(0, idx1))
          m = parseInt(str.substring(idx2 + 1))
          s = 0
        }
        return this.hmsToTimeStr(h, m, s)
      } else if (/^(\d{4}\/\d{1,2}\/\d{1,2} +)?\d{1,2}:\d{1,2}(:\d{1,2})?$/.test(str)) {
        if (str.indexOf(' ') > 0) {
          str = str.substring(str.indexOf(' ') + 1)
        }
        let h = 0
        let m = 0
        let s = 0
        const idx1 = str.indexOf(':')
        const idx2 = str.lastIndexOf(':')
        if (idx2 > idx1) {
          h = parseInt(str.substring(0, idx1))
          m = parseInt(str.substring(idx1 + 1, idx2))
          s = parseInt(str.substring(idx2 + 1))
        } else {
          h = parseInt(str.substring(0, idx1))
          m = parseInt(str.substring(idx2 + 1))
          s = 0
        }
        return this.hmsToTimeStr(h, m, s)
      } else {
        return null
      }
    } else {
      return null
    }
  },
  ymdToDateStr(y, m, d) {
    const date = new Date()
    date.setDate(1)
    date.setFullYear(y)
    date.setMonth(m - 1)
    date.setDate(d)
    if (date.getFullYear() === y && (date.getMonth() + 1) === m && date.getDate() === d) {
      const ymd = y * 10000 + m * 100 + d
      return '' + ymd
    } else {
      return null
    }
  },
  hmsToTimeStr(h, m, s) {
    const date = new Date()
    date.setHours(h)
    date.setMinutes(m)
    date.setSeconds(s)
    if (date.getHours() === h && date.getMinutes() === m && date.getSeconds() === s) {
      const hms = h * 10000 + m * 100 + s
      return h < 10 ? '0' + hms : '' + hms
    } else {
      return null
    }
  },
  checkCellNotEmpty(sheet, ref, itm) {
    return this.isEmpty(sheet, ref) ? '【' + itm + '】不可为空。' : ''
  },
  checkCellNum(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref) || sheet[ref].v === '--') {
      return ''
    }
    return this.excelCellNum(sheet, ref) === null ? '【' + itm + '】格式不正确。' : ''
  },
  checkCellInt(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref) || sheet[ref].v === '--') {
      return ''
    }
    const num = this.excelCellNum(sheet, ref)
    if (num === null) {
      return '【' + itm + '】格式不正确。'
    }
    return Math.floor(num) === num ? '' : '【' + itm + '】必须为整数。'
  },
  checkCellNotMinusNum(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref) || sheet[ref].v === '--') {
      return ''
    }
    const num = this.excelCellNum(sheet, ref)
    if (num === null) {
      return '【' + itm + '】格式不正确。'
    }
    return num < 0 ? '【' + itm + '】不可为负数。' : ''
  },
  checkCellNotMinusInt(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref) || sheet[ref].v === '--') {
      return ''
    }
    const num = this.excelCellNum(sheet, ref)
    if (num === null) {
      return '【' + itm + '】格式不正确。'
    }
    if (num < 0) {
      return '【' + itm + '】不可为负数。'
    }
    return Math.floor(num) === num ? '' : '【' + itm + '】必须为整数。'
  },
  checkCellDate(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref)) {
      return ''
    }
    return this.excelCellDate(sheet, ref) === null ? '【' + itm + '】格式不正确。' : ''
  },
  checkCellTime(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref)) {
      return ''
    }
    return this.excelCellTime(sheet, ref) === null ? '【' + itm + '】格式不正确。' : ''
  },
  checkCellNotEmptyNum(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref) || sheet[ref].v === '--') {
      return '【' + itm + '】不可为空。'
    }
    return this.excelCellNum(sheet, ref) === null ? '【' + itm + '】格式不正确。' : ''
  },
  checkCellNotEmptyInt(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref) || sheet[ref].v === '--') {
      return '【' + itm + '】不可为空。'
    }
    const num = this.excelCellNum(sheet, ref)
    if (num === null) {
      return '【' + itm + '】格式不正确。'
    }
    return Math.floor(num) === num ? '' : '【' + itm + '】必须为整数。'
  },
  checkCellNotEmptyNotMinusNum(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref) || sheet[ref].v === '--') {
      return '【' + itm + '】不可为空。'
    }
    const num = this.excelCellNum(sheet, ref)
    if (num === null) {
      return '【' + itm + '】格式不正确。'
    }
    return num < 0 ? '【' + itm + '】不可为负数。' : ''
  },
  checkCellNotEmptyNotMinusInt(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref) || sheet[ref].v === '--') {
      return '【' + itm + '】不可为空。'
    }
    const num = this.excelCellNum(sheet, ref)
    if (num === null) {
      return '【' + itm + '】格式不正确。'
    }
    if (num < 0) {
      return '【' + itm + '】不可为负数。'
    }
    return Math.floor(num) === num ? '' : '【' + itm + '】必须为整数。'
  },
  checkCellNotEmptyDate(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref)) {
      return '【' + itm + '】不可为空。'
    }
    return this.excelCellDate(sheet, ref) === null ? '【' + itm + '】格式不正确。' : ''
  },
  checkCellNotEmptyTime(sheet, ref, itm) {
    if (this.isEmpty(sheet, ref)) {
      return '【' + itm + '】不可为空。'
    }
    return this.excelCellTime(sheet, ref) === null ? '【' + itm + '】格式不正确。' : ''
  },
  checlCellTxtMap(sheet, ref, map, itm) {
    if (this.isEmpty(sheet, ref)) {
      return ''
    }
    return this.excelCellTextMap(sheet, ref, map) === null ? '【' + itm + '】值不正确。' : ''
  },
  checlCellNotEmptyTxtMap(sheet, ref, map, itm) {
    if (this.isEmpty(sheet, ref)) {
      return '【' + itm + '】不可为空。'
    }
    return this.excelCellTextMap(sheet, ref, map) === null ? '【' + itm + '】值不正确。' : ''
  }
}
export default QmExcelUtil

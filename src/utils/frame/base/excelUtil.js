import request from '@/utils/frame/base/request'
import { notifyInfo, notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
import { Notification } from 'element-ui'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import XLSX from 'xlsx'

const excelUtil = {
  /**
   * 下载Excel模板
   * @param {*} self 自身引用
   */
  downloadTemplate(self, fileName) {
    return function() {
      const colList = []
      for (let i = 0; i < self.mainData.table.cols.length; i++) {
        const col = self.mainData.table.cols[i]
        if (col.prop) {
          colList.push({
            code: col.prop,
            name: self.$t(col.label)
          })
        }
      }
      request({
        url: '/api/sys/fle/excel/downloadTemplate',
        method: 'POST',
        data: {
          funcModule: '模板',
          funcOperation: '下载',
          data: {
            dataSheetName: fileName,
            colList: colList
          }
        }
      }).then(response => {
        if (response.status) {
          var tmpa = document.createElement('a')
          tmpa.download = fileName + '.xlsx'
          tmpa.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + response.data.excelContent
          tmpa.click()
        }
      })
    }
  },
  uploadExcel(self, fileName, apiUrl) {
    return function(button) {
      const colList = []
      for (let i = 0; i < self.mainData.table.cols.length; i++) {
        const col = self.mainData.table.cols[i]
        if (col.prop) {
          const colCode = col.prop
          const colName = col.label ? self.$t(col.label) : colCode
          const colDict = []
          let dictCode = null
          let funcName = null
          if (col.format && col.format.dict) {
            dictCode = col.format.dict
            for (let i = 0; i < col.format.dict.length; i++) {
              colDict.push({
                key: col.format.dict[i].value,
                val: col.format.dict[i].label
              })
            }
          }
          if (col.format && col.format.func) {
            funcName = col.format.func
          }
          colList.push({
            code: colCode,
            name: colName,
            dictCode: dictCode,
            funcName: funcName,
            dict: colDict
          })
        }
      }

      const fle = document.createElement('input')
      fle.setAttribute('type', 'file')
      fle.addEventListener('change', evt => {
        button.loading = true
        const excelFile = evt.target.files[0]
        if (!(excelFile.name.endsWith('.xlsx') || excelFile.name.endsWith('.csv') || excelFile.name.endsWith('.xls'))) {
          button.loading = false
          Notification(notifyInfo({ msg: self.$t('file.excel.msg.fileExtXlsx') }))
          return
        }
        if (excelFile.size > 1024 * 1024 * 10) {
          button.loading = false
          Notification(notifyInfo({ msg: self.$t('file.excel.msg.fileMaxSize') }))
          return
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', function(evt2) {
          const dataUrl = evt2.target.result
          const spIdx = dataUrl.indexOf(';base64,')
          request({
            url: apiUrl,
            method: 'POST',
            data: {
              funcModule: '模板数据',
              funcOperation: '导入',
              data: {
                dataSheetName: fileName,
                colList: colList,
                excelContent: dataUrl.substr(spIdx + 8)
              }
            }
          })
            .then(response => {
              if (response.status) {
                button.loading = false
                Notification(notifySuccess({ msg: self.$t('biz.msg.saveSuccess') }))
              }
            })
            .catch(e => {
              button.loading = false
            })
        })
        fileReader.readAsDataURL(excelFile)
      })
      fle.click()
    }
  },
  /**
   * 下载Excel模板(自定义列)
   *
   * @param {Object} self this对象
   * @param {String} templateDownloadUrl 模板下载url
   * @param {String} fileName 文件名称
   * @param {String} title 模板标题
   * @param {Array} colList 定义列集合
   * @param {Array} rowList 行数据集合
   */
  downloadTemplateWithRowData(self, templateDownloadUrl, fileName, title, colList, rowList) {
    // 校验downloadTemplateUrl
    if (toolUtil.isEmpty(templateDownloadUrl)) {
      Notification(notifyError({ msg: self.$t('biz.msg.templateDownloadUrlIsEmpty') }))
    }
    // 校验fileName
    if (toolUtil.isEmpty(fileName)) {
      Notification(notifyError({ msg: self.$t('biz.msg.templateFileNameIsEmpty') }))
    }
    // 校验列定义
    if (!Array.isArray(colList)) {
      Notification(notifyError({ msg: self.$t('biz.msg.templateDefColIsEmpty') }))
    }

    request({
      url: templateDownloadUrl,
      method: 'POST',
      data: {
        funcModule: '模板',
        funcOperation: '下载',
        data: {
          // Sheet名称
          sheetName: fileName,
          // 模板标题
          title: title,
          // 列定义
          colList: colList || [],
          // 行数据
          rowList: rowList || []
        }
      }
    }).then(response => {
      if (response.status) {
        var tmpa = document.createElement('a')
        tmpa.download = fileName + '.xlsx'
        tmpa.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + response.data.content
        tmpa.click()
      }
    })
  },
  /**
   * 下载Excel模板(自定义列)
   *
   * @param {Object} self this对象
   * @param {String} templateDownloadUrl 模板下载url
   * @param {String} fileName 文件名称
   * @param {Array} moduleColList 定义列集合
   * @param {Array} rowList 行数据集合
   */
  downloadMultiColModuleTemplateWithRowData(self, templateDownloadUrl, fileName, moduleColList, rowList) {
    // 校验downloadTemplateUrl
    if (toolUtil.isEmpty(templateDownloadUrl)) {
      Notification(notifyError({ msg: self.$t('biz.msg.templateDownloadUrlIsEmpty') }))
    }
    // 校验fileName
    if (toolUtil.isEmpty(fileName)) {
      Notification(notifyError({ msg: self.$t('biz.msg.templateFileNameIsEmpty') }))
    }
    // 校验列定义
    if (!Array.isArray(moduleColList)) {
      Notification(notifyError({ msg: self.$t('biz.msg.templateDefColIsEmpty') }))
    }

    request({
      url: templateDownloadUrl,
      method: 'POST',
      data: {
        funcModule: '模板',
        funcOperation: '下载',
        data: {
          // Sheet名称
          sheetName: fileName,
          // 列定义
          moduleColList: moduleColList || [],
          // 行数据
          rowList: rowList || []
        }
      }
    }).then(response => {
      if (response.status) {
        var tmpa = document.createElement('a')
        tmpa.download = fileName + '.xlsx'
        tmpa.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + response.data.content
        tmpa.click()
      }
    })
  },
  /**
   * 上传模板数据(自定义列)
   * @param {Object} self this对象
   * @param {String} uploadUrl 上传url
   * @param {String} fileName 文件名称
   * @param {Array} colList 定义列集合(注：定义项的prop不能重名！！！)
   * @param {Function} successCallbck 成功回调
   */
  uploadTemplateData(self, uploadUrl, fileName, colList, successCallbck) {
    const fle = document.createElement('input')
    fle.setAttribute('type', 'file')
    fle.click()
    fle.addEventListener('change', evt => {
      const excelFile = evt.target.files[0]
      if (!(excelFile.name.endsWith('.xlsx') || excelFile.name.endsWith('.csv') || excelFile.name.endsWith('.xls'))) {
        Notification(notifyInfo({ msg: self.$t('file.excel.msg.fileExtXlsx') }))
        return
      }
      if (excelFile.size > 1024 * 1024 * 10) {
        Notification(notifyInfo({ msg: self.$t('file.excel.msg.fileMaxSize') }))
        return
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', evt2 => {
        const arrayBuffer = evt2.target.result
        const workbook = XLSX.read(btoa(excelUtil.fixData(arrayBuffer)), { type: 'base64' })
        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
        // 必须包含列标题行
        if (!Array.isArray(excelData) || excelData.length < 2) {
          Notification(notifyInfo({ msg: self.$t('file.excel.msg.fileUploadContentIsEmpty') }))
          return
        }
        // console.info('excel数据：' + JSON.stringify(excelData))
        const contentRowData = excelUtil.getContentRowDataList(excelData, colList)
        request({
          url: uploadUrl,
          method: 'POST',
          data: {
            funcModule: '模板数据',
            funcOperation: '导入',
            data: {
              sheetName: fileName,
              moduleColList: colList,
              contentJson: JSON.stringify(contentRowData)
            }
          }
        })
          .then(response => {
            if (response.status) {
              Notification(notifySuccess({ msg: self.$t('biz.msg.saveSuccess') }))
              if (successCallbck) {
                successCallbck()
              }
            }
          })
          .catch(e => {})
      })
      fileReader.readAsArrayBuffer(excelFile)
    })
  },
  /**
   * 转换编码
   * @param {String} data 二进制数据
   */
  fixData(data) {
    let o = ''
    let l = 0
    const w = 10240
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
    return o
  },
  /**
   * 获取内容行数据
   * @param {Object} excelData excel数据
   * @param {Array} colList 定义项
   */
  getContentRowDataList(excelData, colList) {
    let delColList = []
    colList.forEach(item => {
      item.colList.forEach(col => {
        col.ModuleTitle = item.title
      })
      delColList = delColList.concat(item.colList)
    })

    const titleRow = excelData[0]
    const rowDataList = []
    for (let i = 1; i < excelData.length; i++) {
      const excelRow = excelData[i]
      const rowData = {}
      for (const defCol of delColList) {
        rowData[defCol.code] = this.getCellVal(titleRow, excelRow, defCol)
      }
      rowDataList.push(rowData)
    }
    return rowDataList
  },
  /**
   * 获取单元格值
   * @param {Object} titleRow 列标题行
   * @param {Object} contentRow 内容行
   * @param {Object} col 定义项
   */
  getCellVal(titleRow, contentRow, col) {
    let currentModuleFlag = false
    for (const key in titleRow) {
      if (!currentModuleFlag && key === col.ModuleTitle) {
        currentModuleFlag = true
      }
      if (currentModuleFlag && titleRow[key] === col.name) {
        return this.getCodeByNameByCol(col, contentRow[key])
      }
    }
    return undefined
  },
  /**
   * 通过name获取code
   * @param {Object} col 列信息
   * @param {String} name 单选/多选/下拉名称
   * @returns {String}
   */
  getCodeByNameByCol(col, name) {
    if (toolUtil.isEmpty(name)) {
      return name
    }

    name = name.trim()
    let dictList = []
    if (col && Array.isArray(col.dictList)) {
      dictList = col.dictList
    }
    for (const dict of dictList) {
      if (dict.val === name) {
        return dict.key
      }
    }
    return name
  },
  /**
   * 添加列定义
   *
   * @param {Object} self this对象
   * @param {Array} defColList 列定义集合
   * @param {String} colItem 列定义项
   */
  addDefCol(self, defColList, colItem) {
    defColList = defColList || []
    defColList.push(this.convert2Col(self, colItem))
  },

  /**
   * 添加行数据
   *
   * @param {Object} self  this对象
   * @param {Object} row 行数据
   * @param {Object} colItem 列定义项
   * @param {String|Number} colVal 列值
   */
  addRowData(self, row, colItem, colVal) {
    row = row || {}
    if (!Array.isArray(row.colList)) {
      row.colList = []
    }
    const col = this.convert2Col(self, colItem)
    col.value = colVal
    row.colList.push(col)
  },
  /**
   * 转换成col
   *
   * @param {Object} self this对象
   * @param {Object} colItem 列定义项
   */
  convert2Col(self, colItem) {
    return {
      // 列code
      code: colItem.prop,
      // 列名称
      name: self.$t(colItem.label),
      // 列值
      value: undefined,
      // 是否必填
      requireFlag: this.isRequired(colItem),
      // 是否隐藏列
      hideFlag: colItem.isShow || false,
      // 字典码表
      dictList: this.convert2DictList(colItem),
      // 格式化函数
      formatFunc: colItem.format && colItem.format.func ? colItem.format.func : ''
    }
  },
  /**
   * 转换成dictList
   *
   * @param {Object} colItem 列定义项
   * @returns {Array}
   */
  convert2DictList(colItem) {
    const dictList = []
    let defaultDictList = []
    if (colItem && Array.isArray(colItem.list)) {
      defaultDictList = colItem.list
    } else if (colItem && colItem.format && Array.isArray(colItem.format.dict)) {
      defaultDictList = colItem.format.dict
    }
    defaultDictList.forEach(element => {
      dictList.push({
        key: element.value,
        val: element.label
      })
    })
    return dictList
  },
  /**
   * 是否必填
   * @param {Object} colItem 列定义项
   * @returns {Boolean}
   */
  isRequired(colItem) {
    if (colItem && typeof colItem.required === 'boolean') {
      return colItem.required
    }
    if (colItem && Array.isArray(colItem.validate)) {
      return colItem.validate[0].required
    }
    return false
  },
  /**
   * 通过prop获取value
   * @param {Object} self this对象
   * @param {Object} importData 导入数据
   * @param {Array} defItems 定义项
   * @param {String} prop
   */
  getValByProp(self, importData, defItems, prop) {
    const defItem = toolUtil.getDefItemByProp(defItems, prop)
    return importData[self.$t(defItem.label)]
  },
  /**
   * 通过name获取code
   * @param {Object} colItem 列定义项
   * @param {String} name 单选/多选/下拉名称
   * @returns {String}
   */
  getCodeByName(colItem, name) {
    if (toolUtil.isEmpty(name)) {
      return name
    }

    name = name.trim()
    let dictList = []
    if (colItem && Array.isArray(colItem.list)) {
      dictList = colItem.list
    } else if (colItem && colItem.format && Array.isArray(colItem.format.dict)) {
      dictList = colItem.format.dict
    }

    for (const dict of dictList) {
      if (dict.label === name) {
        return dict.value
      }
    }
    return name
  },
  /**
   * 通过code获取name
   * @param {Object} colItem 列定义项
   * @param {String} code 单选/多选/下拉code
   * @returns {String}
   */
  getNameByCode(colItem, code) {
    if (toolUtil.isEmpty(code)) {
      return code
    }

    code = code.trim()
    let dictList = []
    if (colItem && Array.isArray(colItem.list)) {
      dictList = colItem.list
    } else if (colItem && colItem.format && Array.isArray(colItem.format.dict)) {
      dictList = colItem.format.dict
    }

    for (const dict of dictList) {
      if (dict.value === code.trim()) {
        return dict.label
      }
    }
    return code
  }
}

export default excelUtil

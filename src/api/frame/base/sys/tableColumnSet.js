import request from '@/utils/frame/base/request'

const tableConfig = {
  getTableConfig(tableId, func) {
    return request({
      url: '/api/sys/tableConfig/get',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: tableId
      }
    })
  },
  setTableConfig(params, func) {
    return request({
      url: '/api/sys/tableConfig/save',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  getDefaultHeaders(colMap, initData) {
    // 若checkFlag为0 则不显示该字段
    const filterData = []
    let tableHeaders = []
    initData.map((val, index) => {
      if (val.checkFlag === '1') {
        filterData.push(val)
      }
    })
    // 第一次使用，没有任何配置数据
    if (filterData.length === 0) {
      let i = 1
      for (const key in colMap) {
        filterData.push({
          checkFlag: '1',
          itemId: key,
          sortNo: i
        })
        i++
      }
    }
    // 根据sortNo升序
    tableHeaders = filterData.sort((obj1, obj2) => {
      const value1 = obj1['sortNo']
      const value2 = obj2['sortNo']
      return value1 - value2
    })
    return tableHeaders
  }
}
export default tableConfig

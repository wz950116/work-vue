import request from '@/utils/frame/base/request'

const selectData = {
  listSelectData(type, param) {
    if (param === undefined || param === null) {
      param = {}
    }
    return new Promise((resolve, reject) => {
      request({
        url: '/api/dd/selectData/list',
        method: 'post',
        data: {
          funcModule: '下拉框',
          funcOperation: '查询',
          data: {
            type: type,
            queryParams: param
          }
        }
      }).then(response => {
        if (response.status) {
          resolve(response.data)
        }
      })
    })
  }
}

export default selectData

import request from '@/utils/frame/base/request'

const feeType = {
  getByCode(feeTypeCode) {
    return new Promise((resolve, reject) => {
      request({
        url: '/api/data/ddFeeType/get',
        method: 'post',
        data: {
          funcModule: '费用类型',
          funcOperation: '查询',
          data: feeTypeCode
        }
      }).then(response => {
        if (response.status) {
          resolve(response.data)
        }
      })
    })
  }
}

export default feeType

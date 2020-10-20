import request from '@/utils/frame/base/request'

const product = {
  getTaxRate(productCode, taxType) {
    return new Promise((resolve, reject) => {
      request({
        url: '/api/dd/taxRate/getTaxRage',
        method: 'post',
        data: {
          funcModule: '税率',
          funcOperation: '查询',
          data: {
            productCode: productCode,
            taxType: taxType
          }
        }
      }).then(response => {
        if (response.status) {
          let taxRate = response.data
          if (taxRate === undefined) {
            taxRate = null
          }
          resolve(taxRate)
        }
      })
    })
  }
}

export default product

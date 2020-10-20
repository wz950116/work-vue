import request from '@/utils/frame/base/request'

const recordingRate = {
  getExchangeRate(currencyCode) {
    return new Promise((resolve, reject) => {
      request({
        url: '/api/recording/rate/getExchangeRate',
        method: 'post',
        data: {
          funcModule: '汇率',
          funcOperation: '查询',
          data: currencyCode
        }
      }).then(response => {
        if (response.status) {
          resolve(response.data)
        }
      })
    })
  }
}

export default recordingRate

import request from '@/utils/frame/base/request'
const log = {
  listApiLog(params) {
    return request({
      url: '/api/sys/log/api',
      method: 'post',
      data: params
    })
  },
  listOperationLog(params) {
    return request({
      url: '/api/sys/log/operation',
      method: 'post',
      data: params
    })
  },
  getOperationDetailLog(params, func) {
    return request({
      url: '/api/sys/log/operation/detail',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  listLoginLog(params) {
    return request({
      url: '/api/sys/log/login',
      method: 'post',
      data: params
    })
  },
  listModel(func) {
    return request({
      url: '/api/sys/log/mode',
      method: 'post',
      data: func
    })
  }
}
export default log

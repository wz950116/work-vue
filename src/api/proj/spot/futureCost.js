const mock = false
const method = mock ? 'get' : 'post'
import request from '@/utils/frame/base/request'
const futureCost = {
  getList(params, func) {
    params['funcModule'] = func.funcModule
    params['funcOperation'] = func.funcOperation
    return request({
      url: '/api/spot/futureCost/list',
      method: method,
      data: params
    })
  },
  pageInit(params, func) {
    return request({
      url: '/api/spot/futureCost/init',
      method: method,
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  save(params, func) {
    return request({
      url: '/api/spot/futureCost/save',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  update(params, func) {
    return request({
      url: '/api/spot/futureCost/update',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  doDelete(params, func) {
    return request({
      url: '/api/spot/futureCost/remove',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  get(params, func) {
    return request({
      url: '/api/spot/futureCost/get',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  doSubmit(params, func) {
    return request({
      url: '/api/spot/futureCost/audit',
      method: method,
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  }
}
export default futureCost

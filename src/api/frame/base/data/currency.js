const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'
const currency = {
  getList(params, func) {
    params['funcModule'] = func.funcModule
    params['funcOperation'] = func.funcOperation
    return request({
      url: '/api/dd/currency/list',
      method: method,
      data: params
    })
  },
  doDelete(params, func) {
    return request({
      url: '/api/dd/currency/remove',
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
      url: '/api/dd/currency/get',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  save(params, func) {
    return request({
      url: '/api/dd/currency/save',
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
      url: '/api/dd/currency/update',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  // 查询被删除的数据
  getDeleteData(params, func) {
    return request({
      url: '/api/dd/currency/getDeleteData',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  // 查询被删除的数据
  getDeleteCodeData(params, func) {
    return request({
      url: '/api/dd/currency/getDeleteCodeData',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  }
}
export default currency

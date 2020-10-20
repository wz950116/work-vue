const mock = false
const method = mock ? 'get' : 'post'
import request from '@/utils/frame/base/request'
const fund = {
  getList(params, func) {
    params['funcModule'] = func.funcModule
    params['funcOperation'] = func.funcOperation
    return request({
      url: '/api/spot/fund/list',
      method: method,
      data: params
    })
  },
  pageInit(params, func) {
    return request({
      url: '/api/spot/fund/init',
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
      url: '/api/spot/fund/save',
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
      url: '/api/spot/fund/update',
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
      url: '/api/spot/fund/remove',
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
      url: '/api/data/fund/get',
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
      url: '/api/spot/fund/audit',
      method: method,
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  // tab组件列表查询
  listForTab() {
    return request({
      url: '/api/spot/fund/listForTab',
      method: method
    })
  }
}
export default fund

const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

const exchange = {
  getList(params, func) {
    params['funcModule'] = func.funcModule
    params['funcOperation'] = func.funcOperation
    return request({
      url: '/api/dd/exchange/list',
      method: method,
      data: params
    })
  },
  doDelete(params, func) {
    return request({
      url: '/api/dd/exchange/remove',
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
      url: '/api/dd/exchange/get',
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
      url: '/api/dd/exchange/save',
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
      url: '/api/dd/exchange/update',
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
      url: '/api/dd/exchange/getDeleteData',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  }
}
export default exchange

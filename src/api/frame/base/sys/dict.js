const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

const dict = {
  getList(params, func) {
    params['funcModule'] = func.funcModule
    params['funcOperation'] = func.funcOperation
    return request({
      url: '/api/sys/dict/list',
      method: method,
      data: params
    })
  },
  doDelete(params, func) {
    return request({
      url: '/api/sys/dict/remove',
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
      url: '/api/sys/dict/get',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  json(params) {
    return request({
      url: '/api/sys/dict/json',
      method: method,
      data: {
        data: params,
        funcModule: 'init',
        funcOperation: 'json'
      }
    })
  },
  save(params, func) {
    return request({
      url: '/api/sys/dict/save',
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
      url: '/api/sys/dict/update',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  dictItem(code, func) {
    return request({
      url: '/api/sys/dict/listItem',
      method: method,
      data: {
        data: code,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  cfgDictItem(code, func) {
    return request({
      url: '/api/platform/cfgDictItem/list',
      method: method,
      data: {
        data: code,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  dictItemAll(code, func) {
    return request({
      url: '/api/sys/dict/listItemAll',
      method: method,
      data: {
        data: code,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  listAllByType(datadictType, func) {
    return request({
      url: '/api/sys/dict/listAllByType',
      method: method,
      data: {
        data: datadictType,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  }
}
export default dict

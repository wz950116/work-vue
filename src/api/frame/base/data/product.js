const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

const product = {
  getList(params, func) {
    params['funcModule'] = func.funcModule
    params['funcOperation'] = func.funcOperation
    return request({
      url: '/api/data/product/list',
      method: method,
      data: params
    })
  },
  doDelete(params, func) {
    return request({
      url: '/api/data/product/remove',
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
      url: '/api/data/product/get',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  // 新增保存

  save(params, func) {
    return request({
      url: '/api/data/product/save',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  // 修改保存

  update(params, func) {
    return request({
      url: '/api/data/product/update',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  getCategoryList(params, func) {
    return request({
      url: '/api/data/productCategory/list',
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
      url: '/api/data/product/getDeleteData',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  submit(params, func) {
    return request({
      url: '/api/data/product/submit',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  cancelAudit(params, func) {
    return request({
      url: '/api/data/product/cancelAudit',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  }
}
export default product

const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'
// mock
// import request from '@/utils/frame/base/axios'

const productCategory = {
  getList(params, func) {
    params['funcModule'] = func.funcModule
    params['funcOperation'] = func.funcOperation
    return request({
      url: '/api/data/ddProductGroup/list',
      method: method,
      data: params
    })
  },
  getLastList() {
    return request({
      url: '/api/data/ddProductGroup/lastList',
      method: method
    })
  },
  doDelete(params, func) {
    return request({
      url: '/api/data/ddProductGroup/remove',
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
      url: '/api/data/ddProductGroup/get',
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
      url: '/api/data/ddProductGroup/save',
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
      url: '/api/data/ddProductGroup/update',
      method: method,
      data: {
        data: params,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },
  // 商品分类树形
  treeProductGroup() {
    return request({
      url: '/api/data/ddProductGroup/treeProductCategory',
      method: method
    })
  }
}
export default productCategory

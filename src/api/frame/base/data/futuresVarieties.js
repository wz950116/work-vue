const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

export function getList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/futuresVarieties/list',
    method: method,
    data: params
  })
}
export function getVarList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/futuresVarieties/list',
    method: method,
    data: params
  })
}
export function doDelete(params, func) {
  return request({
    url: '/api/dd/futuresVarieties/remove',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function get(params, func) {
  return request({
    url: '/api/dd/futuresVarieties/get',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 新增保存
export function save(params, func) {
  return request({
    url: '/api/dd/futuresVarieties/save',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 修改保存
export function update(params, func) {
  return request({
    url: '/api/dd/futuresVarieties/update',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 查询被删除的数据
export function getDeleteData(params, func) {
  return request({
    url: '/api/dd/futuresVarieties/getDeleteData',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}

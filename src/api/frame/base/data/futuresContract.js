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
    url: '/api/dd/futuresContract/list',
    method: method,
    data: params
  })
}
export function doDelete(params, func) {
  return request({
    url: '/api/dd/futuresContract/remove',
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
    url: '/api/dd/futuresContract/get',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function save(params, func) {
  return request({
    url: '/api/dd/futuresContract/save',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function update(params, func) {
  return request({
    url: '/api/dd/futuresContract/update',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function getVarList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/futuresContract/list',
    method: method,
    data: params
  })
}
// 查询被删除的数据
export function getDeleteData(params, func) {
  return request({
    url: '/api/dd/futuresContract/getDeleteData',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 通过期权id获取期货合约信息
export function getContractById(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/optionVarieties/getContractById',
    method: method,
    data: params
  })
}

const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

export function getList(params) {
  return request({
    url: '/api/dvt/dvtOptionTrade/list',
    method: method,
    data: params
  })
}
export function getinverstorList(params) {
  return request({
    url: '/api/bd/inverstorId/list',
    method: method,
    data: params
  })
}
export function getcontractMarkList(params) {
  return request({
    url: '/api/bd/contractMark/list',
    method: method,
    data: params
  })
}
export function remove(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtOptionTrade/remove',
    method: method,
    data: { data: params }
  })
}
export function save(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtOptionTrade/save',
    method: method,
    data: params
  })
}
export function update(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtOptionTrade/update',
    method: method,
    data: params
  })
}
export function get(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtOptionTrade/get',
    method: method,
    data: params
  })
}
export function updateType(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtOptionTrade/updateType',
    method: method,
    data: params
  })
}

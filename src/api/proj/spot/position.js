const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'
// mock
export function save(params) {
  return request({
    url: '/api/spot/strgSpImport/save',
    method: method,
    data: params
  })
}
export function list(params) {
  return request({
    url: '/api/spot/strgSpImport/list',
    method: method,
    data: params
  })
}
export function get(params) {
  return request({
    url: '/api/spot/strgSpImport/get',
    method: method,
    data: params
  })
}
export function remove(params) {
  return request({
    url: '/api/spot/strgSpImport/remove',
    method: method,
    data: params
  })
}
export function edit(params) {
  return request({
    url: '/api/spot/strgSpImport/edit',
    method: method,
    data: params
  })
}
export function confirm(params) {
  return request({
    url: '/api/spot/strgSpImport/confirm',
    method: method,
    data: params
  })
}
export function cancelConfirm(params) {
  return request({
    url: '/api/spot/strgSpImport/cancelConfirm',
    method: method,
    data: params
  })
}

// 期货数据导入管理
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
    url: '/api/dvt/dvtFutureImpRcd/list',
    method: method,
    data: params
  })
}
export function getImportData(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureImpRcd/getImportData',
    method: method,
    data: params
  })
}
export function deleteImportData(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureImpRcd/deleteImportData',
    method: method,
    data: params
  })
}
// 期货账号
export function listDerivativeAccount(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listDerivativeAccount',
    method: method,
    data: params
  })
}
// 主体名称(客户名称)
export function listMainName(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listMainName',
    method: method,
    data: params
  })
}
// 查询期货公司名称
export function listAllBrokerName(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listAllBrokerName',
    method: method,
    data: params
  })
}

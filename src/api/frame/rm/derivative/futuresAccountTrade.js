// 期货账号成交
const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

// 期货账号下拉框
export function listDerivativeAccount(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listDerivativeAccount',
    method: method,
    data: params
  })
}
// 合约下拉框
export function listFuturesContractCode(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listFuturesContractCode',
    method: method,
    data: params
  })
}
export function getListForSelect(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/listForSelect',
    method: method,
    data: params
  })
}
export function getList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/list',
    method: method,
    data: params
  })
}
export function save(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/save',
    method: method,
    data: params
  })
}
export function update(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/update',
    method: method,
    data: params
  })
}
// 获取弹窗数据
export function get(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/get',
    method: method,
    data: params
  })
}
// 获取浏览数据
export function getView(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/view',
    method: method,
    data: params
  })
}
export function doDelete(params, func) {
  return request({
    url: '/api/dvt/dvtFutureTrade/remove',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function download(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/sys/file/download',
    method: method,
    data: params
  })
}
export function getCategoryList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/productCategory/list',
    method: method,
    data: params
  })
}
export function getMarketList(params, func) {
  return request({
    url: '/api/dd/market/list',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function getDialogList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/dialogList',
    method: method,
    data: params
  })
}
export function getAttrList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/product/list',
    method: method,
    data: params
  })
}
export function saveRelation(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/saveRelation',
    method: method,
    data: params
  })
}
export function getRelation(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFutureTrade/getRelation',
    method: method,
    data: params
  })
}

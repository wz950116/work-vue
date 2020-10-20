// 期货账号成交
const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'
// getList, doDelete getsave,update,listDerivativeSubAccount,listFuturesContractCode

// 子账号下拉框
export function listDerivativeSubAccount(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listDerivativeSubAccount',
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
    url: '/api/dvt/dvtFuturePosiSum/listForSelect',
    method: method,
    data: params
  })
}
export function getList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFuturePosiSum/listSub',
    method: method,
    data: params
  })
}
export function save(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFuturePosiSum/saveSub',
    method: method,
    data: params
  })
}
export function update(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFuturePosiSum/updateSub',
    method: method,
    data: params
  })
}
// 获取弹窗数据
export function get(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFuturePosiSum/get',
    method: method,
    data: params
  })
}
// 获取浏览数据
export function getView(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFuturePosiSum/view',
    method: method,
    data: params
  })
}
export function doDelete(params, func) {
  return request({
    url: '/api/dvt/dvtFuturePosiSum/remove',
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
    url: '/api/dvt/dvtFuturePosiSum/dialogList',
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
    url: '/api/dvt/dvtFuturePosiSum/saveRelation',
    method: method,
    data: params
  })
}
export function getRelation(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dvt/dvtFuturePosiSum/getRelation',
    method: method,
    data: params
  })
}

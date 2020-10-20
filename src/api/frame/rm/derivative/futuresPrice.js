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
    url: '/api/derivative/futuresPrice/list',
    method: method,
    data: params
  })
}
export function save(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPrice/save',
    method: method,
    data: params
  })
}
// 弹窗数据
export function get(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPrice/get',
    method: method,
    data: params
  })
}
// 表头数据
export function getView(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPrice/getMainInfo',
    method: method,
    data: params
  })
}
// 价格列表
export function listFuturesPrice(params, func) {
  return request({
    url: '/api/derivative/futuresPrice/listFuturesPrice',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function listExportPrice(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPrice/listExportPrice',
    method: method,
    data: params
  })
}
// 交易所
export function exchangeList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/exchange/list',
    method: method,
    data: params
  })
}
// 品种
export function futuresVarietiesList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/futuresVarieties/list',
    method: method,
    data: params
  })
}
// 合约代码
export function futuresContractList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/futuresContract/list',
    method: method,
    data: params
  })
}

const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

// 表头数据
export function getMainInfo(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPriceAdjust/getMainInfo',
    method: method,
    data: params
  })
}
export function getList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPriceAdjust/list',
    method: method,
    data: params
  })
}
export function doDelete(params, func) {
  return request({
    url: '/api/derivative/futuresPriceAdjust/remove',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function save(params) {
  return request({
    url: '/api/derivative/futuresPriceAdjust/save',
    method: method,
    data: params
  })
}
export function saveRecord(params) {
  return request({
    url: '/api/derivative/futuresPriceAdjust/saveRecord',
    method: method,
    data: params
  })
}
export function update(params) {
  return request({
    url: '/api/derivative/futuresPriceAdjust/update',
    method: method,
    data: params
  })
}
export function updateRecord(params) {
  return request({
    url: '/api/derivative/futuresPriceAdjust/updateRecord',
    method: method,
    data: params
  })
}
// 审核
export function audit(params) {
  return request({
    url: '/api/derivative/futuresPriceAdjust/audit',
    method: method,
    data: params
  })
}
// export function saveAndAudit(params, func) {
//   params['funcModule'] = func.funcModule
//   params['funcOperation'] = func.funcOperation
//   return request({
//     url: '/api/derivative/futuresPriceAdjust/saveAndAudit',
//     method: method,
//     data: params
//   })
// }
// export function updateAndAudit(params, func) {
//   params['funcModule'] = func.funcModule
//   params['funcOperation'] = func.funcOperation
//   return request({
//     url: '/api/derivative/futuresPriceAdjust/updateAndAudit',
//     method: method,
//     data: params
//   })
// }

// 查询
export function get(params, func) {
  return request({
    url: '/api/derivative/futuresPriceAdjust/getDetail',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 弹窗查询价格选择数据
export function getDialogList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPriceAdjust/listFuturePrice',
    method: method,
    data: params
  })
}
// 交易所
export function exchange(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/exchange/list',
    method: method,
    data: params
  })
}
// 品种
export function futuresVarieties(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/futuresVarieties/list',
    method: method,
    data: params
  })
}
// 合约
export function futuresContract(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPriceAdjust/listContract',
    method: method,
    data: params
  })
}
// 查询期货待补录数据
export function listFutureAdjustWait(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/futuresPriceAdjust/listFutureAdjustWait',
    method: method,
    data: params
  })
}

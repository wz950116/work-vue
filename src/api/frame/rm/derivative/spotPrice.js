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
    url: '/api/derivative/spotPrice/list',
    method: method,
    data: params
  })
}
// 获取弹窗数据
export function get(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPrice/get',
    method: method,
    data: params
  })
}
// 获取价格估算后的数据
export function listPriceEstimation(params, func) {
  return request({
    url: '/api/derivative/spotPrice/listPriceEstimation',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 价格估算保存
export function updatePriceEstimation(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPrice/updatePriceEstimation',
    method: method,
    data: params
  })
}
export function save(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPrice/save',
    method: method,
    data: params
  })
}
export function update(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPrice/update',
    method: method,
    data: params
  })
}
// 表头数据
export function getView(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPrice/getSpotPriceSetting',
    method: method,
    data: params
  })
}
// 价格列表
export function listSpotPrice(params, func) {
  return request({
    url: '/api/derivative/spotPrice/listViewDetail',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function doDelete(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPrice/remove',
    method: method,
    data: params
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
export function getDialogList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPrice/list',
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
export function getAttrList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/product/list',
    method: method,
    data: params
  })
}

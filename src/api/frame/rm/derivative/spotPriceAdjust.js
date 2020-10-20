const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

// 表头数据
// 保存
export function getMainInfo(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPriceAdjust/getMainInfo',
    method: method,
    data: params
  })
}
// 审核
export function audit(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPriceAdjust/audit',
    method: method,
    data: params
  })
}

// 查询
export function getList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPriceAdjust/list',
    method: method,
    data: params
  })
}
export function doDelete(params, func) {
  return request({
    url: '/api/derivative/spotPriceAdjust/remove',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function update(params) {
  return request({
    url: '/api/derivative/spotPriceAdjust/update',
    method: method,
    data: params
  })
}
export function save(params) {
  return request({
    url: '/api/derivative/spotPriceAdjust/save',
    method: method,
    data: params
  })
}
// 获取弹窗数据 查询
export function get(params, func) {
  return request({
    url: '/api/derivative/spotPriceAdjust/getSpotPriceAdjustView',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 获取价格关系
export function listForAll(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPrice/list',
    method: method,
    data: params
  })
}
// 获取浏览数据
export function getView(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/derivative/spotPriceAdjust/view',
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
export function getAttrList(params, func) {
  params['funcModule'] = func.funcModule
  params['funcOperation'] = func.funcOperation
  return request({
    url: '/api/dd/product/list',
    method: method,
    data: params
  })
}
// daochu
export function listSpotAdjustWait(params) {
  return request({
    url: '/api/derivative/spotPriceAdjust/listExportDetail',
    method: method,
    data: params
  })
}

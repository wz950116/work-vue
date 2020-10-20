const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'
// 期货数据调整单

// 查看期货数据调整单(按ID查找详细内容)
export function get(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/get',
    method: method,
    data: params
  })
}

// 查看期货数据调整单(按ID查找详细内容,调整前后分开表示)
export function getView(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/getView',
    method: method,
    data: params
  })
}
// 查询期货数据调整单(分页查询)
export function getList(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/list',
    method: method,
    data: params
  })
}
// 查询期货账号列表
export function listDerivativeAccount(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listDerivativeAccount',
    method: method,
    data: params
  })
}
// 查询期货子账号列表
export function listDerivativeSubAccount(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listDerivativeSubAccount',
    method: method,
    data: params
  })
}
// 查询期货合约列表
export function listFuturesContractCode(params) {
  return request({
    url: '/api/dvt/dvtBaseInfo/listFuturesContractCode',
    method: method,
    data: params
  })
}
// 查询子账号数据调整单(分页查询)
export function listSub(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/listSub',
    method: method,
    data: params
  })
}
// 查询期货成交
export function listTrade(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/listTrade',
    method: method,
    data: params
  })
}
// 查询子账号成交
export function listTradeSub(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/listTradeSub',
    method: method,
    data: params
  })
}
// 删除期货数据调整单(可批量删除)
export function remove(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/remove',
    method: method,
    data: params
  })
}
// 新增期货数据调整单
export function save(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/save',
    method: method,
    data: params
  })
}
// 新增期货数据调整单并提交
export function saveAndSubmit(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/saveAndSubmit',
    method: method,
    data: params
  })
}
// 新增子账号数据调整单并提交
export function saveAndSubmitSub(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/saveAndSubmitSub',
    method: method,
    data: params
  })
}

// 新增子账号数据调整单
export function saveSub(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/saveSub',
    method: method,
    data: params
  })
}

// 期货数据调整单提交
export function submit(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/submit',
    method: method,
    data: params
  })
}

// 修改期货数据调整单
export function update(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/update',
    method: method,
    data: params
  })
}
// 修改期货数据调整单并提交
export function updateAndSubmit(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/updateAndSubmit',
    method: method,
    data: params
  })
}

// 修改子账号数据调整单并提交
export function updateAndSubmitSub(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/updateAndSubmitSub',
    method: method,
    data: params
  })
}
// 修改子账号数据调整单
export function updateSub(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/updateSub',
    method: method,
    data: params
  })
}
// daochu
export function downloadTrade(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/downloadTrade',
    method: method,
    data: params
  })
}
export function downloadTradeSub(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/downloadTradeSub',
    method: method,
    data: params
  })
}
// 生成调整单号的API 期货账号
export function genAdjustNo(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/genAdjustNo',
    method: method,
    data: params
  })
}
// 生成调整单号的API 子账号
export function genAdjustNoSub(params) {
  return request({
    url: '/api/dvt/dvtFutureAdjRecord/genAdjustNoSub',
    method: method,
    data: params
  })
}

const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

// 查询启用的列表数据
export function getUseList(params, func) {
  return request({
    url: '/api/sys/stTblSysHomeItem/listUse',
    method: method,
    data: params
  })
}
export function getList(params, func) {
  return request({
    url: '/api/sys/stTblSysHomeItem/list',
    method: method,
    data: params
  })
}
// 删除
export function doDelete(params, func) {
  return request({
    url: '/api/sys/stTblSysHomeItem/remove',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 选中编辑数据
export function get(params, func) {
  return request({
    url: '/api/sys/stTblSysHomeItem/get',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 新增保存
export function save(params, func) {
  return request({
    url: '/api/sys/stTblSysHomeItem/save',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 修改保存
export function update(params, func) {
  return request({
    url: '/api/sys/stTblSysHomeItem/update',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 启用
export function setUse(params, func) {
  return request({
    url: '/api/sys/stTblSysHomeItem/setUse',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 停用
export function setUnuse(params, func) {
  return request({
    url: '/api/sys/stTblSysHomeItem/setUnuse',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}

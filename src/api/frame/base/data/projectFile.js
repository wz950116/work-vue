const mock = false
const method = mock ? 'get' : 'post'
// api
import request from '@/utils/frame/base/request'

// mock
// import request from '@/utils/frame/base/axios'

// 查询列表数据
export function getList(params, func) {
  return request({
    url: '/api/dd/project/list',
    method: method,
    data: params
  })
}
// 删除
export function doDelete(params, func) {
  return request({
    url: '/api/dd/project/remove',
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
    url: '/api/dd/project/get',
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
    url: '/api/dd/project/save',
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
    url: '/api/dd/project/update',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
// 查询被删除的数据
export function getDeleteData(params, func) {
  return request({
    url: '/api/dd/project/getDeleteData',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function submit(params, func) {
  return request({
    url: '/api/dd/project/submit',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}
export function cancelAudit(params, func) {
  return request({
    url: '/api/dd/project/cancelAudit',
    method: method,
    data: {
      data: params,
      funcModule: func.funcModule,
      funcOperation: func.funcOperation
    }
  })
}

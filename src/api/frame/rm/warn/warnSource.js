import request from '@/utils/frame/base/request'

const warnSource = {
  listWarnSource(params) {
    return request({
      url: '/api/warn/source/list',
      method: 'post',
      data: params
    })
  },

  getWarnSource(id, func) {
    return request({
      url: '/api/warn/source/get',
      method: 'post',
      data: {
        data: id,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  listColumn(id, func) {
    return request({
      url: '/api/warn/source/listColumn',
      method: 'post',
      data: {
        data: id,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  updateWarnSource(obj, func) {
    return request({
      url: '/api/warn/source/update',
      method: 'post',
      data: {
        data: obj,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  insertWarnSource(obj, func) {
    return request({
      url: '/api/warn/source/insert',
      method: 'post',
      data: {
        data: obj,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  deleteById(id, func) {
    return request({
      url: '/api/warn/source/delete',
      method: 'post',
      data: {
        data: id,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  },

  listColumnBySql(sql, func) {
    return request({
      url: '/api/warn/source/listColumnBySql',
      method: 'post',
      data: {
        data: sql,
        funcModule: func.funcModule,
        funcOperation: func.funcOperation
      }
    })
  }
}
export default warnSource

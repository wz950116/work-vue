import request from '@/utils/frame/base/request'

/**
 * 模板 API
 */
const fleTemplateApi = {
  /**
   * 分页查询 模板
   * @param {*} params 查询条件及分页条件
   * @param {*} func  功能及操作
   */
  list(params, func) {
    params.funcModule = func.funcModule
    params.funcOperation = func.funcOperation
    return request({
      url: '/api/sys/template/list',
      method: 'post',
      data: params
    })
  },
  /**
   * 查询列表
   * @param {*} category 业务类别
   * @param {*} func  功能及操作
   */
  listByCategory(category, func) {
    return request({
      url: '/api/sys/template/listByCategory',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: category
      }
    })
  },
  /**
   * 按ID查找 模板
   * @param {*} id ID
   * @param {*} func 功能及操作
   */
  get(id, func) {
    return request({
      url: '/api/sys/template/get',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: id
      }
    })
  },
  /**
   * 新增 模板
   * @param {*} data 模板 信息
   * @param {*} func 功能及操作
   */
  save(data, func) {
    return request({
      url: '/api/sys/template/save',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: data
      }
    })
  },
  /**
   * 修改 模板
   * @param {*} data 模板 信息
   * @param {*} func 功能及操作
   */
  update(data, func) {
    return request({
      url: '/api/sys/template/update',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: data
      }
    })
  },
  /**
   * 删除 模板
   * @param {*} ids ID List
   * @param {*} func 功能及操作
   */
  remove(ids, func) {
    return request({
      url: '/api/sys/template/remove',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: ids
      }
    })
  }
}

/**
 * 模板 API
 */
export default fleTemplateApi

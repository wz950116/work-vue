import request from '@/utils/frame/base/request'

/**
 * 站内推送消息 API
 */
const msgWebmsgApi = {
  /**
   * 分页查询 我的消息
   * @param {*} params 查询条件及分页条件
   * @param {*} func 功能及操作
   */
  listMy(params, func) {
    params.funcModule = func.funcModule
    params.funcOperation = func.funcOperation
    return request({
      url: '/api/msg/webmsg/listMy',
      method: 'post',
      data: params
    })
  },
  /**
   * 读取 我的消息
   * @param {*} id 站内推送消息ID
   * @param {*} func 功能及操作
   */
  readMy(id, func) {
    return request({
      url: '/api/msg/webmsg/readMy',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: id
      }
    })
  },
  /**
   * 删除 我的消息
   * @param {*} ids 站内推送消息ID
   * @param {*} func 功能及操作
   */
  removeMy(ids, func) {
    return request({
      url: '/api/msg/webmsg/removeMy',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: ids
      }
    })
  },
  /**
   * 标记位已读 我的消息
   * @param {*} ids 站内推送消息ID
   * @param {*} func 功能及操作
   */
  signReadMy(ids, func) {
    return request({
      url: '/api/msg/webmsg/signReadMy',
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
 * 站内推送消息
 */
export default msgWebmsgApi

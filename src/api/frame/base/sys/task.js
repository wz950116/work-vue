import request from '@/utils/frame/base/request'

const task = {
  listTask(params) {
    return request({
      url: '/api/sys/task/list',
      method: 'post',
      data: params
    })
  },
  listLog(params) {
    return request({
      url: '/api/sys/task/log',
      method: 'post',

      data: {
        funcModule: params.funcModule,
        funcOperation: params.funcOperation,
        data: params.data
      }
    })
  },
  removeLog(params) {
    return request({
      url: '/api/sys/task/log/remove',
      method: 'post',

      data: {
        funcModule: params.funcModule,
        funcOperation: params.funcOperation,
        data: params.data
      }
    })
  },
  addTask(params, func) {
    return request({
      url: '/api/sys/task/add',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  viewTask(params, func) {
    return request({
      url: '/api/sys/task/view',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  deleteTask(params, func) {
    return request({
      url: '/api/sys/task/delete',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  onceTask(params, func) {
    return request({
      url: '/api/sys/task/once',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },

  resumeTask(params, func) {
    return request({
      url: '/api/sys/task/resume',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  updateTask(params, func) {
    return request({
      url: '/api/sys/task/update',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  pauseTask(params, func) {
    return request({
      url: '/api/sys/task/pause',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  }
}

export default task

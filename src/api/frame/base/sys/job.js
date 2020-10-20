import request from '@/utils/frame/base/request'

const job = {
  listJob(params) {
    return request({
      url: '/api/sys/job/list',
      method: 'post',
      data: params
    })
  },
  listLog(params) {
    return request({
      url: '/api/sys/job/log',
      method: 'post',
      data: params
    })
  },
  removeLog(params) {
    return request({
      url: '/api/sys/job/log/remove',
      method: 'post',
      data: params
    })
  },
  addJob(params, func) {
    return request({
      url: '/api/sys/job/add',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  viewJob(params, func) {
    return request({
      url: '/api/sys/job/view',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  deleteJob(params, func) {
    return request({
      url: '/api/sys/job/delete',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  onceJob(params, func) {
    return request({
      url: '/api/sys/job/once',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },

  resumeJob(params, func) {
    return request({
      url: '/api/sys/job/resume',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  updateJob(params, func) {
    return request({
      url: '/api/sys/job/updateJob',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  },
  pauseJob(params, func) {
    return request({
      url: '/api/sys/job/pause',
      method: 'post',
      data: {
        funcModule: func.funcModule,
        funcOperation: func.funcOperation,
        data: params
      }
    })
  }
}

export default job

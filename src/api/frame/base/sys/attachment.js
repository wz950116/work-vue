import request from '@/utils/frame/base/request'
export function listAttachment(attachment, func) {
  return request({
    url: '/api/sys/file/list',
    method: 'post',
    data: {
      funcModule: func.funcModule,
      funcOperation: func.funcOperation,
      data: attachment
    }
  })
}

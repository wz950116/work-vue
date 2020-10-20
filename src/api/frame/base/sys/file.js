import request from '@/utils/frame/base/request'

export function apiFileName(attaId) {
  return request({
    url: '/api/sys/file/filename',
    method: 'post',
    data: {
      data: attaId
    }
  })
}

export function apiFileNames(attaIdList) {
  return request({
    url: '/api/sys/file/filenames',
    method: 'post',
    data: {
      data: attaIdList
    }
  })
}

export function apiRandTemp(attaId) {
  return request({
    url: '/api/sys/file/randtemp',
    method: 'post',
    data: {
      data: attaId
    }
  })
}

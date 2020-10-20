import storage from '@/utils/frame/base/localStorage'

export function notifyError(params) {
  let lang = storage.get('language')
  if (!lang) lang = 'zh'
  return {
    title: lang === 'zh' ? '错误' : 'Error',
    message: params.msg,
    type: 'error',
    position: 'bottom-right',
    offset: 30,
    duration: 3000

  }
}
export function notifyInfo(params) {
  let lang = storage.get('language')
  if (!lang) lang = 'zh'
  return {
    title: lang === 'zh' ? '消息' : 'Info',
    message: params.msg,
    type: 'info',
    position: 'bottom-right',
    offset: 30,
    duration: 3000
  }
}

export function notifySuccess(params) {
  let lang = storage.get('language')
  if (!lang) lang = 'zh'
  return {
    title: lang === 'zh' ? '成功' : 'Success',
    message: params.msg,
    type: 'success',
    position: 'bottom-right',
    offset: 30,
    duration: 3000
  }
}

export function confirmTip(_this, type) {
  return new Promise((resolve, reject) => {
    _this.$confirm(_this.$t(`biz.msg.${type}`), _this.$t('biz.msg.tip'), {
      type: 'warning',
      closeOnClickModal: false,
      confirmButtonText: _this.$t('biz.btn.confirm'),
      cancelButtonText: _this.$t('biz.btn.cancel')
    })
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject()
      })
  })
}

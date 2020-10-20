const messageUtil = {
  async syncConfirm(_this, msg, title = 'notify.title.warning', type = 'warning') {
    const result = await new Promise((resolve, reject) => {
      _this.$confirm(msg, _this.$t(title), {
        confirmButtonText: _this.$t('biz.btn.confirm'),
        cancelButtonText: _this.$t('biz.btn.cancel'),
        type: type
      }).then(() => {
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    })
    return result
  }
}
export default messageUtil

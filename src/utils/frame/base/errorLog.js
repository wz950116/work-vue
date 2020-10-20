import Vue from 'vue'
import request from '@/utils/frame/base/request'

if (process.env.ERROR_LOG) {
  Vue.config.errorHandler = function(err, vm, info, a) {
    Vue.nextTick(() => {
      request({
        url: '/api/log/vue/save',
        method: 'post',
        data: {
          funcModule: 'vueLog',
          funcOperation: 'save',
          data: {
            'vueUrl': window.location.href,
            'errMessage': err.message,
            'vmNode': vm.$vnode.tag,
            'info': info,
            'errStack': err.stack
          }
        }
      })
    })
  }
}


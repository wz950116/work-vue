// 数据字段merge
import dictApi from '@/api/frame/base/sys/dict'
import i18n from '@/lang/index' // Internationalization

const sys = {
  state: {
    remoteSelectData: new Set()
  },

  mutations: {

    SET_REMOTE_SELECT_DATA(state, remoteSelectData) {
      state.remoteSelectData = remoteSelectData
    }
  },

  actions: {

    initData() {
      return new Promise(function (resolve, reject) {
        dictApi.json({
          dictType: '',
          lang: 'zh'
        }).then(response => {
          const dictData = {}
          dictData.datadict = response.data
          i18n.mergeLocaleMessage('zh', dictData)
          i18n.mergeLocaleMessage('en', dictData)
          resolve()
        })
          .catch(e => {
            reject(e)
          })
      })
    },
    initRemoteDict({
      commit
    }) {
      return new Promise(function (resolve, reject) {
        const remoteSelectData = i18n.t('datadict.remoteSelectData')
        if (remoteSelectData instanceof Array) {
          const ketSet = new Set()
          remoteSelectData.forEach((data) => {
            ketSet.add(data.key)
          })
          commit('SET_REMOTE_SELECT_DATA', ketSet)
        }
      })
    }

  }
}

export default sys

import authApi from '@/api/proj/sys/authorizedMonitor'

const authorization = {
  state: {
    authorizationList: []
  },

  mutations: {
    SET_AUTHORIZATION_LIST: (state, data) => {
      state.authorizationList = data
    }
  },

  actions: {
    // 登录
    GetAuthorizationList({ commit }) {
      return new Promise((resolve, reject) => {
        authApi
          .getAuthorizedMonitorInfoList()
          .then(response => {
            const data = response.data
            commit('SET_AUTHORIZATION_LIST', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default authorization

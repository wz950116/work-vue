export default {
  state: {
    type: '', // 打开新增页类型  show or edit
    isRequest: false, // 返回页面后是否刷新  true or false
    data: null // 需要传递的数据
  },
  mutations: {
    SET_TEST_TYPE(state, type) {
      state.type = type
    },
    SET_TEST_REQUEST(state, boolean) {
      state.isRequest = boolean
    },
    SET_TEST_DATA(state, data) {
      state.data = data
    }
  },
  actions: {
    SetTestType({ commit }, type) {
      commit('SET_TEST_TYPE', type)
    },
    SetTestRequest({ commit }, boolean) {
      commit('SET_TEST_REQUEST', boolean)
    },
    SetTestData({ commit }, data) {
      commit('SET_TEST_DATA', data)
    }
  }
}

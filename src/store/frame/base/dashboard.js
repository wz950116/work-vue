import * as homeItem from '@/api/proj/sys/homeItem'

const dashboard = {
  state: {
    refresh: false,
    dashboardRpt: [],
    dashboardMap: [{
      itemId: 'todo',
      sortNo: 1,
      checkFlag: '0'
    }, {
      itemId: 'msg',
      sortNo: 2,
      checkFlag: '0'
    }]
  },
  mutations: {
    SET_REFRESH(state, boolean) {
      state.refresh = boolean
    },
    SET_DASHBOARD(state, data) {
      state.dashboardMap = data
    },
    SET_DASHBOARDRPT(state, data) {
      state.dashboardRpt = data
      const newMap = [{
        itemId: 'todo',
        sortNo: 1,
        checkFlag: '0'
      }, {
        itemId: 'msg',
        sortNo: 2,
        checkFlag: '0'
      }]
      data.forEach(i => {
        i.sortNo = state.dashboardMap.length + 1
        i.checkFlag = 0
        newMap.push(i)
      })
      newMap.forEach(m => {
        state.dashboardMap.forEach(i => {
          if (m.itemId === i.itemId) {
            m.checkFlag = i.checkFlag ? i.checkFlag : '0'
            // i.rptUrl = m.rptUrl
            // i.itemName = m.itemName
            // i.rptRoute = m.rptRoute
            // i.itemHeight = m.itemHeight
          }
        })
      })
      state.dashboardMap = newMap
    }
  },
  actions: {
    setRefresh({
      commit
    }, boolean) {
      commit('SET_REFRESH', boolean)
    },
    setDashboard({
      commit
    }, data) {
      commit('SET_DASHBOARD', data)
    },
    initDashboard({
      commit
    }) {
      homeItem
        .getUseList()
        .then(response => {
          commit('SET_DASHBOARDRPT', response.data)
        })
        .catch(() => { })
    }
  }
}

export default dashboard

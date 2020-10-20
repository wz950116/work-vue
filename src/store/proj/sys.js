import sysInitSetting from '@/api/proj/sys/sysInitSetting'

const projSys = {
  state: {
    precision: {
      priceDigit: 2,
      quantityDigit: 3,
      moneyDigit: 2
    },
    revertFlag: false,
    clauseReadFlag: 0
  },

  mutations: {
    // 数字精度
    SET_PRICE_DIGIT: (state, priceDigit) => {
      state.precision.priceDigit = priceDigit
    },
    SET_QUANTITY_DIGIT: (state, quantityDigit) => {
      state.precision.quantityDigit = quantityDigit
    },
    SET_MONEY_DIGIT: (state, moneyDigit) => {
      state.precision.moneyDigit = moneyDigit
    },
    // 反开账标志
    SET_REVERT_FLAG: (state, revertFlag) => {
      state.revertFlag = revertFlag
    },
    // 条款已读标志
    SET_CLAUSE_READ_FLAG: (state, clauseReadFlag) => {
      state.clauseReadFlag = clauseReadFlag
    }
  },

  actions: {
    // 获取小数位、反开账标志、条款已读标志
    GetInitParams({
      commit
    }) {
      return new Promise((resolve, reject) => {
        sysInitSetting.getInitParams()
          .then(response => {
            const data = response.data
            commit('SET_PRICE_DIGIT', data.priceDigit)
            commit('SET_QUANTITY_DIGIT', data.quantityDigit)
            commit('SET_MONEY_DIGIT', data.moneyDigit)
            commit('SET_REVERT_FLAG', data.revertFlag)
            commit('SET_CLAUSE_READ_FLAG', data.clauseReadFlag)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default projSys

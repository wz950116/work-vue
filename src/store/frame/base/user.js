import { platLogin, userLogin, groupLogin, login, logout, getInfo, getUser, getTitles, getMenus, getRoutes, getSubRoutes, switchTo, switchBack, goodsColList, sysBillGoodsCol } from '@/api/frame/login'
import { listSelectData } from '@/api/frame/base/sys/data'
import { getMd5, setMd5, removeMd5, getToken, setToken, removeToken } from '@/utils/frame/base/auth'
import i18n from '@/lang/index'
import session from '@/utils/frame/base/sessionStorage'

const user = {
  state: {
    token: getToken(),
    md5: getMd5(),
    id: '',
    identity: '',
    activeFlag: '',
    name: '',
    tenantCodeHash: '',
    account: '',
    userDeptCode: '',
    userOrganCode: '',
    userEmployeeCode: '',
    avatar: '',
    showGoodCols: [],
    showGoodColsInit: [],
    mainGoodCols: [],
    mainGoodColsInit: [],
    mainGoodColsTxt: [],
    mainGoodColsTxtInit: [],
    reserveGoodColsTxt: [],
    reserveGoodColsTxtInit: [],
    reserveGoodCols: [],
    reserveGoodColsInit: [],
    mainGoodColsTxtSon: [],
    mainGoodColsTxtSonInit: [],
    reserveGoodColsTxtSon: [],
    reserveGoodColsTxtSonInit: [],
    goodsColList: {},
    currencyList: [],
    baseSelectList: new Map()
  },

  mutations: {
    SET_MAIN_GOOD_COLS_TXT(state, main) {
      state.mainGoodColsTxt = main
    },

    SET_MAIN_GOOD_COLS_TXT_INIT(state, main) {
      state.mainGoodColsTxtInit = main
    },

    SET_MAIN_GOOD_COLS_TXT_SON(state, main) {
      state.mainGoodColsTxtSon = main
    },

    SET_MAIN_GOOD_COLS_TXT_SON_INIT(state, main) {
      state.mainGoodColsTxtSonInit = main
    },

    SET_MAIN_GOOD_COLS(state, main) {
      state.mainGoodCols = main
    },

    SET_MAIN_GOOD_COLS_INIT(state, main) {
      state.mainGoodColsInit = main
    },

    SET_RESERVE_GOOD_COLS_TXT(state, reserve) {
      state.reserveGoodColsTxt = reserve
    },

    SET_RESERVE_GOOD_COLS_TXT_INIT(state, reserve) {
      state.reserveGoodColsTxtInit = reserve
    },

    SET_RESERVE_GOOD_COLS_TXT_SON(state, reserve) {
      state.reserveGoodColsTxtSon = reserve
    },

    SET_RESERVE_GOOD_COLS_TXT_SON_INIT(state, reserve) {
      state.reserveGoodColsTxtSonInit = reserve
    },

    SET_RESERVE_GOOD_COLS(state, reserve) {
      state.reserveGoodCols = reserve
    },

    SET_RESERVE_GOOD_COLS_INIT(state, reserve) {
      state.reserveGoodColsInit = reserve
    },

    SET_SHOW_GOOD_COLS(state, showGoodCols) {
      state.showGoodCols = showGoodCols
    },

    SET_SHOW_GOOD_COLS_INIT(state, showGoodCols) {
      state.showGoodColsInit = showGoodCols
    },

    SET_MAIN_GOOD_COLS_TXT_SON_UP(state, main) {
      state.goodsColList = main
    },

    SET_TOKEN(state, data) {
      state.token = data.accessToken
      state.md5 = data.md5Token
    },

    SET_ACCESS_TOKEN(state, accessToken) {
      state.token = accessToken
    },

    REMOVE_TOKEN: state => {
      state.token = ''
      state.md5 = ''
    },

    SET_ID(state, id) {
      state.id = id
    },

    SET_IDENTITY(state, identity) {
      state.identity = identity
    },

    SET_ACTIVE_FLAG(state, activeFlag) {
      state.activeFlag = activeFlag
    },

    SET_NAME(state, name) {
      state.name = name
    },

    SET_ACCOUNT(state, account) {
      state.account = account
    },

    SET_AVATAR(state, avatar) {
      state.avatar = avatar
    },

    SET_TENANT_CODE_HASH(state, tenantCodeHash) {
      state.tenantCodeHash = tenantCodeHash
    },

    SET_USER_ORGAN_CODE(state, userOrganCode) {
      state.userOrganCode = userOrganCode
    },

    SET_USER_DEPT_CODE(state, userDeptCode) {
      state.userDeptCode = userDeptCode
    },

    SET_USER_EMPLOYEE_CODE(state, userEmployeeCode) {
      state.userEmployeeCode = userEmployeeCode
    },

    SET_CURRENCY_LIST(state, list) {
      state.currencyList = list
    },

    SET_BASESELECT_LIST(state, obj) {
      state.baseSelectList.set(obj.key, obj.value)
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            const data = response.data
            setToken(data.accessToken)
            setMd5(data.md5Token)
            commit('SET_TOKEN', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登录
    PlatLogin({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        platLogin(username, userInfo.password, userInfo.captcha, userInfo.captchaToken)
          .then(response => {
            const data = response.data
            setToken(data.accessToken)
            setMd5(data.md5Token)
            commit('SET_TOKEN', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登录
    UserLogin({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        userLogin(username, userInfo.password, userInfo.tenantHashCode, userInfo.captcha, userInfo.captchaToken, userInfo.enterpriseName)
          .then(response => {
            const data = response.data
            setToken(data.accessToken)
            setMd5(data.md5Token)
            commit('SET_TOKEN', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登录
    GroupLogin({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        groupLogin(username, userInfo.password, userInfo.captcha, userInfo.captchaToken)
          .then(response => {
            const data = response.data
            setToken(data.accessToken)
            setMd5(data.md5Token)
            commit('SET_TOKEN', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 切换身份
    SwitchTo({ commit }, account) {
      return new Promise((resolve, reject) => {
        switchTo(account)
          .then(response => {
            const data = response.data
            setToken(data)
            commit('SET_ACCESS_TOKEN', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 切回身份
    SwitchBack({ commit }) {
      return new Promise((resolve, reject) => {
        switchBack()
          .then(response => {
            const data = response.data
            setToken(data)
            commit('SET_ACCESS_TOKEN', data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 物资属性字段更新
    GoodsColListUpdate({ commit, state }, bizCode) {
      if (bizCode && state.goodsColList[bizCode]) {
        commit('SET_RESERVE_GOOD_COLS_TXT', state.goodsColList[bizCode].reserveGoodColsTxt)
        commit('SET_RESERVE_GOOD_COLS', state.goodsColList[bizCode].reserveGoodCols)
        commit('SET_MAIN_GOOD_COLS_TXT', state.goodsColList[bizCode].mainGoodColsTxt)
        commit('SET_MAIN_GOOD_COLS', state.goodsColList[bizCode].mainGoodCols)
        commit('SET_RESERVE_GOOD_COLS_TXT_SON', state.goodsColList[bizCode].reserveGoodColsTxtSon)
        commit('SET_MAIN_GOOD_COLS_TXT_SON', state.goodsColList[bizCode].mainGoodColsTxtSon)
        commit('SET_SHOW_GOOD_COLS', state.goodsColList[bizCode].showGoodCols)
      } else {
        commit('SET_RESERVE_GOOD_COLS_TXT', state.reserveGoodColsTxtInit)
        commit('SET_RESERVE_GOOD_COLS', state.reserveGoodColsInit)
        commit('SET_MAIN_GOOD_COLS_TXT', state.mainGoodColsTxtInit)
        commit('SET_MAIN_GOOD_COLS', state.mainGoodColsInit)
        commit('SET_RESERVE_GOOD_COLS_TXT_SON', state.reserveGoodColsTxtSonInit)
        commit('SET_MAIN_GOOD_COLS_TXT_SON', state.mainGoodColsTxtSonInit)
        commit('SET_SHOW_GOOD_COLS', state.showGoodColsInit)
      }
    },

    // 物资属性字段初始化
    GoodsColList({ commit }) {
      return new Promise((resolve, reject) => {
        // 初始值
        goodsColList()
          .then(response => {
            const { data } = response
            // 输入框的物资主属性
            const mainGoodCols = []
            // 展示的物资主属性
            const mainGoodColsTxt = []
            // 输入框的物资预备属性
            const reserveGoodCols = []
            // 展示的物资预备属性
            const reserveGoodColsTxt = []
            // 展示的物资主属性
            const mainGoodColsTxtSon = []
            // 展示的物资预备属性
            const reserveGoodColsTxtSon = []
            // 可见的物资属性
            const showGoodCols = []

            // 多语言的物资属性
            const enGoodCols = {}
            const zhGoodCols = {}

            if (data) {
              data.forEach(goodCol => {
                const col = {}

                col.prop = goodCol.columnName
                col.label = 'goods.' + goodCol.columnName
                col.width = goodCol.columnWidth ? goodCol.columnWidth : '120'

                const colTxt = Object.assign({}, col)
                if (goodCol.columnFormat) {
                  colTxt['format'] = {
                    func: goodCol.columnFormat
                  }
                  col['attrs'] = {
                    type: goodCol.columnFormat,
                    clearable: true,
                    disabled: false
                  }
                  col['element'] = 'input-formatter'
                } else if (goodCol.reservedStr5) {
                  col['element'] = 'base-select'
                  col['attrs'] = {
                    datadict: goodCol.reservedStr5,
                    clearable: true,
                    disabled: false
                  }
                } else {
                  col['element'] = 'input-validate'
                  col['attrs'] = {
                    clearable: true,
                    disabled: false
                  }
                }
                // 主信息
                if (goodCol.proType === '1') {
                  mainGoodColsTxt.push(colTxt)
                  mainGoodCols.push(col)
                  const colTxtSon = Object.assign({}, colTxt)
                  colTxtSon['isSon'] = true
                  mainGoodColsTxtSon.push(colTxtSon)
                } else {
                  reserveGoodColsTxt.push(colTxt)
                  reserveGoodCols.push(col)

                  const colTxtSon = Object.assign({}, colTxt)
                  colTxtSon['isSon'] = true
                  reserveGoodColsTxtSon.push(colTxtSon)
                }
                showGoodCols.push(goodCol.columnName)
                zhGoodCols[goodCol.columnName] = goodCol.columnTxt
                enGoodCols[goodCol.columnName] = goodCol.columnTxtEn
              })
            }
            // 多语言
            const zh = {
              goods: {
                ...zhGoodCols
              }
            }
            // 多语言
            const en = {
              goods: {
                ...enGoodCols
              }
            }
            // 路由多语言
            i18n.mergeLocaleMessage('en', en)
            i18n.mergeLocaleMessage('zh', zh)

            commit('SET_RESERVE_GOOD_COLS_TXT', reserveGoodColsTxt)
            commit('SET_RESERVE_GOOD_COLS_TXT_INIT', reserveGoodColsTxt)
            commit('SET_RESERVE_GOOD_COLS', reserveGoodCols)
            commit('SET_RESERVE_GOOD_COLS_INIT', reserveGoodCols)
            commit('SET_MAIN_GOOD_COLS_TXT', mainGoodColsTxt)
            commit('SET_MAIN_GOOD_COLS_TXT_INIT', mainGoodColsTxt)
            commit('SET_MAIN_GOOD_COLS', mainGoodCols)
            commit('SET_MAIN_GOOD_COLS_INIT', mainGoodCols)
            commit('SET_RESERVE_GOOD_COLS_TXT_SON', reserveGoodColsTxtSon)
            commit('SET_RESERVE_GOOD_COLS_TXT_SON_INIT', reserveGoodColsTxtSon)
            commit('SET_MAIN_GOOD_COLS_TXT_SON', mainGoodColsTxtSon)
            commit('SET_MAIN_GOOD_COLS_TXT_SON_INIT', mainGoodColsTxtSon)
            commit('SET_SHOW_GOOD_COLS', showGoodCols)
            commit('SET_SHOW_GOOD_COLS_INIT', showGoodCols)

            resolve()
          })
          .catch(error => {
            reject(error)
          })

        // 动态更新
        sysBillGoodsCol()
          .then(response => {
            const { data } = response
            const goodsColMap = {}
            for (const i in data) {
              // 输入框的物资主属性
              const mainGoodCols = []
              // 展示的物资主属性
              const mainGoodColsTxt = []
              // 输入框的物资预备属性
              const reserveGoodCols = []
              // 展示的物资预备属性
              const reserveGoodColsTxt = []
              // 展示的物资主属性
              const mainGoodColsTxtSon = []
              // 展示的物资预备属性
              const reserveGoodColsTxtSon = []
              // 可见的物资属性
              const showGoodCols = []

              // 多语言的物资属性
              const enGoodCols = {}
              const zhGoodCols = {}

              if (data[i]) {
                data[i].forEach(goodCol => {
                  const col = {}

                  col.prop = goodCol.columnName
                  col.label = i + '.' + goodCol.columnName
                  col.width = goodCol.columnWidth ? goodCol.columnWidth : '120'

                  const colTxt = Object.assign({}, col)
                  if (goodCol.columnFormat) {
                    colTxt['format'] = {
                      func: goodCol.columnFormat
                    }
                    col['attrs'] = {
                      type: goodCol.columnFormat
                    }
                    col['element'] = 'input-formatter'
                  } else if (goodCol.reservedStr5) {
                    col['element'] = 'base-select'
                    col['attrs'] = {
                      datadict: goodCol.reservedStr5,
                      clearable: true
                    }
                  } else {
                    col['element'] = 'input-validate'
                  }
                  // 主信息
                  if (goodCol.proType === '1') {
                    mainGoodColsTxt.push(colTxt)
                    mainGoodCols.push(col)
                    const colTxtSon = Object.assign({}, colTxt)
                    colTxtSon['isSon'] = true
                    mainGoodColsTxtSon.push(colTxtSon)
                  } else {
                    reserveGoodColsTxt.push(colTxt)
                    reserveGoodCols.push(col)

                    const colTxtSon = Object.assign({}, colTxt)
                    colTxtSon['isSon'] = true
                    reserveGoodColsTxtSon.push(colTxtSon)
                  }
                  showGoodCols.push(goodCol.columnName)
                  zhGoodCols[goodCol.columnName] = goodCol.columnTxt
                  enGoodCols[goodCol.columnName] = goodCol.columnTxtEn
                })
              }

              // 多语言
              const zh = {
                [i]: {
                  ...zhGoodCols
                }
              }
              // 多语言
              const en = {
                [i]: {
                  ...enGoodCols
                }
              }
              // 路由多语言
              i18n.mergeLocaleMessage('en', en)
              i18n.mergeLocaleMessage('zh', zh)

              goodsColMap[i] = {
                mainGoodCols,
                mainGoodColsTxt,
                reserveGoodCols,
                reserveGoodColsTxt,
                mainGoodColsTxtSon,
                reserveGoodColsTxtSon,
                showGoodCols
              }
            }

            commit('SET_MAIN_GOOD_COLS_TXT_SON_UP', goodsColMap)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const { data } = response

            commit('SET_ID', data.id)
            commit('SET_ACTIVE_FLAG', data.activeFlag)
            commit('SET_NAME', data.name)
            commit('SET_ACCOUNT', data.account)
            commit('SET_USER_EMPLOYEE_CODE', data.userEmployeeCode)
            commit('SET_USER_DEPT_CODE', data.userDeptCode)
            if (data.loginOrganCode) {
              commit('SET_USER_ORGAN_CODE', data.loginOrganCode)
            } else {
              if (data.userOrganCode && !data.userOrganCode === process.env.DEFAULT_EXCLOUD_CORP) {
                commit('SET_USER_ORGAN_CODE', data.userOrganCode)
              } else {
                commit('SET_USER_ORGAN_CODE', '')
              }
            }
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetUser({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUser(state.token)
          .then(response => {
            const { data } = response
            commit('SET_ID', data.id)
            commit('SET_ACTIVE_FLAG', data.activeFlag)
            commit('SET_NAME', data.name)
            commit('SET_ACCOUNT', data.account)
            commit('SET_TENANT_CODE_HASH', data.tenantCodeHash)
            commit('SET_USER_EMPLOYEE_CODE', data.userEmployeeCode)
            commit('SET_USER_DEPT_CODE', data.userDeptCode)
            if (data.loginOrganCode) {
              commit('SET_USER_ORGAN_CODE', data.loginOrganCode)
            } else {
              if (data.userOrganCode && !data.userOrganCode === process.env.DEFAULT_EXCLOUD_CORP) {
                commit('SET_USER_ORGAN_CODE', data.userOrganCode)
              } else {
                commit('SET_USER_ORGAN_CODE', '')
              }
            }
            commit('SET_IDENTITY', data.identity)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取菜单信息
    GetMenus({ state }) {
      return new Promise((resolve, reject) => {
        getMenus(state.token)
          .then(response => {
            const { data } = response
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取路由信息
    GetRoutes({ state }) {
      return new Promise((resolve, reject) => {
        getRoutes(state.token)
          .then(response => {
            const { data } = response
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取路由信息
    GetSubRoutes({ state }) {
      return new Promise((resolve, reject) => {
        getSubRoutes(state.token)
          .then(response => {
            const { data } = response
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取标题信息
    GetTitles({ state }) {
      return new Promise((resolve, reject) => {
        getTitles(state.token)
          .then(response => {
            const { data } = response
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('REMOVE_TOKEN', '')
            removeToken()
            removeMd5()
            session.removeSet()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('REMOVE_TOKEN', '')
        removeToken()
        removeMd5()
        commit('SET_ID', '')
        commit('SET_ACTIVE_FLAG', '')
        commit('SET_NAME', '')
        commit('SET_ACCOUNT', '')
        commit('SET_USER_EMPLOYEE_CODE', '')
        commit('SET_USER_DEPT_CODE', '')
        commit('SET_USER_ORGAN_CODE', '')
        commit('SET_IDENTITY', '')

        session.removeSet()
        resolve()
      })
    },

    // 设置登录后选择的机构ID
    SetOrgan({ commit }, organId) {
      return new Promise((resolve, reject) => {
        commit('SET_LOGIN_ORGAN_ID', organId)
        resolve()
      })
    },

    // 获取币种名称
    GetCurrencyCode({ commit, state }, { funcModule, name }) {
      return new Promise(async (resolve, reject) => {
        if (state.currencyList.length === 0) {
          const { data } = await listSelectData({
            funcModule,
            funcOperation: '查询',
            data: {
              type: 'CURRENCY'
            }
          })
          commit('SET_CURRENCY_LIST', data)
          if (data.filter(item => item.name === name)[0]) {
            resolve(data.filter(item => item.name === name)[0].code)
          }
        } else {
          if (state.currencyList.filter(item => item.name === name)[0]) {
            resolve(state.currencyList.filter(item => item.name === name)[0].code)
          }
        }
      })
    },

    // 设置基础档案下拉选初始化数据
    SetBaseSelectList({ commit }, obj) {
      commit('SET_BASESELECT_LIST', obj)
    },

    // 获取基础档案下拉选初始化数据
    GetBaseSelectList({ state }, key) {
      return state.baseSelectList.get(key)
    }
  }
}

export default user

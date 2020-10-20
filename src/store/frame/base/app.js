import path from 'path'
import storage from '@/utils/frame/base/localStorage'

const app = {
  state: {
    sidebar: {
      opened: !+storage.get('sidebarStatus')
    },
    language: storage.get('language') || 'zh',
    clientSize: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    },
    btnControllMap: {},
    icons: []
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        storage.set('sidebarStatus', 1)
      } else {
        storage.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      storage.set('language', language)
    },
    SET_SIZE(state, size) {
      state.clientSize.width = document.documentElement.clientWidth
      state.clientSize.height = document.documentElement.clientHeight
    },
    SET_BUTTONAUTH(state, res) {
      if (res.moduleName) {
        state.btnControllMap[res.moduleName] = res.data
      }
    },
    SET_ICONS(state, icons) {
      state.icons = icons.map(v => ({ label: path.basename(v, '.svg'), value: path.basename(v, '.svg') }))
    }
  },
  actions: {
    toggleSideBar({
      commit
    }) {
      commit('TOGGLE_SIDEBAR')
    },
    setLanguage({
      commit
    }, language) {
      commit('SET_LANGUAGE', language)
    },
    resetSize({
      commit
    }) {
      commit('SET_SIZE')
    },
    SaveIconName({
      commit
    }, icons) {
      commit('SET_ICONS', icons)
    }
  }
}

export default app

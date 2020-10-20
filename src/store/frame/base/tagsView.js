const tagsView = {
  state: {
    visitedViews: [{
      name: 'dashboard',
      path: '/dashboard',
      fullPath: '/dashboard',
      title: 'dashboard',
      keyPath: '/dashboard'
    }],
    cachedViews: ['dashboard']
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      // 当前打开标签页name已存在
      if (state.visitedViews.some(v => v.name === view.name)) {
        let keyPath = view.fullPath
        if (view.params && JSON.stringify(view.params) !== '{}') {
          keyPath += '?'
          Object.keys(view.params).forEach(i => {
            keyPath += `${i}=${view.params[i]}&`
          })
          keyPath = keyPath.substring(0, keyPath.length - 1)
        }
        // 同一个name的标签是否可打开多次
        if (view.meta.multiple) {
          if (view.keyPath && !state.visitedViews.some(v => v.keyPath === view.keyPath)) {
            state.visitedViews.push({
              name: view.name,
              path: view.path,
              fullPath: view.fullPath,
              title: view.meta.title || 'no-name',
              tagTitle: view.meta.tagTitle,
              params: view.params,
              query: view.query,
              keyPath
            })
          }
        } else if (!state.visitedViews.map(v => v.keyPath).includes(keyPath)) {
          // 只有是子路由时才处理，一览页面不处理，解决别的页面跳转到一览页面刷新
          if (view && view.meta && view.meta.subMenuFlag === '1') {
            state.cachedViews.splice(state.cachedViews.indexOf(view.name), 1)
          }
          const index = state.visitedViews.map(v => v.name).indexOf(view.name)
          state.visitedViews[index].fullPath = view.fullPath
          state.visitedViews[index].params = view.params
          state.visitedViews[index].query = view.query
          state.visitedViews[index].keyPath = keyPath
          // 只有是子路由时才处理，一览页面不处理，解决别的页面跳转到一览页面刷新
          if (view && view.meta && view.meta.subMenuFlag === '1') {
            setTimeout(() => {
              state.cachedViews.push(view.name)
            }, 0)
          }
        }

        return
      }

      // 首次打开当前name的标签页
      let keyPath = view.fullPath
      if (view.params && JSON.stringify(view.params) !== '{}') {
        keyPath += '?'
        Object.keys(view.params).forEach(i => {
          keyPath += `${i}=${view.params[i]}&`
        })
        keyPath = keyPath.substring(0, keyPath.length - 1)
      }
      state.visitedViews.push({
        name: view.name,
        path: view.path,
        fullPath: view.fullPath,
        title: view.meta.title || 'no-name',
        tagTitle: view.meta.tagTitle,
        params: view.params,
        query: view.query,
        keyPath
      })
      // 缓存
      if (!view.meta.noCache) {
        // 是否缓存需要匹配组件中的name
        state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let keyPath = view.fullPath
      if (view.params && JSON.stringify(view.params) !== '{}') {
        keyPath += '?'
        Object.keys(view.params).forEach(i => {
          keyPath += `${i}=${view.params[i]}&`
        })
        keyPath = keyPath.substring(0, keyPath.length - 1)
      }

      for (const [i, v] of state.visitedViews.entries()) {
        if (v.keyPath === keyPath) {
          state.visitedViews.splice(i, 1)
          break
        }
      }

      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(view.name)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      let keyPath = view.fullPath
      if (view.params && JSON.stringify(view.params) !== '{}') {
        keyPath += '?'
        Object.keys(view.params).forEach(i => {
          keyPath += `${i}=${view.params[i]}&`
        })
        keyPath = keyPath.substring(0, keyPath.length - 1)
      }

      for (const [i, v] of state.visitedViews.entries()) {
        if (v.keyPath === keyPath) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          state.cachedViews = []
          state.cachedViews.push(i)
        }
      }
      state.visitedViews.unshift({
        name: 'dashboard',
        path: '/dashboard',
        fullPath: '/dashboard',
        title: 'dashboard',
        keyPath: '/dashboard'
      })
      state.cachedViews.unshift('dashboard')
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = [{
        name: 'dashboard',
        path: '/dashboard',
        fullPath: '/dashboard',
        title: 'dashboard',
        keyPath: '/dashboard'
      }]
      state.cachedViews = ['dashboard']
    },
    ADD_CACHE_VIEWS: (state, name) => {
      if (!state.cachedViews.includes(name)) state.cachedViews.push(name)
    },
    DEL_CACHE_VIEWS: (state, name) => {
      if (state.cachedViews.includes(name)) state.cachedViews.splice(state.cachedViews.indexOf(name), 1)
    }
  },
  actions: {
    addVisitedViews({
      commit
    }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({
      commit,
      state
    }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({
      commit,
      state
    }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({
      commit,
      state
    }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView

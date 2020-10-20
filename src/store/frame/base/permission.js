import Vue from 'vue'
import { constantMenuMap } from '@/menu'
import { constantRouterMap, routeIframe, routeExample } from '@/router'
import { formatRoutes } from '@/utils/frame/base/routeFormate.js'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 */

function addAsyncRouter(routes, routeIframe) {
  if (routes && routes instanceof Array) {
    routes.forEach(route => {
      if (route.iframeFlag) {
        routeIframe.children.push({
          path: route.path,
          name: route.name,
          meta: route.meta
        })
      } else {
        if (route.children && route.children.length > 0) {
          addAsyncRouter(route.children, routeIframe)
        } else {
          // 两个以上菜单需要使用同一个落地页时重新命名$option.name来保证缓存 选择[组件复用]则reuseFlag为1 会在*Edit外包一层自定义name如*Add等的父组件用于缓存
          if (route.reuseFlag && route.reuseFlag === '1') {
            const Detail = route.component
            const Component = Vue.component(route.name, {
              components: {
                Detail
              },
              render() {
                return <Detail class='cache' / >
              }
            })
            route.component = Component
          }
        }
      }
    })
  }

  return routeIframe
}

function setFirstParentName(routes, name) {
  routes.forEach(child => {
    if (child.children) {
      setFirstParentName(child.children, name)
    } else {
      if (child.meta) {
        child.meta.firstParent = name
      }
    }
  })
}

function convert(arr) {
  const newArr = arr.filter(item => !item.hidden)
  return newArr.map(item => {
    if (item.children) {
      item.children = convert(item.children)
    }
    return item
  })
}

const permission = {
  state: {
    menus: [],
    routers: [],
    addRouters: [],
    iframeRouters: routeIframe
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      if (process.env.NODE_ENV === 'development') {
        state.addRouters = routers.concat(routeExample)
        state.routers = constantRouterMap.concat(routeExample).concat(routers)
      } else if (process.env.NODE_ENV === 'production') {
        state.addRouters = routers
        state.routers = constantRouterMap.concat(routers)
      }
    },
    SET_MENUS: (state, menus) => {
      if (process.env.NODE_ENV === 'development') {
        state.menus = convert(menus.concat(constantMenuMap))
      } else if (process.env.NODE_ENV === 'production') {
        state.menus = convert(menus)
      }
    },
    SET_IFRAME: (state, routers) => {
      state.iframeRouters = routers
    }
  },
  actions: {
    NewGenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        const {
          menus,
          routes
          // subRoutes
        } = data

        if (menus) {
          menus.forEach(menu => {
            menu.meta.isFirstParent = true
            if (menu.children) {
              setFirstParentName(menu.children, menu.name)
            }
          })
          // 菜单生成
          commit('SET_MENUS', menus)
        }

        // 获取后台返回路由
        // routes.concat(subRoutes)
        const addRoute = formatRoutes(routes)

        // 获取并设置通过权限iframe路由
        const accessedIframeRoute = addAsyncRouter(addRoute, routeIframe)
        commit('SET_IFRAME', accessedIframeRoute)
        addRoute.push(accessedIframeRoute)
        addRoute.push({
          path: '*',
          redirect: '/404',
          hidden: true
        })
        // 添加后台返回及iframe路由
        commit('SET_ROUTERS', addRoute)

        resolve()
      })
    }
  }
}

export default permission

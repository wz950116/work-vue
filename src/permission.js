import router from './router'
import store from './store'
import i18n from '@/lang/index' // Internationalization

import { Notification, Message } from 'element-ui'
import { notifyError } from '@/utils/frame/base/notifyParams'

// frame路由
import zhFrameRoute from '@/lang/frame/base/modules/route_zh'
import enFrameRoute from '@/lang/frame/base/modules/route_en'

// proj路由
import zhProjRoute from '@/lang/proj/modules/route_zh'
import enProjRoute from '@/lang/proj/modules/route_en'

import session from '@/utils/frame/base/sessionStorage'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  getToken,
  isExpired,
  getLoginUrl
} from '@/utils/frame/base/auth' // 验权

const whiteList = ['/platform/login', '/old/login', '/group/login', '/user/login', '/login', '/401', '/404'] // 不重定向白名单
const logninList = ['/login', '/platform/login', '/old/login', '/group/login', '/user/login'] // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  var strRegex = '^/[A-Za-z0-9]*/login$'
  var oRegUrl = new RegExp(strRegex, 'i')
  if (getToken()) {
    // 登陆页面
    if ((oRegUrl.test(to.path)) || (logninList.indexOf(to.path) !== -1)) {
      if (isExpired()) {
        await store.dispatch('FedLogOut')
        Notification(notifyError({
          msg: '验证过期，重新登陆'
        }))
        next(getLoginUrl())
      } else {
        const loginType = session.get('loginType')
        if (loginType === 'plat' && to.path === '/platform/login') {
          // plat 匹配
          next(from.path)
        } else if (loginType === 'group' && to.path === '/group/login') {
          // group 匹配
          next(from.path)
        } else if (loginType === 'user' && (to.path === '/user/login' || to.path === '/login')) {
          // user 匹配
          next(from.path)
        } else if (loginType === 'user' && session.get('tenantHashCode') && to.path === '/' + session.get('tenantHashCode') + '/login') {
          // user 租户匹配
          next(from.path)
        } else {
          // 登陆不匹配
          await store.dispatch('FedLogOut')
          await store.dispatch('delAllViews')
          Notification(notifyError({
            msg: '正在切换登陆用户...'
          }))
          next(to.path)
        }
      }
      NProgress.done()
    } else {
      try {
        // 用户是否登陆的判断
        const account = store.getters.account || ''
        if (account.length < 1) {
          if (isExpired()) {
            await store.dispatch('FedLogOut')
            Notification(notifyError({
              msg: '验证过期，重新登陆'
            }))
            next(getLoginUrl())
          } else {
            // 取得用户信息
            const userInfo = await store.dispatch('GetUser')
            // 初始化字典、物资属性字段取得和 初始化路由
            await Promise.all([
              store.dispatch('GetMenus').then((data) => {
                userInfo['menus'] = data.menus
              }),
              store.dispatch('GetRoutes').then((data) => {
                userInfo['routes'] = data.routes
              }),
              // store.dispatch('GetSubRoutes').then((data) => {
              //   userInfo['subRoutes'] = data.subRoutes
              // }),
              store.dispatch('GetTitles').then((data) => {
                // 初始化路由多语言
                initRouteName(data.titleCNameMap, data.titleENameMap)
              }),
              store.dispatch('initData'),
              store.dispatch('GoodsColList')
            ])
            // 设置下拉远程查询
            store.dispatch('initRemoteDict')

            await store.dispatch('NewGenerateRoutes', userInfo)
            // 根据功能权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            // 提醒上次登陆时间
            if (userInfo && userInfo.lastLoginTime) {
              Message({
                message: '上次登陆时间:' + userInfo.lastLoginTime,
                type: 'warning',
                showClose: true
              })
            }
            next({
              ...to,
              replace: true
            })
          }
        } else {
          if (isExpired()) {
            // Token失效临时刷新Token保留页面
            if ($('#relogin-dialog').length) {
              if ($('#relogin-dialog').is(':hidden')) {
                $('#relogin-dialog').show()
                next({
                  ...from
                })
                NProgress.done()
              }
            }
          } else {
            if (to.meta.subMenuFlag && to.meta.subMenuFlag === '1') {
              if (!to.params || typeof to.params === {} || Object.keys(to.params).length === 0) {
                next({
                  path: '/401',
                  replace: true
                })
              }
            }
            session.set('permissionButtons', to.meta.buttons)
            session.set('bpmModule', to.meta.bpmModule)
            session.set('bizCode', to.meta.bizCode)
            session.set('seqMode', to.meta.seqMode)
            session.set('bpmFlg', to.meta.bpmFlag)
            session.set('errorMsgId', '')

            // 记录审批的请求
            const opType = to.params.opType || to.params.type
            const back = to.params.back
            if (opType === 'assist' || opType === 'audit') {
              session.set('auditModule', to.name)
            } else if (back === 'todo' || back === 'haveTodo') {
              session.set('auditModule', to.name)
            } else {
              session.set('auditModule', '')
            }

            // 商品属性列更新
            store.dispatch('GoodsColListUpdate', to.meta.bizCode)

            next()
          }
        }
      } catch (error) {
        NProgress.done()
        await store.dispatch('FedLogOut')
        Notification(notifyError({
          msg: '初始化失败，重新登陆'
        }))
        next(getLoginUrl())
      }
    }
  } else {
    if (oRegUrl.test(to.path) || whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 跳转
      next(getLoginUrl())
      NProgress.done()
    }
  }
})

router.afterEach((to, from, next) => {
  NProgress.done() // 结束Progress
})

/**
 * 初始化路由多语言
 * @param {*} titleCNameMap
 * @param {*} titleENameMap
 */
function initRouteName(titleCNameMap, titleENameMap) {
  // 路由多语言
  const zhRoute = {
    route: {
      ...zhFrameRoute,
      ...zhProjRoute,
      ...titleCNameMap
    }
  }
  // 路由多语言
  const enRoute = {
    route: {
      ...enFrameRoute,
      ...enProjRoute,
      ...titleENameMap
    }
  }
  // 路由多语言
  i18n.mergeLocaleMessage('en', enRoute)
  i18n.mergeLocaleMessage('zh', zhRoute)
}

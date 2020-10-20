import Vue from 'vue'
import Router from 'vue-router'

// 防止push重复路由报错
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(Router)

/* Layout */
import Layout from '@/views/frame/layout/Layout'

/**
 *
 * 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
hidden: true (默认 false)

当设置 noredirect 的时候该路由在面包屑导航中不可被点击
redirect: noredirect

当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
若你想不管路由下面的 children 声明的个数都显示你的根路由
你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
alwaysShow: true

name:'router-name'            设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
meta : {
  title: 'title'              设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name'            设置该路由的图标
  noAuth: true                如果设置为true ,则不会进行权限check(默认 false，也就是要进行权限检测)
  noCache: true               如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
}
 */
export const routeExample = [{
  path: '/example',
  name: 'example',
  component: Layout,
  meta: {
    title: 'example'
  },
  children: [
    {
      name: 'indexDemo',
      path: 'indexDemo',
      component: () => import('@/views/example/indexDemo/index'),
      meta: {
        title: 'indexDemo',
        noCache: true
      }
    },
    {
      name: 'editTagDemo',
      path: 'editTagDemo',
      component: () => import('@/views/example/indexDemo/editForm'),
      meta: {
        title: 'editTagDemo',
        noCache: true,
        multiple: false
      },
      hidden: true
    },
    {
      name: 'dialogDemo',
      path: 'dialogDemo',
      component: () => import('@/views/example/dialogDemo/index'),
      meta: {
        title: 'dialogDemo'
      }
    },
    {
      name: 'treeSearchDemo',
      path: 'treeSearchDemo',
      component: () => import('@/views/example/treeSearchDemo/index'),
      meta: {
        title: 'treeSearchDemo'
      }
    },
    {
      name: 'spanTableDemo',
      path: 'spanTableDemo',
      component: () => import('@/views/example/spanTableDemo/index'),
      meta: {
        title: 'spanTableDemo'
      }
    },
    {
      name: 'spanTableThDemo',
      path: 'spanTableThDemo',
      component: () => import('@/views/example/spanTableThDemo/index'),
      meta: {
        title: 'spanTableThDemo'
      }
    },
    {
      name: 'editSpanTableDemo',
      path: 'editSpanTableDemo',
      component: () => import('@/views/example/editSpanTableDemo'),
      meta: {
        title: 'editSpanTableDemo'
      }
    },
    {
      name: 'timeLineDemo',
      path: 'timeLineDemo',
      component: () => import('@/views/example/timeLineDemo'),
      meta: {
        title: 'timeLineDemo'
      }
    }
  ]
}]
export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/frame/login/index'),
    hidden: true
  },
  {
    path: '/group/login',
    name: 'grouplogin',
    component: () => import('@/views/frame/login/group/index'),
    hidden: true
  },
  {
    path: '/user/login',
    name: 'templogin',
    component: () => import('@/views/frame/login/user/index'),
    hidden: true
  },
  {
    path: '/platform/login',
    name: 'platformlogin',
    component: () => import('@/views/frame/login/platform/index'),
    hidden: true
  },
  {
    path: '/:tenantCode/login',
    component: () => import('@/views/frame/login/user/index'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/frame/base/error/404'),
    hidden: true
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/frame/base/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('@/views/frame/dashboard/index'),
        meta: {
          title: 'dashboard',
          icon: 'table',
          noCache: true
        }
      },
      {
        name: 'help',
        path: 'help',
        component: () => import('@/views/proj/help/index'),
        meta: {
          title: 'help',
          noAuth: true
        },
        hidden: true
      },
      {
        name: 'noticeRoute',
        path: '/sys/notice/route',
        component: () => import('@/views/frame/base/sys/notice/noticeRoute'),
        meta: {
          title: 'noticeRoute'
        }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/generatorMenu',
        name: 'generatorMenu',
        component: () => import('@/views/frame/base/generator/form/preview/menu.vue'),
        meta: {
          title: '查询页生成一览'
        }
      },
      {
        path: '/generatorSubmenu',
        name: 'generatorSubmenu',
        component: () => import('@/views/frame/base/generator/form/preview/submenu.vue'),
        meta: {
          title: '编辑页生成一览'
        }
      }
    ]
  }
]
export const routeIframe = {
  path: '/iframe',
  component: Layout,
  name: 'iframeTemp',
  meta: {
    title: 'iframeTemp'
  },
  children: [
    {
      path: 'bpm/pic/:hash',
      name: 'iframeDiagram',
      meta: {
        title: 'iframeBpmDiagram',
        icon: '',
        src: ''
      }
    },
    {
      path: 'bpm/view/:hash',
      name: 'iframeViewModel',
      meta: {
        title: 'iframeBpmPreview',
        icon: '',
        src: ''
      }
    },
    {
      path: 'bpm/edit/:hash',
      name: 'iframeEditModel',
      meta: {
        title: 'iframeBpmEdit',
        icon: '',
        src: ''
      }
    }
  ]
}
const router = new Router({
  routes: constantRouterMap,
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 100,
      y: 100
    }
  }
})
export default router

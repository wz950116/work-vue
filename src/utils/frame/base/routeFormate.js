import {
  Notification
} from 'element-ui'
import {
  notifyError
} from '@/utils/frame/base/notifyParams'
import Layout from '@/views/frame/layout/Layout'

export const formatRoutes = (aMenu) => {
  const aRouter = [{
    path: '',
    component: Layout,
    hidden: false,
    children: []
  }]
  if (aMenu instanceof Array) {
    aMenu.forEach(oMenu => {
      if (oMenu.component) {
        const {
          name,
          path,
          component,
          children,
          meta,
          iframeFlag,
          reuseFlag
        } = oMenu
        let oRouter = {}
        meta.title = name

        // const component = oMenu.component.replace(/views\/(frame|proj)\/biz\//gi, '')

        oRouter = {
          iframeFlag,
          reuseFlag,
          name,
          path,
          // component(resolve) {
          //   require([`vrm-biz/biz/${component}.vue`], resolve, e => {
          //     Notification(notifyError({
          //       msg: `vrm-biz/biz/${component}.vue找不到文件`
          //     }))
          //   })
          // },
          // component(resolve) {
          //   // 动态引入地址必须使用require，import会导致打包时死循环内存泄漏
          //   require([`@/${component}.vue`], resolve, e => {
          //     Notification(notifyError({
          //       msg: `${component}找不到文件`
          //     }))
          //   })
          // },
          component(resolve) {
            if (component.includes('views/frame/base/')) {
              require([`@/views/frame/base/${component.split('views/frame/base/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else if (component.includes('views/frame/biz/')) {
              require([`@/views/frame/biz/${component.split('views/frame/biz/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else if (component.includes('views/frame/dashboard/')) {
              require([`@/views/frame/dashboard/${component.split('views/frame/dashboard/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else if (component.includes('views/frame/iframe/')) {
              require([`@/views/frame/iframe/${component.split('views/frame/iframe/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else if (component.includes('views/frame/layout/')) {
              require([`@/views/frame/layout/${component.split('views/frame/layout/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else if (component.includes('views/frame/login/')) {
              require([`@/views/frame/login/${component.split('views/frame/login/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else if (component.includes('views/frame/rm/')) {
              require([`@/views/frame/rm/${component.split('views/frame/rm/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else if (component.includes('views/frame/warningStatistics/')) {
              require([`@/views/frame/warningStatistics/${component.split('views/frame/warningStatistics/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else if (component.includes('views/proj/')) {
              require([`@/views/proj/${component.split('views/proj/')[1]}.vue`], resolve, e => {
                Notification(notifyError({
                  msg: `${component}找不到文件`
                }))
              })
            } else {
              if (process.env.NODE_ENV === 'development') {
                if (component.includes('views/example/')) {
                  require([`@/views/example/${component.split('views/example/')[1]}.vue`], resolve, e => {
                    Notification(notifyError({
                      msg: `${component}找不到文件`
                    }))
                  })
                }
              }
            }
          },
          meta: meta,
          children: children ? formatRoutes(children) : []
        }
        aRouter[0].children.push(oRouter)
      }
    })
  }

  return aRouter
}

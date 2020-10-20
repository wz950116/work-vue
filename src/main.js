import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'default-passive-events'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import './permission' // permission control

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/graph'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
Vue.prototype.$echarts = echarts

import App from './App'
import store from './store'
import router from './router'

import '@/directive/frame/filters' // filter -g
import '@/directive/frame/dbClick' // directive -g
import '@/directive/frame/permission' // directive -g
import '@/directive/frame/drag' // directive -g
import '@/directive/proj/filters' // filter -g

import i18n from './lang' // Internationalization

import SvgIcon from '@/components/frame/SvgIcon' // svg组件
Vue.component('svg-icon', SvgIcon)
const qmIcon = require.context('./assets/frame/icon', true, /\.svg$/) // 深度搜索 返回一个函数 有resolve keys id三个属性
store.dispatch('SaveIconName', qmIcon.keys())
qmIcon.keys().map(qmIcon)

// drag dashboard layout
import VueDND from 'awe-dnd'
Vue.use(VueDND)

// Lazy Table
import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css'
import { UTableColumn, UTable } from 'umy-ui'
Vue.use(UmyUi)
Vue.use(UTableColumn)
Vue.use(UTable)

// 全局组件
// 树状下拉
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
Vue.component('treeselect', Treeselect)
// 非法验证输入框
import inputValidate from '@/components/frame/InputValidate'
Vue.component('input-validate', inputValidate)
// 格式化输入框
import inputFormatter from '@/components/frame/InputFormatter'
Vue.component('input-formatter', inputFormatter)
// 图片上传
import ImageUpload from '@/components/frame/qm/file/image'
Vue.component('image-upload', ImageUpload)
// 文件上传
import QmUpload from '@/components/frame/qm/file/upload'
Vue.component('qm-upload', QmUpload)
// 文件上传v2(可定义回调函数)
import QmUploadV2 from '@/components/frame/qm/file/uploadV2'
Vue.component('qm-upload-v2', QmUploadV2)
// 弹窗头部
import titleContain from '@/components/frame/TitleContain'
Vue.component('title-contain', titleContain)
// 列设置
import elTableColumnSet from '@/components/frame/ColumnSet'
Vue.component('el-table-column-set', elTableColumnSet)

// 基础模板组件
const path = require('path')
const qmTmp = require.context('./components/frame/qm/template', true, /\.vue$/)
qmTmp.keys().forEach(key => {
  const name = path.basename(key, '.vue')
  const _name = path.basename(key, '.vue').slice(2)
  const modules = qmTmp(key).default || qmTmp(key)
  Vue.component(name, modules)
  Vue.component(_name, modules)
})

Vue.use(Element, {
  size: 'small', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 生产环境是否控制台提示
Vue.config.productionTip = false

// 遍历后代refs子集获取指定节点
import { loopDOM } from '@/utils/frame/base/index'
Vue.prototype.$loopDOM = loopDOM
// 全局工具方法挂载
import toolUtil from '@/utils/frame/base/toolUtil.js'
Vue.prototype.$toolUtil = toolUtil
// 全局错误处理
import '@/utils/frame/base/errorLog'

new Vue({
  render: h => h(App),
  router,
  store,
  i18n
}).$mount('#app')

<template>
  <div class="app-container">
    <el-alert title="页面初始化错误,请联系技术人员" v-if="showError" type="error" show-icon></el-alert>
    <template v-if="showTemplate">
      <qm-form ref='qmForm' :form='form'></qm-form>
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>
<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import session from '@/utils/frame/base/sessionStorage'
// 注册组件
const registerComponent = data => {
  if (data && data.length > 0) {
    data.forEach(item => {
      if (item.component) {
        const { component } = item
        item.component = resolve => require.ensure([], () => resolve(require(`@/views/frame/base/generator/${component.split('views/frame/base/generator/')[1]}.vue`)))
      }
    })
  }
}
export default {
  name: 'generatorMenu',
  data() {
    return {
      showTemplate: false,
      showError: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          camelToUnderlineFlg: true,
          funcModule: '',
          funcOperation: '',
          code: this.$route.params.moduleCode || this.$route.params.code,
          data: {}
        },
        formData: []
      },
      mainData: {
        table: {
          cols: []
        },
        bottomBar: {
          pagination: {}
        }
      }
    }
  },

  async created() {
    const response = await request({
      url: '/api/code/codeManage/get',
      method: 'post',
      data: {
        data: this.$route.params.code,
        funcModule: this.$route.meta.title,
        funcOperation: this.$t('biz.btn.preview')
      }
    })
    if (response.data) {
      const resData = response.data.codeDataJson

      this.form.listQuery = Object.assign({}, this.form.listQuery, resData.form.listQuery, {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      })

      this.form.formData = resData.form.formData
      this.form.formData.forEach(form => {
        if (form.event && Object.keys(form.event).length) {
          Object.keys(form.event).forEach(f => {
            Object.keys(form.event)[f] = new Function(`return ${Object.keys(form.event)[f]}`)
          })
        }
      })
      this.mainData = resData.mainData
      this.mainData.initSearch = false // 不查询，只做预览页面结构
      this.mainData.table = resData.mainData.table
      this.mainData.bottomBar = resData.mainData.bottomBar
      this.mainData.topBar.forEach(btn => {
        if (btn.name === 'update' || btn.name === 'view') {
          btn.getParam = currentRow => {
            currentRow['componentCode'] = btn.componentCode
            return currentRow
          }
        }
      })

      // 组件注册
      registerComponent(this.mainData.topBar)

      this.showTemplate = true
    } else {
      this.showError = true
    }
  }
}
</script>

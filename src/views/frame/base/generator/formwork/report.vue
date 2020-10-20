<template>
  <div class="app-container">
    <el-alert title="页面初始化错误,请联系技术人员" v-if="showError" type="error" show-icon>
    </el-alert>
    <template v-if="showTemplate">
      <qm-form ref='qmForm' :form='form'></qm-form>
      <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->

      <qm-table v-if="isPage" ref='qmTable' :mainData='mainData'></qm-table>

      <qm-lazy-table v-else ref="qmTable" :mainData="mainData"></qm-lazy-table>
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
  name: 'formworkReport',
  data() {
    return {
      showTemplate: false,
      isPage: true,
      showError: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          camelToUnderlineFlg: true,
          funcModule: '',
          funcOperation: '',
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
      url: '/api/code/formwork/report',
      method: 'post',
      data: {
        data: session.get('bpmModule') || '',
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.init')
      }
    })
    if (response.data) {
      const resData = response.data.codeDataJson
      this.form.moreShowFlg = resData.form.moreShowFlg
      this.form.listQuery = Object.assign({}, this.form.listQuery, resData.form.listQuery, {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {}
      })
      this.form.formData = resData.form.formData
      this.mainData = Object.assign({}, resData.mainData, { api: { search: '/api/code/codeReport/reportSearch' } })
      // this.mainData.table = resData.mainData.table
      // this.mainData.bottomBar = resData.mainData.bottomBar
      // 组件注册
      registerComponent(this.mainData.topBar)
      this.showTemplate = true
      this.isPage = this.form.listQuery.isPage
    } else {
      this.showError = true
    }
  }
}
</script>

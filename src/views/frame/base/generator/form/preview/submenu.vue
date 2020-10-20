<template>
  <qm-edit v-if="showTemplate" ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>
<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
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
  name: 'generatorSubmenu',
  data() {
    return {
      showTemplate: false,
      edit: {
        type: 'add',
        param: this.$route.params || this.$route.query,
        mode: 'route',
        api: {},
        apiData: {},
        topButtons: [],
        formData: {},
        tables: [],
        tabs: []
      }
    }
  },
  async created() {
    const response = await request({
      url: '/api/code/codeManage/get',
      method: 'post',
      data: {
        data: this.$route.params.code,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      }
    })
    if (response.data) {
      this.edit = Object.assign({}, this.edit, response.data.codeDataJson)
      if (this.edit.topButtons) {
        // 预览只保留关闭按钮
        this.edit.topButtons = [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: true,
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
      // 主信息
      if (this.edit.formData && Object.keys(this.edit.formData).length) {
        Object.keys(this.edit.formData).forEach(part => {
          if (part && this.edit.formData[part].content) {
            this.edit.formData[part].content.forEach(form => {
              if (form.event && Object.keys(form.event).length) {
                Object.keys(form.event).forEach(f => {
                  form.event[f] = new Function(`return ${form.event[f]}`)()
                })
              }
            })
          } else {
            // 若定义数据不全则删除，防止页面报错
            delete this.edit.formData[part]
          }
        })
      }
      // 列表数据
      if (this.edit.tables) {
        this.edit.tables.forEach(table => {
          if (table.content.table && table.content.table.cols) {
            table.content.table.cols.forEach(col => {
              if (col.event && Object.keys(col.event).length) {
                const events = col.event
                Object.keys(col.event).forEach(f => {
                  col[f] = new Function(`return ${events[f]}`)()
                })
              }
            })
          }
          if (table.content.topBar) {
            registerComponent(table.content.topBar)
          }
        })
      }
      // 标签页数据
      if (this.edit.tabs) {
        this.edit.tabs.forEach(tab => {
          if (tab.content.table && tab.content.table.cols) {
            tab.content.table.cols.forEach(col => {
              if (col.event && Object.keys(col.event).length) {
                const events = col.event
                Object.keys(col.event).forEach(f => {
                  col[f] = new Function(`return ${events[f]}`)()
                })
              }
            })
          }
          if (tab.content.topBar) {
            registerComponent(tab.content.topBar)
          }
        })
      }
      // 所有列表数据都引入落地页tab
      this.edit.tables.forEach(table => {
        table.component = () => import('@/views/frame/base/generator/formwork/tab.vue')
      })
      this.edit.tabs.forEach(tab => {
        tab.component = () => import('@/views/frame/base/generator/formwork/tab.vue')
      })

      this.showTemplate = true
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$router.push({
        name: 'formCode'
      })
    }
  }
}
</script>

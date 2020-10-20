<template>
  <div class="app-container">
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'codeFormIndex',
  data() {
    return {
      form: {
        listQuery: {
          isPage: true,
          current: 1,
          size: 20,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {},
          defaultSortString: ''
        }
      },
      mainData: {
        api: {
          search: '/api/code/codeManage/list',
          doDelete: '/api/code/codeManage/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'more',
            i18n: 'biz.btn.add',
            list: [
              {
                name: 'add',
                i18n: '新增一览页面',
                type: 'dialog',
                component: () => import('./config.vue')
              },
              {
                name: 'add',
                i18n: '新增子路由页面',
                type: 'dialog',
                component: () => import('../edit/config.vue'),
                validate: currentRow => {
                  return currentRow && currentRow.codeType === 'menu'
                },
                msg: '请选择菜单进行新增'
              },
              {
                name: 'add',
                i18n: '新增弹窗',
                type: 'dialog',
                component: () => import('../dialog/config.vue'),
                validate: currentRow => {
                  return currentRow && currentRow.codeType === 'menu'
                },
                msg: '请选择菜单进行新增'
              }
            ]
          },

          {
            name: 'update',
            i18n: '修改菜单',
            type: 'dialog',
            component: () => import('./config.vue'),
            getParam: currentRow => {
              return currentRow.code
            },
            validate: currentRow => {
              return currentRow.codeType === 'menu'
            },
            msg: '请选择菜单进行编辑'
          },
          {
            name: 'update',
            i18n: '修改子路由',
            type: 'dialog',
            component: () => import('../edit/config.vue'),
            getParam: currentRow => {
              return currentRow.code
            },
            validate: currentRow => {
              return currentRow.codeType === 'submenu'
            },
            msg: '请选择子路由进行编辑'
          },
          {
            name: 'update',
            i18n: '修改弹窗',
            type: 'dialog',
            component: () => import('../dialog/config.vue'),
            getParam: currentRow => {
              return currentRow.code
            },
            validate: currentRow => {
              return currentRow.codeType === 'dialog'
            },
            msg: '请选择弹窗进行编辑'
          },

          {
            name: 'view',
            iconName: '线性-查看',
            i18n: 'biz.btn.preview',
            permitName: ['add'],
            event: this.doPreview
          },
          {
            name: 'remove',
            getParam: currentRow => {
              return currentRow.moduleCode
            }
          },
          {
            name: 'update',
            i18n: '菜单权限设置',
            type: 'dialog',
            getParam: currentRow => {
              return currentRow.code
            },
            component: () => import('./menu.vue')
          }
        ],

        isColset: false,
        table: {
          id: this.$route.meta.title,
          rowKey: 'code',
          expandAll: true,
          cols: [
            {
              prop: 'codeName',
              width: '220',
              label: '功能名称'
            },
            {
              prop: 'code',
              width: '100',
              label: '代码'
            },
            {
              prop: 'codeType',
              width: '120',
              label: '代码类型',
              align: 'center',
              format: {
                dict: this.$t('datadict.codeType')
              }
            },
            {
              prop: 'pageType',
              width: '120',
              label: '页面类型',
              align: 'center',
              format: {
                dict: this.$t('datadict.pageType')
              }
            },
            {
              prop: 'moduleCode',
              width: '120',
              label: '菜单代码'
            }
          ]
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  },
  methods: {
    doPreview(buttonInfo) {
      const { currentRow } = this.$refs.qmTable
      if (currentRow.codeType === 'menu') {
        this.$router.push({
          name: 'generatorMenu',
          params: currentRow
        })
      } else if (currentRow.codeType === 'submenu') {
        this.$router.push({
          name: 'generatorSubmenu',
          params: currentRow
        })
      } else if (currentRow.codeType === 'dialog') {
        Vue.component('view-form-table', () => import('@/views/frame/base/generator/form/preview/dialog.vue'))
        this.$refs.qmTable.param = currentRow
        this.$refs.qmTable.dialogDetailVisible = true
      }
    }
  }
}
</script>

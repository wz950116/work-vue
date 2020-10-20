<template>
  <div class="app-container">
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
export default {
  name: 'codeReportIndex',
  data() {
    return {
      form: {
        listQuery: {
          isPage: true,
          current: 1,
          size: 20,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: { codeType: 'report' },
          defaultSortString: ''
        }
      },
      mainData: {
        api: {
          search: '/api/code/codeReport/page',
          doDelete: '/api/code/codeReport/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('./edit.vue'),
            getParam: currentRow => {
              return currentRow.id
            }
          },
          {
            name: 'remove',
            getParam: currentRow => {
              return currentRow.id
            }
          },
          {
            name: 'refresh'
          },
          {
            name: 'view',
            type: 'dialog',
            i18n: 'biz.btn.preview',
            getParam: currentRow => {
              return currentRow.id
            },
            component: () => import('./preview.vue')
          },
          {
            name: 'update',
            i18n: '菜单权限设置',
            type: 'dialog',
            msg: '当前报表模板已经设置菜单',
            validate: currentRow => {
              if (currentRow.moduleCode) {
                return false
              } else {
                return true
              }
            },
            getParam: currentRow => {
              return currentRow.id
            },
            component: () => import('./menu.vue')
          }
        ],
        initSearch: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'codeName',
              width: '220',
              label: '功能名称'
            },
            {
              prop: 'moduleCode',
              width: '220',
              label: '菜单代码'
            },
            {
              prop: 'remark',
              label: '功能说明'
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
  }
}
</script>

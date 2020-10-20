<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
export default {
  name: 'cfgComponent',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          camelToUnderlineFlg: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {},
          defaultSortString: 'code.asc'
        },
        formData: [
          {
            label: 'platform.cfgComponent.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'platform.cfgComponent.systemFlag',
            prop: 'systemFlag',
            element: 'base-select',
            list: this.$t('datadict.systemFlag'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'platform.cfgComponent.blockType',
            prop: 'blockType',
            element: 'base-select',
            list: this.$t('datadict.blockType'),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/platform/cfgComponent/list',
          doDelete: '/api/platform/cfgComponent/remove'
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
            getParam: () => {
              return this.$refs.qmTable.currentRow.code
            }
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.code
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],
        initSearch: true,
        isColset: true,
        table: {
          id: this.$route.meta.title,
          sortable: 'custom',
          cols: [
            {
              prop: 'code',
              width: '250',
              label: 'platform.cfgComponent.code'
            },
            {
              prop: 'name',
              width: '200',
              label: 'platform.cfgComponent.name'
            },
            {
              prop: 'systemFlag',
              label: 'platform.cfgComponent.systemFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.systemFlag')
              }
            },
            {
              prop: 'blockType',
              label: 'platform.cfgComponent.blockType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.blockType')
              }
            },
            {
              prop: 'routerName',
              label: 'platform.cfgComponent.routerName',
              width: '200'
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

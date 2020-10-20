<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
export default {
  name: 'sysFlow',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          camelToUnderlineFlg: true,
          data: {
            dictName: '',
            dictCode: '',
            dictType: '1',
            datausingFlag: ''
          },
          defaultSortString: 'createDate.desc'
        },
        formData: [
          {
            label: 'sys.flow.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.flow.code',
            prop: 'code',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.flow.flowType',
            prop: 'flowType',
            element: 'base-select',
            list: this.$t('datadict.sysFlowType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/sys/flow/page',
          doDelete: '/api/sys/flow/remove'
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
            name: 'detailSet',
            type: 'route',
            routeInfo: () => {
              const row = this.$refs.qmTable.currentRow
              return {
                name: 'sysFlowDetail',
                params: {
                  back: 'sysFlow',
                  opType: 'detailSet',
                  flowType: row.flowType,
                  code: row.code
                }
              }
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
              prop: 'name',
              width: '260',
              label: 'sys.flow.name'
            },
            {
              prop: 'code',
              width: '100',
              label: 'sys.flow.code'
            },
            {
              label: 'sys.flow.flowType',
              prop: 'flowType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.sysFlowType')
              }
            },
            {
              label: 'sys.flow.startBillType',
              prop: 'startBillType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            {
              prop: 'usingFlag',
              label: 'biz.lbl.usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              label: 'biz.lbl.remark',
              sortable: false,
              prop: 'remark',
              width: '300'
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

<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
export default {
  name: 'dictBusiness',
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
          defaultSortString: 'dictCode.asc'
        },
        formData: [
          {
            label: 'sys.dict.dictName',
            prop: 'dictName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.dict.dictCode',
            prop: 'dictCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.dict.dictBiz',
            prop: 'dictBiz',
            element: 'base-select',
            list: this.$t('datadict.dictBiz'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'datausingFlag',
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
          search: '/api/sys/dict/list',
          doDelete: '/api/sys/dict/remove'
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
              return this.$refs.qmTable.currentRow.dictCode
            }
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.dictCode
            }
          },
          {
            name: 'detailSet',
            type: 'route',
            routeInfo: () => {
              const row = this.$refs.qmTable.currentRow
              return {
                name: 'dictBusinessItem',
                params: {
                  back: 'dictBusiness',
                  opType: 'detailSet',
                  dictCode: row.dictCode
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
              prop: 'dictName',
              width: '200',
              label: 'sys.dict.dictName'
            },
            {
              prop: 'dictCode',
              width: '300',
              label: 'sys.dict.dictCode'
            },
            {
              label: 'sys.dict.dictBiz',
              prop: 'dictBiz',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.dictBiz')
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

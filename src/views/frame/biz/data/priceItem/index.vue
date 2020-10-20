<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
export default {
  name: 'priceItem',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            priceItemType: '',
            priceItemName: '',
            usingFlag: ''
          },
          defaultSortString: 'id.asc'
        },
        formData: [
          {
            label: 'data.priceItem.form.priceItemType',
            prop: 'priceItemType',
            element: 'base-select',
            list: this.$t('datadict.priceItemType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.priceItem.form.priceItemName',
            prop: 'priceItemName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.priceItem.form.usingFlag',
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
          search: '/api/dd/price/item/list',
          doDelete: '/api/dd/price/item/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.priceItemCode
            },
            component: () => import('./editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.priceItemCode
            },
            msg: this.$t('biz.msg.deleteTip'),
            validate(row) {
              return row.usingFlag === '0'
            }
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.priceItemCode
            },
            component: () => import('./editForm.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'priceItemCode',
              label: 'data.priceItem.list.priceItemCode',
              width: '160'
            },
            {
              prop: 'priceItemType',
              align: 'center',
              width: '120',
              label: 'data.priceItem.list.priceItemType',
              format: {
                dict: this.$t('datadict.priceItemType')
              }
            },
            {
              prop: 'priceItemName',
              label: 'data.priceItem.list.priceItemName',
              width: '120'
            },
            {
              prop: 'priceUnit',
              align: 'center',
              width: '100',
              label: 'data.priceItem.list.priceUnitName',
              format: {
                dict: this.$t('datadict.priceUnit')
              }
            },
            {
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.priceItem.list.usingFlag'
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

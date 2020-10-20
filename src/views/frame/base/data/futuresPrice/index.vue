<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>

    <importDialog v-if="imoprtDialogVisible" @close="importDialogClose"></importDialog>
  </div>
</template>

<script>
import importDialog from '@/views/frame/base/data/futuresPrice/components/importDialog.vue'

export default {
  name: 'futuresPrice',
  components: {
    importDialog
  },
  data() {
    return {
      imoprtDialogVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            contractCode: '',
            saveDate: '',
            dataSource: ''
          },
          defaultSortString: 'saveDate.desc'
        },
        formData: [
          {
            label: 'data.futuresPrice.form.contractCode',
            prop: 'contractCode',
            element: 'base-select',
            attrs: {
              data: 'FUTURES_CONTRACT',
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'data.futuresPrice.form.saveDate',
            prop: 'saveDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'data.futuresPrice.form.dataSource',
            prop: 'dataSource',
            element: 'base-select',
            list: this.$t('datadict.dataAttr'),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/data/ddFuturesPrice/page',
          doDelete: '/api/data/ddFuturesPrice/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/base/data/futuresPrice/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/base/data/futuresPrice/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.id
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/base/data/futuresPrice/editForm.vue')
          },
          {
            name: 'import',
            $refs: this.$refs,
            i18n: 'biz.btn.import',
            iconName: '线性-导入',
            event: this.import
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'contractCode',
              width: '120',
              label: 'data.futuresPrice.list.contractCode'
            },
            {
              prop: 'saveDate',
              width: '100',
              label: 'data.futuresPrice.list.saveDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'settlementPrice',
              width: '120',
              label: 'data.futuresPrice.list.settlementPrice',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'lastPrice',
              width: '120',
              label: 'data.futuresPrice.list.lastPrice',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'highestPrice',
              width: '120',
              label: 'data.futuresPrice.list.highestPrice',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'lowestPrice',
              width: '120',
              label: 'data.futuresPrice.list.lowestPrice',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'openPrice',
              width: '120',
              label: 'data.futuresPrice.list.openPrice',
              align: 'right',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'dataSource',
              width: '100',
              label: 'data.futuresPrice.list.dataSource',
              align: 'center',
              format: {
                dict: this.$t('datadict.dataAttr')
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
  },
  methods: {
    import() {
      this.imoprtDialogVisible = true
    },
    importDialogClose() {
      this.imoprtDialogVisible = false
      this.$refs.qmTable.getList()
    }
  }
}
</script>

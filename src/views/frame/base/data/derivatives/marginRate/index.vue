<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
    <importDialog v-if="imoprtDialogVisible" @close="importDialogClose"></importDialog>
  </div>
</template>
<script>
import importDialog from '@/views/frame/base/data/derivatives/marginRate/importDialog'

export default {
  name: 'marginRate',
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
            saveDate: '',
            derivativeAccount: '',
            futuresVarietiesCode: '',
            contractCode: ''
          },
          defaultSortString: 'saveDate.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'dataHq.marginRate.saveDate',
            prop: 'saveDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'dataHq.marginRate.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            }
          },
          {
            label: 'dataHq.marginRate.futuresVarietiesCode',
            prop: 'futuresVarietiesCode',
            element: 'base-select',
            attrs: {
              data: 'FUTURES_VARIETIES',
              clearable: true
            }
          },
          {
            label: 'dataHq.marginRate.contractCode',
            prop: 'contractCode',
            element: 'base-select',
            attrs: {
              data: 'FUTURES_CONTRACT',
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/data/ddMarginRate/page',
          doDelete: '/api/data/ddMarginRate/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {},
            component: () => import('@/views/frame/base/data/derivatives/marginRate/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/marginRate/edit.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/marginRate/edit.vue')
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

        isColset: false,
        table: {
          id: 'marginRateList',
          cols: [
            {
              prop: 'saveDate',
              label: 'dataHq.marginRate.saveDate',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'derivativeAccount',
              label: 'dataHq.marginRate.derivativeAccount',
              weight: '120'
            },
            {
              prop: 'futuresVarietiesName',
              label: 'dataHq.marginRate.futuresVarietiesCode',
              weight: '120'
            },
            {
              prop: 'contractCode',
              label: 'dataHq.marginRate.contractCode',
              weight: '120'
            },
            {
              prop: 'hedgeFlag',
              label: 'dataHq.marginRate.hedgeFlag',
              weight: '120',
              format: {
                dict: this.$t('datadict.futureHedgeType')
              }
            },
            {
              prop: 'longMarginRatioByMoney',
              align: 'right',
              width: '120',
              label: 'dataHq.marginRate.longMarginRatioByMoney',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'longMarginRatioByVolume',
              align: 'right',
              width: '120',
              label: 'dataHq.marginRate.longMarginRatioByVolume',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'shortMarginRatioByMoney',
              align: 'right',
              width: '120',
              label: 'dataHq.marginRate.shortMarginRatioByMoney',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'shortMarginRatioByVolume',
              align: 'right',
              width: '120',
              label: 'dataHq.marginRate.shortMarginRatioByVolume',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'optEmployeeName',
              label: 'dataHq.marginRate.optEmployeeName',
              weight: '100'
            },
            {
              prop: 'createDate',
              label: 'dataHq.marginRate.createTime',
              width: '180',
              align: 'center'
            },
            {
              prop: 'dataSource',
              width: '100',
              align: 'center',
              label: 'dataHq.marginRate.dataSource',
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


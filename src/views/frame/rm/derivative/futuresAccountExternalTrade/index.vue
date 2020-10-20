<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
    <importDialog v-if="imoprtDialogVisible" @close="importDialogClose"></importDialog>
  </div>
</template>
<script>
import importDialog from '@/views/frame/rm/derivative/futuresAccountExternalTrade/importDialog'

export default {
  name: 'expireTrade',
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
          defaultSortString: 'tradingDay.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'derivative.externalTrade.tradingDay',
            props: ['tradingDayFrom', 'tradingDayTo'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'derivative.externalTrade.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            }
          },
          {
            label: 'derivative.externalTrade.futuresContractCode',
            prop: 'futuresContractCode',
            element: 'base-select',
            attrs: {
              data: 'FUTURES_CONTRACT',
              clearable: true
            }
          },
          {
            label: 'derivative.externalTrade.tradeId',
            prop: 'tradeId',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/dvt/externalTrade/list',
          doDelete: '/api/dvt/externalTrade/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {},
            component: () => import('@/views/frame/rm/derivative/futuresAccountExternalTrade/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/rm/derivative/futuresAccountExternalTrade/edit.vue')
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
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/rm/derivative/futuresAccountExternalTrade/edit.vue')
          },
          {
            name: 'import',
            $refs: this.$refs,
            i18n: 'biz.btn.import',
            iconName: '线性-导入',
            event: this.import
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
              prop: 'tradingDay',
              label: 'derivative.externalTrade.tradingDay',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'derivativeAccount',
              label: 'derivative.externalTrade.derivativeAccount',
              weight: '120'
            },
            {
              prop: 'futuresContractCode',
              label: 'derivative.externalTrade.futuresContractCode',
              weight: '120'
            },
            {
              prop: 'tradeId',
              label: 'derivative.externalTrade.tradeId',
              weight: '120'
            },
            {
              prop: 'direction',
              align: 'center',
              width: '120',
              label: 'derivative.externalTrade.direction',
              format: {
                dict: this.$t('datadict.futuresDirection')
              }
            },
            {
              prop: 'price',
              align: 'right',
              width: '120',
              label: 'derivative.externalTrade.price',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'volume',
              align: 'right',
              width: '120',
              label: 'derivative.externalTrade.volume',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'commission',
              align: 'right',
              width: '120',
              label: 'derivative.externalTrade.commission',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'adjustFee',
              align: 'right',
              width: '120',
              label: 'derivative.externalTrade.adjustFee',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'expireDate',
              label: 'derivative.externalTrade.expireDate',
              width: '120',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'preliminaryFlag',
              align: 'center',
              label: 'derivative.externalTrade.preliminaryFlag',
              weight: '200',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'remark',
              label: 'derivative.externalTrade.remark',
              weight: '200'
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


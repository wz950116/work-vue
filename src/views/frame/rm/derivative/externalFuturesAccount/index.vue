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
import importDialog from '@/views/frame/rm/derivative/externalFuturesAccount/importDialog'

export default {
  name: 'externalFuturesAccount',
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
            tradingDay: '',
            derivativeAccount: '',
            futuresVarietiesCode: '',
            contractCode: ''
          },
          sortString: 'tradingDay.desc'
        },
        formData: [
          {
            label: 'derivative.externalTradeAccount.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true,
              params: { derivativeCategory: '2' }
            }
          },
          {
            type: 'date',
            label: 'derivative.externalTradeAccount.tradingDay',
            prop: 'tradingDay',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'derivative.externalTradeAccount.preliminaryFlag',
            prop: 'preliminaryFlag',
            element: 'base-select',
            list: this.$t("datadict.yesNo"),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          // TODO API URL
          search: '/api/derivative/dvtExtFuturesAccount/list',
          doDelete: '/api/derivative/dvtExtFuturesAccount/remove'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () =>
              import('@/views/frame/rm/derivative/externalFuturesAccount/edit.vue')
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
            component: () =>
              import('@/views/frame/rm/derivative/externalFuturesAccount/edit.vue')
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
          id: 'externalFuturesAccountList',
          cols: [
            {
              prop: 'brokerName',
              label: 'derivative.externalTradeAccount.brokerName',
              weight: '150'
            },
            {
              prop: 'derivativeAccount',
              label: 'derivative.externalTradeAccount.derivativeAccount',
              weight: '150'
            },
            {
              prop: 'tradingDay',
              label: 'derivative.externalTradeAccount.tradingDay',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'preBalance',
              label: 'derivative.externalTradeAccount.preBalance',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'inFund',
              label: 'derivative.externalTradeAccount.inFund',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'outFund',
              label: 'derivative.externalTradeAccount.outFund',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'closeProfit',
              label: 'derivative.externalTradeAccount.closeProfit',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'positionProfit',
              label: 'derivative.externalTradeAccount.positionProfit',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'commission',
              label: 'derivative.externalTradeAccount.commission',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'posiMargin',
              label: 'derivative.externalTradeAccount.posiMargin',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'available',
              label: 'derivative.externalTradeAccount.available',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'balance',
              label: 'derivative.externalTradeAccount.balance',
              align: 'right',
              weight: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'currencyName',
              label: 'derivative.externalTradeAccount.currencyName',
              weight: '150'
            }, {
              prop: 'preliminaryFlag',
              label: 'derivative.externalTradeAccount.preliminaryFlag',
              align: 'center',
              weight: '150',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'remark',
              label: 'derivative.externalTradeAccount.remark',
              weight: '120'
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


<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>

    <importDialog v-if="imoprtDialogVisible" @close="importDialogClose"></importDialog>
  </div>
</template>

<script>
import excelUtil from '@/utils/frame/base/excelUtil.js'
import optionTradeImport from '@/assets/frame/excel/dvt/optionTradeImport.xlsx'
import importDialog from '@/views/frame/rm/option/optionTrade/components/importDialog'

export default {
  name: 'optionTrade',
  components: {
    importDialog
  },
  data() {
    return {
      imoprtDialogVisible: false,
      tempExcelPath: optionTradeImport,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            derivativeAccount: '',
            tradingDay: '',
            counterparty: ''
          },
          defaultSortString: 'tradingDay.desc'
        },
        formData: [
          {
            label: 'option.trade.form.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'option.trade.form.tradingDay',
            prop: 'tradingDay',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'option.trade.form.counterparty',
            prop: 'counterparty',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              clearable: true,
              params: {
                typeCode: '12',
                usingFlag: '1',
                auditStatus: '3'
              }
            }
          }
        ]
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/derivative/dvtOptionTrade/page',
          doDelete: '/api/derivative/dvtOptionTrade/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              // TODO //return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/rm/option/optionTrade/editForm.vue')
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: this.import
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/rm/option/optionTrade/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/rm/option/optionTrade/editForm.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          },
          {
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: this.download
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'derivativeAccount',
              label: 'option.trade.list.derivativeAccount',
              width: '200'
            },
            {
              prop: 'customerName',
              label: 'option.trade.list.customerName',
              width: '200'
            },
            {
              prop: 'tradeId',
              label: 'option.trade.list.tradeId',
              width: '200'
            },
            {
              prop: 'optionOffset',
              label: 'option.trade.list.optionOffset',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.optionOffset')
              }
            },
            {
              prop: 'optionContract',
              label: 'option.trade.list.optionContract',
              width: '200'
            },
            {
              prop: 'currencyName',
              label: 'option.trade.list.currencyName',
              width: '200'
            },
            {
              prop: 'tradingDay',
              label: 'option.trade.list.tradingDay',
              width: '120',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'direction',
              label: 'option.trade.list.direction',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.optionDirection')
              }
            },
            {
              prop: 'callPut',
              label: 'option.trade.list.callPut',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.callPut')
              }
            },
            {
              prop: 'strikePrice',
              label: 'option.trade.list.strikePrice',
              align: 'right',
              width: '120',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'price',
              label: 'option.trade.list.price',
              align: 'right',
              width: '120',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'volume',
              label: 'option.trade.list.volume',
              align: 'right',
              width: '120',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'underlyingPrice',
              label: 'option.trade.list.underlyingPrice',
              align: 'right',
              width: '120',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'premium',
              label: 'option.trade.list.premium',
              align: 'right',
              width: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'commission',
              label: 'option.trade.list.commission',
              align: 'right',
              width: '120',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'endDate',
              label: 'spotProj.exposure.list.endDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'counterpartyName',
              label: 'option.trade.list.counterpartyName',
              width: '200'
            },
            {
              prop: 'preliminaryFlag',
              label: 'option.trade.list.preliminaryFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'dataAttr',
              label: 'option.trade.list.dataAttr',
              width: '120',
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
    download() {
      const url = this.tempExcelPath
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '期货数据导入模板.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
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

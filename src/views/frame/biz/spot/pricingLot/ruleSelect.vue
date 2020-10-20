<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
import Vue from 'vue'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'pricingLotSelect',
  data() {
    return {
      dialog: {
        titleName: '选择定价规则',
        listQuery: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            pricingLotCode: '',
            contractCode: '',
            productCode: ''
          },
          defaultSortString: 'pricingLotCode.desc'
        },
        formData: [
          {
            label: 'spot.pricingRule.form.contractCode',
            prop: 'contractCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingRule.form.productName',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          }
        ],
        mainData: {
          initSearch: true,
          api: {
            search: '/api/pricingRule/listForSelect'
          },
          apiData: {},
          table: {
            id: '',
            cols: [
              {
                label: 'spot.pricingRule.form.contractCode',
                prop: 'contractCode',
                width: 180
              },
              {
                label: 'spot.pricingRule.form.purchaseOrSale',
                prop: 'purchaseOrSale',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.purchaseOrSale')
                }
              },
              {
                label: 'spot.pricingRule.form.productName',
                prop: 'productName',
                width: 150
              },
              {
                label: 'spot.pricingLot.form.currency',
                prop: 'currency',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.currency')
                }
              },
              {
                label: 'spot.pricingRule.form.pricingType',
                prop: 'pricingType',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.pricingType')
                }
              },
              {
                label: 'spot.pricingRule.form.pricingBenchmark',
                prop: 'pricingItemName',
                width: 180
              },
              {
                label: 'spot.pricingRule.form.pricingQuantity',
                prop: 'pricingQuantity',
                width: 120,
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.pricingRule.form.rmnMemQty',
                prop: 'rmnMemQty',
                width: 120,
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.pricingRule.form.valueUnit',
                prop: 'valueUnit',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                }
              },
              {
                label: 'spot.pricingRule.form.premium',
                prop: 'premium',
                width: 120,
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'spot.pricingRule.form.baseDate',
                prop: 'baseDate',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.baseDate')
                }
              },
              {
                label: 'spot.pricingRule.form.pricingPeriod',
                prop: 'pricingPeriod',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.pricingPeriod')
                }
              },
              {
                label: 'spot.contractLot.form.pricingTime',
                prop: 'pricingTime',
                width: '180',
                formatter: this.formatPricingTime
              },
              {
                label: 'spot.contractLot.form.quantityLimit',
                prop: 'quantityLimit',
                width: '150',
                formatter: this.formatQuantityLimit
              },
              {
                label: 'spot.contractLot.form.pricingRight',
                prop: 'pricingRight',
                width: '180',
                formatter: this.formatPricingRight
              },
              {
                label: 'spot.contractLot.form.overdueInfo',
                prop: 'overdueInfo',
                width: '180',
                formatter: this.formatOverdueInfo
              },
              {
                label: 'spot.pricingRule.form.docMaker',
                prop: 'docMaker',
                width: 90
              },
              {
                label: 'spot.pricingRule.form.docMakeDate',
                prop: 'docMakeDate',
                width: 90,
                align: 'center',
                formatter(row, column, cellValue) {
                  if (cellValue) {
                    if (cellValue.length > 10) {
                      return cellValue.substr(0, 10)
                    }
                  }
                  return cellValue
                }
              }
            ]
          }
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        },
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['view']
          },
          {
            name: 'biz.btn.save',
            event: this.doSelect,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    doSelect() {
      const row = this.$refs.qmDialogTable.currentRow
      this.handleCloseDialog(row)
    },
    getDictLabel(dictName, dictValue) {
      if (dictValue === null || dictValue === undefined || dictValue === '') {
        return ''
      }
      const dictItems = this.$t('datadict.' + dictName)
      let dictLabel = dictValue
      for (let i = 0; i < dictItems.length; i++) {
        if (dictItems[i].value === dictValue) {
          dictLabel = dictItems[i].label
        }
      }
      return dictLabel
    },
    formatPricingTime(row, column, cellValue, index) {
      if (row.baseDate === '4') {
        if (row.pricingTimeStart !== undefined && row.pricingTimeEnd !== undefined) {
          return toolUtil.formatDate(row.pricingTimeStart) + ' - ' + toolUtil.formatDate(row.pricingTimeEnd)
        }
      } else if (row.pricingPeriod === '6') {
        if (row.dayBefore !== undefined && row.dayAfter !== undefined) {
          return '往前' + row.dayBefore + '日 - 往后' + row.dayAfter + '日'
        }
      } else {
        if (row.monthBegin !== undefined && row.dayBegin !== undefined && row.monthEnd !== undefined && row.dayEnd !== undefined) {
          return this.getDictLabel('pricingMonth', row.monthBegin) + row.dayBegin + '日 - ' + this.getDictLabel('pricingMonth', row.monthEnd) + row.dayEnd + '日'
        }
      }
      return ''
    },
    formatQuantityLimit(row, column, cellValue, index) {
      if (row.pricingType !== '2') {
        return ''
      }
      if (row.minQuantity !== undefined && row.maxQuantity !== undefined) {
        return Vue.filter('weight')(row.minQuantity) + ' - ' + Vue.filter('weight')(row.maxQuantity)
      }
    },
    formatPricingRight(row, column, cellValue, index) {
      if (row.pricingType !== '2') {
        return ''
      }
      if (row.pricingRight !== undefined && row.ourRightLevel !== undefined && row.otherRightLevel !== undefined) {
        return this.getDictLabel('pricingRight', row.pricingRight) + '点价, 买方' + row.ourRightLevel + '%, 买方' + row.otherRightLevel + '%'
      }
    },
    formatOverdueInfo(row, column, cellValue, index) {
      if (row.pricingType !== '2') {
        return ''
      }
      if (row.overdueMode === '0') {
        return this.getDictLabel('overdueMode', row.overdueMode) + ', ' + this.getDictLabel('deferCycleMode', row.deferCycleMode) + '周期' + row.deferFee
      } else if (row.overdueMode === '1') {
        return this.getDictLabel('overdueMode', row.overdueMode) + ', ' + this.getDictLabel('overduePricingType', row.overduePricingType) + ', ' + row.overduePricingNote
      } else {
        return this.getDictLabel('overdueMode', row.overdueMode)
      }
    }
  }
}
</script>

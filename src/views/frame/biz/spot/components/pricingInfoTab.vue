<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='closeHandler'></qm-edit-tab>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import i18n from '@/lang/index'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: this.getApi()
        },
        apiData: {
          search: this.getApiData
        },
        topBar: [
          {
            name: 'update',
            iconName: '线性-制订',
            type: 'dialog',
            i18n: 'biz.btn.editRow',
            isShow: ['add', 'update', 'copy'],
            event: this.doUpdate,
            $refs: this.$refs,
            msg: 'biz.msg.chooseCurrency',
            component: () => import('@/views/frame/biz/spot/pricingRule/edit.vue'),
            validate(row) {
              if (!this.$refs.tab.$parent.$parent.$parent.$parent.editForm.currency) {
                return false
              } else {
                const billType = this.$refs.tab.$parent.param.billType
                const currency = this.$refs.tab.$parent.$parent.$parent.$parent.editForm.currency
                const contractNo = this.$refs.tab.$parent.$parent.$parent.$parent.editForm.contractNo
                row.currency = currency
                row.contractCode = contractNo
                switch (billType) {
                  case 'CON_PC_INFO':
                  case 'CON_PCC_INFO':
                  case 'DOM_CON_PC_INFO':
                  case 'DOM_CON_PCC_INFO':
                  case 'EXT_CON_PC_INFO':
                  case 'EXT_CON_PCC_INFO':
                  case 'pc':
                  case 'pcc':
                  case 'dpc':
                  case 'dpcc':
                  case 'epc':
                  case 'epcc':
                    row.purchaseOrSale = 'P'
                    break
                  case 'CON_PCC_INFO':
                  case 'CON_SCC_INFO':
                  case 'DOM_CON_SCC_INFO':
                  case 'EXT_CON_SCC_INFO':
                  case 'CON_DOMESTIC_PCC_INFO':
                  case 'CON_EXT_PCC_INFO':
                  case 'pcc':
                  case 'scc':
                  case 'dpcc':
                  case 'epcc':
                  case 'dscc':
                  case 'escc':
                    row.purchaseOrSale = 'S'
                    break
                }
                return true
              }
            }
          }
        ],
        table: {
          cols: [
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '180'
            },
            {
              label: 'spot.contractLot.form.pricingType',
              prop: 'pricingType',
              align: 'center',
              width: '90',
              format: {
                dict: this.$t('datadict.pricingType')
              }
            },
            {
              label: 'spot.contractLot.form.pricingQuantity',
              prop: 'pricingQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.measurementUnitCode',
              prop: 'valueUnit',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.contractLot.form.pricingBenchmark',
              prop: 'pricingBenchmark',
              width: '150',
              element: 'base-select',
              required: true,
              attrs: {
                data: 'DD_PRICE_ITEM',
                disabled: true
              }
            },
            {
              label: 'spot.contractLot.form.baseDate',
              prop: 'baseDate',
              width: '90',
              align: 'center',
              required: true,
              format: {
                dict: this.$t('datadict.baseDate')
              }
            },
            {
              label: 'spot.contractLot.form.pricingPeriod',
              prop: 'pricingPeriod',
              width: '90',
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
              label: 'spot.contractLot.form.premium',
              prop: 'premium',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  mounted() {
    // 复制的场合
    if (this.param.type === 'add' && this.param.contractNo !== undefined && this.param.contractNo !== null && this.param.contractNo !== '') {
      // 变更新增的场合
      const contractNo = this.param.contractNo
      request({
        url: '/api/pricingRule/listByContract',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            contractNo: contractNo,
            conBillType: this.getConBillType(),
            purchaseOrSale: this.getPurchaseSaleType()
          }
        }
      }).then(response => {
        if (response.data) {
          const tableData = this.$refs.tab.tableData
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].id = null
            tableData.push(response.data[i])
          }
        }
      })
    }
  },
  methods: {
    getApi() {
      switch (this.param.billType) {
        case 'CON_PC_INFO':
        case 'CON_SC_INFO':
        case 'DOM_CON_SC_INFO':
        case 'EXT_CON_SC_INFO':
        case 'CON_DOMESTIC_PC_INFO':
        case 'CON_EXT_PC_INFO':
        case 'pc':
        case 'sc':
        case 'dsc':
        case 'esc':
        case 'dpc':
        case 'epc':
          return '/api/pricingRule/listByContract'
        case 'CON_PCC_INFO':
        case 'CON_SCC_INFO':
        case 'DOM_CON_SCC_INFO':
        case 'EXT_CON_SCC_INFO':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'pcc':
        case 'scc':
        case 'dpcc':
        case 'epcc':
        case 'dscc':
        case 'escc':
          return '/api/pricingRuleChange/listByContractChange'
      }
    },
    getApiData(param) {
      let contractNo = param.contractNo
      let changeNo = param.changeNo
      switch (param.billType) {
        case 'CON_PC_INFO':
        case 'CON_SC_INFO':
        case 'DOM_CON_SC_INFO':
        case 'EXT_CON_SC_INFO':
        case 'CON_DOMESTIC_PC_INFO':
        case 'CON_EXT_PC_INFO':
        case 'pc':
        case 'sc':
        case 'dsc':
        case 'esc':
        case 'dpc':
        case 'epc':
          contractNo = param.contractNo || param.uk
          changeNo = null
          break
        case 'CON_PCC_INFO':
        case 'CON_SCC_INFO':
        case 'DOM_CON_SCC_INFO':
        case 'EXT_CON_SCC_INFO':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'pcc':
        case 'scc':
        case 'dpcc':
        case 'epcc':
        case 'dscc':
        case 'escc':
          contractNo = param.contractNo
          changeNo = param.changeNo || param.uk
          break
      }
      return {
        contractNo: contractNo,
        changeNo: changeNo,
        conBillType: this.getConBillType(),
        purchaseOrSale: this.getPurchaseSaleType()
      }
    },
    getPurchaseSaleType() {
      switch (this.param.billType) {
        case 'CON_PC_INFO':
        case 'CON_PCC_INFO':
        case 'DOM_CON_PC_INFO':
        case 'DOM_CON_PCC_INFO':
        case 'EXT_CON_PC_INFO':
        case 'EXT_CON_PCC_INFO':
        case 'pc':
        case 'pcc':
        case 'dpc':
        case 'dpcc':
        case 'epc':
        case 'epcc':
          return 'P'
        case 'CON_SC_INFO':
        case 'CON_SCC_INFO':
        case 'DOM_CON_SC_INFO':
        case 'DOM_CON_SCC_INFO':
        case 'EXT_CON_SC_INFO':
        case 'EXT_CON_SCC_INFO':
        case 'sc':
        case 'scc':
        case 'dsc':
        case 'esc':
        case 'dscc':
        case 'escc':
          return 'S'
      }
    },
    getConBillType() {
      switch (this.param.billType) {
        case 'CON_PC_INFO':
        case 'CON_PCC_INFO':
        case 'DOM_CON_PC_INFO':
        case 'DOM_CON_PCC_INFO':
        case 'EXT_CON_PC_INFO':
        case 'EXT_CON_PCC_INFO':
        case 'pc':
        case 'pcc':
        case 'dpc':
        case 'dpcc':
        case 'epc':
        case 'epcc':
          return 'CON_PC_INFO'
        case 'CON_SC_INFO':
        case 'CON_SCC_INFO':
        case 'DOM_CON_SC_INFO':
        case 'DOM_CON_SCC_INFO':
        case 'EXT_CON_SC_INFO':
        case 'EXT_CON_SCC_INFO':
        case 'sc':
        case 'scc':
        case 'dsc':
        case 'esc':
        case 'dscc':
        case 'escc':
          return 'CON_SC_INFO'
      }
    },
    closeHandler(data) {
      const currentRow = this.$refs.tab.currentRow
      Object.assign(currentRow, data)
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

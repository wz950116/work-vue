<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
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
          search(param) {
            if (param.uk) {
              return param.uk
            }
            switch (param.billType) {
              case 'CON_PC_INFO':
              case 'CON_SC_INFO':
              case 'pc':
              case 'sc':
              case 'DOM_CON_SC_INFO':
              case 'dsc':
              case 'EXT_CON_SC_INFO':
              case 'esc':
              case 'CON_DOMESTIC_PC_INFO':
              case 'CON_EXT_PC_INFO':
              case 'dpc':
              case 'epc':
                return param.contractNo
              case 'CON_PL_INFO':
              case 'CON_SL_INFO':
              case 'pl':
              case 'sl':
              case 'DOM_CON_SL_INFO':
              case 'dsl':
              case 'EXT_CON_SL_INFO':
              case 'esl':
              case 'CON_DOMESTIC_PL_INFO':
              case 'CON_EXT_PL_INFO':
              case 'dpl':
              case 'epl':
                return param.lotNo
              case 'CON_PCC_INFO':
              case 'CON_SCC_INFO':
              case 'CON_PLC_INFO':
              case 'CON_SLC_INFO':
              case 'pcc':
              case 'scc':
              case 'plc':
              case 'slc':
              case 'DOM_CON_SCC_INFO':
              case 'dscc':
              case 'EXT_CON_SCC_INFO':
              case 'escc':
              case 'DOM_CON_SLC_INFO':
              case 'dslc':
              case 'EXT_CON_SLC_INFO':
              case 'eslc':
              case 'CON_DOMESTIC_PCC_INFO':
              case 'CON_EXT_PCC_INFO':
              case 'dpcc':
              case 'epcc':
              case 'CON_DOMESTIC_PLC_INFO':
              case 'CON_EXT_PLC_INFO':
              case 'dplc':
              case 'eplc':
                return param.changeNo
            }
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update', 'copy'],
            event: this.doAddRow
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update', 'copy']
          }
        ],
        table: {
          cols: [
            {
              //预付款
              label: 'spot.contractLot.form.prepayFlag',
              prop: 'prepayFlag',
              element: 'el-checkbox',
              default: '0',
              align: 'center',
              width: '100',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              }
            },
            {
              label: 'spot.contractLot.form.paymentType',
              prop: 'paymentType',
              element: 'base-select',
              list:
                this.param.billType === 'EXT_CON_SC_INFO' ||
                  this.param.billType === 'esc' ||
                  this.param.billType === 'EXT_CON_SCC_INFO' ||
                  this.param.billType === 'escc' ||
                  this.param.billType === 'CON_EXT_PC_INFO' ||
                  this.param.billType === 'epc' ||
                  this.param.billType === 'CON_EXT_PCC_INFO' ||
                  this.param.billType === 'epcc' ||
                  this.param.billType === 'EXT_CON_SL_INFO' ||
                  this.param.billType === 'esl' ||
                  this.param.billType === 'EXT_CON_SLC_INFO' ||
                  this.param.billType === 'eslc' ||
                  this.param.billType === 'CON_EXT_PL_INFO' ||
                  this.param.billType === 'epl' ||
                  this.param.billType === 'CON_EXT_PLC_INFO' ||
                  this.param.billType === 'eplc'
                  ? this.$t('datadict.externalSettlementType')
                  : this.$t('datadict.settlementType'),
              required: true,
              attrs: {
                clearable: true
              }
            },
            {
              label: 'spot.contractLot.form.forwardDays',
              prop: 'forwardDays',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'num'
              }
            },
            {
              label: 'spot.contractLot.form.paymentLevel',
              prop: 'paymentLevel',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'percent'
              },
              event: this.changePaymentLevel
            },
            {
              //预付金额
              label: 'spot.contractLot.form.prepayAmount',
              prop: 'prepayAmount',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
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
    if (this.param.type === 'add' && this.param.lotNo !== undefined && this.param.lotNo !== null && this.param.lotNo !== '') {
      // 变更新增的场合
      const lotNo = this.param.lotNo
      let api = null
      switch (this.param.billType) {
        case 'CON_PLC_INFO':
        case 'plc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
          api = '/api/contract/plPaymentInfo/listByLotNo'
          break
        case 'CON_SLC_INFO':
        case 'slc':
        case 'DOM_CON_SLC_INFO':
        case 'dslc':
        case 'EXT_CON_SLC_INFO':
        case 'eslc':
          api = '/api/contract/slPaymentInfo/listByLotNo'
          break
      }
      request({
        url: api,
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: lotNo
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
    } else if (this.param.type === 'add' && this.param.contractNo !== undefined && this.param.contractNo !== null && this.param.contractNo !== '') {
      // 变更新增的场合
      const contractNo = this.param.contractNo
      let api = null
      switch (this.param.billType) {
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
          api = '/api/contract/pcPaymentInfo/listByContractNo'
          break
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          api = '/api/contract/scPaymentInfo/listByContractNo'
          break
      }
      request({
        url: api,
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: contractNo
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
        case 'pc':
        case 'CON_DOMESTIC_PC_INFO':
        case 'CON_EXT_PC_INFO':
        case 'dpc':
        case 'epc':
          return '/api/contract/pcPaymentInfo/listByContractNo'
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          return '/api/contract/pccPaymentInfo/listByChangeNo'
        case 'CON_PL_INFO':
        case 'pl':
        case 'CON_DOMESTIC_PL_INFO':
        case 'CON_EXT_PL_INFO':
        case 'dpl':
        case 'epl':
          return '/api/contract/plPaymentInfo/listByLotNo'
        case 'CON_PLC_INFO':
        case 'plc':
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
          return '/api/contract/plcPaymentInfo/listByChangeNo'
        case 'CON_SC_INFO':
        case 'sc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
          return '/api/contract/scPaymentInfo/listByContractNo'
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return '/api/contract/sccPaymentInfo/listByChangeNo'
        case 'CON_SL_INFO':
        case 'sl':
        case 'DOM_CON_SL_INFO':
        case 'dsl':
        case 'EXT_CON_SL_INFO':
        case 'esl':
          return '/api/contract/slPaymentInfo/listByLotNo'
        case 'CON_SLC_INFO':
        case 'slc':
        case 'DOM_CON_SLC_INFO':
        case 'dslc':
        case 'EXT_CON_SLC_INFO':
        case 'eslc':
          return '/api/contract/slcPaymentInfo/listByChangeNo'
      }
    },
    changePaymentLevel(rowData) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      const row = rowData.row
      const paymentLevel = toolUtil.toNum(rowData.val / 100)
      // 原币金额
      const originalAmount = toolUtil.toNum(this.$parent.$parent.$parent.editForm.originalAmount)
      if (originalAmount !== null && paymentLevel !== null) {
        row.prepayAmount = originalAmount * paymentLevel
      }
    },
    doAddRow() {
      const datalist = toolUtil.getDataTabFromSelf(this)
      // 原币金额
      const originalAmount = toolUtil.toNum(this.$parent.$parent.$parent.editForm.originalAmount)
      var prepayAmountMoney = 0
      if (originalAmount !== null) {
        prepayAmountMoney = originalAmount
      }
      datalist.push({
        paymentType: null,
        forwardDays: 0,
        paymentLevel: 100,
        prepayAmount: prepayAmountMoney
      })
    }
  }
}
</script>

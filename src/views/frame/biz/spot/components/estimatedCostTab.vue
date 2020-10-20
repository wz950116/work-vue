<template>
  <qm-edit-tab ref='tab' :tab='tab' @initCallback='initCallback'></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import selectData from '@/views/frame/biz/data/selectData/selectData.js'
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
              case 'CON_DOMESTIC_PL_INFO':
              case 'CON_EXT_PL_INFO':
              case 'dpl':
              case 'epl':
              case 'DOM_CON_SL_INFO':
              case 'dsl':
              case 'EXT_CON_SL_INFO':
              case 'esl':
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
              case 'CON_DOMESTIC_PCC_INFO':
              case 'CON_EXT_PCC_INFO':
              case 'dpcc':
              case 'epcc':
              case 'CON_DOMESTIC_PLC_INFO':
              case 'CON_EXT_PLC_INFO':
              case 'dplc':
              case 'eplc':
              case 'DOM_CON_SLC_INFO':
              case 'dslc':
              case 'EXT_CON_SLC_INFO':
              case 'eslc':
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
            validate: this.validateAdd
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
              label: 'spot.contractLot.form.settlementCode',
              prop: 'settlementCode',
              width: '210',
              element: 'base-select',
              required: true,
              attrs: {
                data: 'CUST_INFO',
                params: {
                  typeCode: '12',
                  usingFlag: '1',
                  auditStatus: '3'
                },
                clearable: true,
                filterable: true
              },
              event: this.changeSettlementCode
            },
            {
              label: 'spot.contractLot.form.feeDirection',
              prop: 'feeDirection',
              element: 'base-select',
              list: this.$t('datadict.feeDirection'),
              align: 'center',
              width: '120',
              required: true,
              attrs: {
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyyMMdd'
              }
            },
            {
              label: 'spot.contractLot.form.feeCode',
              prop: 'feeCode',
              width: '120',
              element: 'base-select',
              required: true,
              attrs: {
                canChangeList: true,
                data: 'DD_FEE_TYPE',
                clearable: true,
                params: {
                  usingFlag: '1'
                }
              },
              visibleChange: this.changeFeeCodeView,
              changeAll: this.changeFeeCode
            },
            {
              label: 'spot.contractLot.form.feeOccurs',
              prop: 'feeOccurs',
              element: 'base-select',
              list: this.param.billType === 'CON_PC_INFO' || this.param.billType === 'CON_PCC_INFO' || this.param.billType === 'CON_PL_INFO' || this.param.billType === 'CON_PLC_INFO' || this.param.billType === 'pc' || this.param.billType === 'pcc' || this.param.billType === 'pl' || this.param.billType === 'plc' ? this.$t('datadict.purchaseFeeOccurs') : this.$t('datadict.saleFeeOccurs'),
              align: 'center',
              width: '120',
              required: true,
              attrs: {
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyyMMdd'
              }
            },
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'spot.contractLot.form.quantity',
              prop: 'quantity',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight'
              },
              event: this.changeQuantity
            },
            {
              label: 'spot.contractLot.form.includeTaxPrice',
              prop: 'includeTaxPrice',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
              event: this.changeIncludeTaxPrice
            },
            {
              label: 'spot.contractLot.form.includeTaxAmount',
              prop: 'includeTaxAmount',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
              event: this.changeIncludeTaxAmount
            },
            {
              label: 'spot.contractLot.form.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.currencyCode',
              prop: 'currencyCode',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.contractLot.form.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'taxrate'
              },
              event: this.changeTaxRate
            },
            {
              label: 'spot.contractLot.form.taxAmount',
              prop: 'taxAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.costFlag',
              prop: 'costFlag',
              element: 'el-checkbox',
              align: 'center',
              width: '90',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              }
            },
            {
              label: 'spot.contractLot.form.intercourseFlag',
              prop: 'intercourseFlag',
              element: 'el-checkbox',
              align: 'center',
              width: '90',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
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
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          api = '/api/contract/plEstimatedCost/listByLotNo'
          break
        case 'CON_SLC_INFO':
        case 'slc':
        case 'DOM_CON_SLC_INFO':
        case 'dslc':
        case 'EXT_CON_SLC_INFO':
        case 'eslc':
          api = '/api/contract/slEstimatedCost/listByLotNo'
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
          const tableData = toolUtil.getDataTabFromSelf(this)
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
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          api = '/api/contract/pcEstimatedCost/listByContractNo'
          break
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          api = '/api/contract/scEstimatedCost/listByContractNo'
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
          const tableData = toolUtil.getDataTabFromSelf(this)
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
          return '/api/contract/pcEstimatedCost/listByContractNo'
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          return '/api/contract/pccEstimatedCost/listByChangeNo'
        case 'CON_SC_INFO':
        case 'sc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
          return '/api/contract/scEstimatedCost/listByContractNo'
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return '/api/contract/sccEstimatedCost/listByChangeNo'
        case 'CON_PL_INFO':
        case 'pl':
        case 'CON_DOMESTIC_PL_INFO':
        case 'CON_EXT_PL_INFO':
        case 'dpl':
        case 'epl':
          return '/api/contract/plEstimatedCost/listByLotNo'
        case 'CON_PLC_INFO':
        case 'plc':
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
          return '/api/contract/plcEstimatedCost/listByChangeNo'
        case 'CON_SL_INFO':
        case 'sl':
        case 'DOM_CON_SL_INFO':
        case 'dsl':
        case 'EXT_CON_SL_INFO':
        case 'esl':
          return '/api/contract/slEstimatedCost/listByLotNo'
        case 'CON_SLC_INFO':
        case 'slc':
        case 'DOM_CON_SLC_INFO':
        case 'dslc':
        case 'EXT_CON_SLC_INFO':
        case 'eslc':
          return '/api/contract/slcEstimatedCost/listByChangeNo'
      }
    },
    defaultAttr(attr) {
      return attr === '' || attr === null || attr === undefined ? '-' : attr
    },
    validateAdd() {
      const productDetailListRef = toolUtil.getRefTabFromTab(this, 'productDetailList')
      const productDtlRow = productDetailListRef.$children[0].currentRow
      if (productDtlRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.needChooseProduct') }))
        return false
      } else {
        const feeList = toolUtil.getDataTabFromSelf(this)
        feeList.push({
          productDetailNo: productDtlRow.productDetailNo,
          productCode: productDtlRow.productCode,
          productName: productDtlRow.productName,
          brand: productDtlRow.brand,
          spec: productDtlRow.spec,
          origin: productDtlRow.origin,
          productKeyAttr01: productDtlRow.productKeyAttr01,
          productKeyAttr02: productDtlRow.productKeyAttr02,
          productKeyAttr03: productDtlRow.productKeyAttr03,
          quantity: productDtlRow.productQuantity,
          costFlag: '1',
          intercourseFlag: '1'
        })
        return false
      }
    },
    changeFeeCode(rowData) {
      if (!this.checkEvent()) {
        return
      }
      const row = rowData.row
      const val = rowData.val
      const quantity = toolUtil.toNum(row.quantity)
      row.currencyCode = val.data.currency
      row.taxRate = toolUtil.toNum(val.data.rate)
      row.includeTaxPrice = toolUtil.toNum(val.data.defaultPrice)
      row.excludeTaxPrice = toolUtil.toNum(row.includeTaxPrice / (1 + row.taxRate / 100))
      row.includeTaxAmount = toolUtil.toNum(quantity * row.includeTaxPrice)
      row.excludeTaxAmount = toolUtil.toNum(quantity * row.excludeTaxPrice)
      row.taxAmount = toolUtil.toNum(row.includeTaxAmount - row.excludeTaxAmount)
    },
    changeQuantity(rowData) {
      if (!this.checkEvent()) {
        return
      }
      const row = rowData.row
      const quantity = toolUtil.toNum(rowData.val)
      const includeTaxPrice = toolUtil.toNum(row.includeTaxPrice)
      const excludeTaxPrice = toolUtil.toNum(row.excludeTaxPrice)
      row.includeTaxAmount = toolUtil.toNum(quantity * includeTaxPrice)
      row.excludeTaxAmount = toolUtil.toNum(quantity * excludeTaxPrice)
      row.taxAmount = toolUtil.toNum(row.includeTaxAmount - row.excludeTaxAmount)
    },
    changeIncludeTaxPrice(rowData) {
      if (!this.checkEvent()) {
        return
      }
      const row = rowData.row
      const quantity = toolUtil.toNum(row.quantity)
      const taxRate = toolUtil.toNum(row.taxRate)
      const includeTaxPrice = toolUtil.toNum(rowData.val)
      row.excludeTaxPrice = toolUtil.toNum(includeTaxPrice / (1 + taxRate / 100))
      row.includeTaxAmount = toolUtil.toNum(quantity * includeTaxPrice)
      row.excludeTaxAmount = toolUtil.toNum(quantity * row.excludeTaxPrice)
      row.taxAmount = toolUtil.toNum(row.includeTaxAmount - row.excludeTaxAmount)
    },
    changeIncludeTaxAmount(rowData) {
      if (!this.checkEvent()) {
        return
      }
      const row = rowData.row
      const quantity = toolUtil.toNum(row.quantity)
      const taxRate = toolUtil.toNum(row.taxRate)
      const includeTaxAmount = toolUtil.toNum(rowData.val)
      row.includeTaxPrice = toolUtil.toNum(includeTaxAmount / quantity)
      row.excludeTaxPrice = toolUtil.toNum(row.includeTaxPrice / (1 + taxRate / 100))
      row.excludeTaxAmount = toolUtil.toNum(quantity * row.excludeTaxPrice)
      row.taxAmount = toolUtil.toNum(includeTaxAmount - row.excludeTaxAmount)
    },
    changeTaxRate(rowData) {
      if (!this.checkEvent()) {
        return
      }
      const row = rowData.row
      const taxRate = toolUtil.toNum(rowData.val)
      const quantity = toolUtil.toNum(row.quantity)
      const includeTaxPrice = toolUtil.toNum(row.includeTaxPrice)
      row.excludeTaxPrice = toolUtil.toNum(includeTaxPrice / (1 + taxRate / 100))
      row.excludeTaxAmount = toolUtil.toNum(quantity * row.excludeTaxPrice)
      row.taxAmount = toolUtil.toNum(toolUtil.toNum(row.includeTaxAmount) - row.excludeTaxAmount)
    },
    changeSettlementCode(rowData) {
      if (!this.checkEvent()) {
        return
      }
      const row = rowData.row
      const settlementCode = rowData.val
      const editForm = toolUtil.getDataEditFromTab(this)
      const costList = toolUtil.getDataTabFromSelf(this)
      this.getFeeTypeList().then(feeTypeList => {
        let subList = feeTypeList
        if (Array.isArray(editForm.supplierCodeList)) {
          if (editForm.supplierCodeList.includes(settlementCode)) {
            subList = feeTypeList.filter(feeType => editForm.currency === feeType.data.currency)
          }
        }
        if (Array.isArray(editForm.customerCodeList)) {
          if (editForm.customerCodeList.includes(settlementCode)) {
            subList = feeTypeList.filter(feeType => editForm.currency === feeType.data.currency)
          }
        }
        row.list = subList
        let matchFeeTypeFlag = false
        for (let i = 0; i < subList.length; i++) {
          if (subList[i].code === row.feeCode) {
            matchFeeTypeFlag = true
            break
          }
        }
        if (!matchFeeTypeFlag) {
          row.feeCode = null
        }
        costList.push({})
        costList.pop()
      })
    },
    checkFeeType() {
      const editForm = toolUtil.getDataEditFromTab(this)
      const costList = toolUtil.getDataTabFromSelf(this)
      this.getFeeTypeList().then(feeTypeList => {
        costList.forEach(row => {
          const settlementCode = row.settlementCode
          let subList = feeTypeList
          if (Array.isArray(editForm.supplierCodeList)) {
            if (editForm.supplierCodeList.includes(settlementCode)) {
              subList = feeTypeList.filter(feeType => editForm.currency === feeType.data.currency)
            }
          }
          if (Array.isArray(editForm.customerCodeList)) {
            if (editForm.customerCodeList.includes(settlementCode)) {
              subList = feeTypeList.filter(feeType => editForm.currency === feeType.data.currency)
            }
          }
          row.list = subList
          let matchFeeTypeFlag = false
          for (let i = 0; i < subList.length; i++) {
            if (subList[i].code === row.feeCode) {
              matchFeeTypeFlag = true
              break
            }
          }
          if (!matchFeeTypeFlag) {
            row.feeCode = null
          }
        })
        costList.push({})
        costList.pop()
      })
    },
    getFeeTypeList() {
      const editForm = toolUtil.getDataEditFromTab(this)
      if (editForm.feeTypeList === undefined) {
        return new Promise((resolve, reject) => {
          selectData.listSelectData('DD_FEE_TYPE').then(dataList => {
            editForm.feeTypeList = dataList
            resolve(editForm.feeTypeList)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          selectData.listSelectData('DD_FEE_TYPE').then(dataList => {
            resolve(editForm.feeTypeList)
          })
        })
      }
    },
    changeFeeCodeView(rowData) {
      if (rowData.val) {
        const row = rowData.row
        const editForm = toolUtil.getDataEditFromTab(this)
        const settlementCode = row.settlementCode
        this.getFeeTypeList().then(feeTypeList => {
          let subList = feeTypeList
          if (Array.isArray(editForm.supplierCodeList)) {
            if (editForm.supplierCodeList.includes(settlementCode)) {
              subList = feeTypeList.filter(feeType => editForm.currency === feeType.data.currency)
            }
          }
          if (Array.isArray(editForm.customerCodeList)) {
            if (editForm.customerCodeList.includes(settlementCode)) {
              subList = feeTypeList.filter(feeType => editForm.currency === feeType.data.currency)
            }
          }
          row.list = subList
          let matchFeeTypeFlag = false
          for (let i = 0; i < subList.length; i++) {
            if (subList[i].code === row.feeCode) {
              matchFeeTypeFlag = true
              break
            }
          }
          if (!matchFeeTypeFlag) {
            row.feeCode = null
          }
        })
      }
    },
    initCallback(rowList) {
      this.getFeeTypeList().then(feeTypeList => {
        for (let i = 0; i < rowList.length; i++) {
          rowList[i].list = feeTypeList
        }
      })
    },
    checkEvent() {
      if (event) {
        if (event.srcElement.nodeName) {
          if (event.isEstimatedCostTab) {
            return false
          } else {
            event.isEstimatedCostTab = true
            return true
          }
        } else {
          return false
        }
      }
    }
  }
}
</script>

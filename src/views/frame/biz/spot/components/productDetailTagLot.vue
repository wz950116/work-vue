<template>
  <qm-edit-tab ref="tab" :tab="tab" @closeHandler="handleClose" @deleteRow="deleteRow"></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import contractUtil from '@/views/frame/biz/spot/util/contractUtil.js'
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
              case 'CON_PLC_INFO':
              case 'CON_SLC_INFO':
              case 'plc':
              case 'slc':
              case 'DOM_CON_SLC_INFO':
              case 'dslc':
              case 'EXT_CON_SLC_INFO':
              case 'eslc':
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
            type: 'dialog',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update', 'copy'],
            getParam() {
              return {}
            },
            component: () => import('./chooseProductByContractNo.vue'),
            validate: this.validateAdd,
            setDefault: this.setDefaultAdd
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update', 'copy']
          }
        ],
        table: {
          showSummary: true,
          height: 120,
          cols: [
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '180'
            },
            ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols),
            ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy' ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols),
            {
              label: 'spot.contractLot.form.pricingType',
              prop: 'pricingType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.pricingType')
              }
            },
            {
              label: 'spot.contractLot.form.estimatedPrice',
              prop: 'estimatedPrice',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                type: 'price'
              },
              userChange: this.changeEstimatedPrice
            },
            {
              label: 'spot.contractLot.form.premium',
              prop: 'premium',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                type: 'price'
              },
              userChange: this.changePremium
            },
            {
              label: 'spot.contractLot.form.productQuantity',
              prop: 'productQuantity',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                type: 'weight'
              },
              summary: true,
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.productUnitCode',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'spot.contractLot.form.measurementQuantity',
              prop: 'measurementQuantity',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                type: 'weight'
              },
              summary: true,
              format: {
                func: 'weight'
              },
              userChange: this.changeMeasurementQuantity
            },
            {
              label: 'spot.contractLot.form.measurementUnitCode',
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            // 原币金额
            {
              label: 'spot.contractLot.form.originalAmount',
              prop: 'originalAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              isShow: false
            },
            // 本币金额
            {
              label: 'spot.contractLot.form.localAmount',
              prop: 'localAmount',
              summary: true,
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              isShow: false
            },
            // 含税金额
            {
              label: 'spot.contractLot.form.taxedAmount',
              prop: 'taxedAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              isShow: false
            },
            // 税率
            {
              label: 'spot.contractLot.form.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: false,
              attrs: {
                min: 0,
                type: 'taxrate'
              },
              isShow: false,
              userChange: this.changeTaxRate
            },
            // 无税金额
            {
              label: 'spot.contractLot.form.taxFreeAmount',
              prop: 'taxFreeAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              isShow: false
            },
            // 税额
            {
              label: 'spot.contractLot.form.taxAmount',
              prop: 'taxAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              isShow: false
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
  created() {
    if (contractUtil.isExternal(this.param.billType)) {
      // 外贸
      this.getTableColDefByProp('originalAmount').isShow = true
      this.getTableColDefByProp('localAmount').isShow = true
    } else {
      // 内贸
      this.getTableColDefByProp('taxedAmount').isShow = true
      this.getTableColDefByProp('taxRate').isShow = true
      this.getTableColDefByProp('taxRate').required = true
      this.getTableColDefByProp('taxFreeAmount').isShow = true
      this.getTableColDefByProp('taxAmount').isShow = true
      // this.getTableColDefByProp('centsPoundPrice').isShow = true
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
          api = '/api/contract/plProductDetail/listByLotNo'
          break
        case 'CON_SLC_INFO':
        case 'slc':
        case 'DOM_CON_SLC_INFO':
        case 'dslc':
        case 'EXT_CON_SLC_INFO':
        case 'eslc':
          api = '/api/contract/slProductDetail/listByLotNo'
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
    }
  },
  methods: {
    getApi() {
      switch (this.param.billType) {
        case 'CON_PL_INFO':
        case 'pl':
        case 'CON_DOMESTIC_PL_INFO':
        case 'CON_EXT_PL_INFO':
        case 'dpl':
        case 'epl':
          return '/api/contract/plProductDetail/listByLotNo'
        case 'CON_PLC_INFO':
        case 'plc':
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
          return '/api/contract/plcProductDetail/listByChangeNo'
        case 'CON_SL_INFO':
        case 'sl':
        case 'DOM_CON_SL_INFO':
        case 'dsl':
        case 'EXT_CON_SL_INFO':
        case 'esl':
          return '/api/contract/slProductDetail/listByLotNo'
        case 'CON_SLC_INFO':
        case 'slc':
        case 'DOM_CON_SLC_INFO':
        case 'dslc':
        case 'EXT_CON_SLC_INFO':
        case 'eslc':
          return '/api/contract/slcProductDetail/listByChangeNo'
      }
    },
    getPurchaseSaleType() {
      switch (this.param.billType) {
        case 'CON_PL_INFO':
        case 'CON_PLC_INFO':
        case 'pl':
        case 'plc':
        case 'CON_DOMESTIC_PL_INFO':
        case 'CON_EXT_PL_INFO':
        case 'dpl':
        case 'epl':
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
          return 'P'
        case 'CON_SL_INFO':
        case 'CON_SLC_INFO':
        case 'sl':
        case 'slc':
        case 'DOM_CON_SL_INFO':
        case 'dsl':
        case 'EXT_CON_SL_INFO':
        case 'esl':
        case 'DOM_CON_SLC_INFO':
        case 'dslc':
        case 'EXT_CON_SLC_INFO':
        case 'eslc':
          return 'S'
      }
    },
    getTableColDefByProp(prop) {
      const cols = this.tab.table.cols
      for (let i = 0; i < cols.length; i++) {
        if (cols[i].prop === prop) {
          return cols[i]
        }
      }
    },
    calcAmount() {
      contractUtil.tabCalcAmount(this)
    },
    handleClose(params) {
      const editForm = this.$parent.editForm
      const feeList = this.$parent.$refs.feeList[0].$refs.tab.tableData
      const exchangeRate = toolUtil.toNum(editForm.exchangeRate)

      params.forEach((row, index) => {
        let _index = 0
        if (this.$refs.tab.rowOpenNum === null) {
          this.$refs.tab.tableData.push({})
          _index = this.$refs.tab.tableData.length - 1
        } else {
          _index = this.$refs.tab.rowOpenNum[index]
        }
        row.productQuantity = row.rmnPrdQty
        row.measurementQuantity = row.rmnMemQty
        row.contractProductDetailNo = row.productDetailNo
        row.productDetailNo = 'TEMP-' + toolUtil.uuid()

        row.originalAmount = null
        row.taxFreeAmount = null
        row.taxAmount = null
        row.taxedAmount = null
        row.localAmount = null

        const measurementQuantity = toolUtil.toNum(row.measurementQuantity)
        let estimatedPrice = toolUtil.toNum(row.estimatedPrice)
        if (estimatedPrice !== null) {
          estimatedPrice = estimatedPrice + toolUtil.toNum(row.premium)
        }
        if (measurementQuantity !== null && estimatedPrice !== null) {
          row.originalAmount = measurementQuantity * estimatedPrice
          if (exchangeRate !== null) {
            row.localAmount = row.originalAmount * exchangeRate
            row.taxedAmount = row.localAmount
            const taxRate = toolUtil.toNum(row.taxRate)
            if (taxRate !== null) {
              row.taxFreeAmount = row.taxedAmount / (1 + taxRate / 100)
              row.taxAmount = row.taxedAmount - row.taxFreeAmount
            }
          }
        }

        Object.assign(this.$refs.tab.tableData[_index], row)
        if (Array.isArray(row.feeList)) {
          const prdFeeList = row.feeList
          for (let j = 0; j < prdFeeList.length; j++) {
            const prdFee = prdFeeList[j]
            prdFee.productDetailNo = row.productDetailNo
            feeList.push(prdFee)
          }
        }
      })
    },
    deleteRow(row) {
      this.calcAmount()
      const feeList = this.$parent.$refs.feeList[0].$refs.tab.tableData
      if (feeList) {
        const tempArray = feeList.filter(subRow => {
          return row.productDetailNo !== subRow.productDetailNo
        })
        feeList.splice(0)
        tempArray.forEach(subRow => {
          feeList.push(subRow)
        })
      }

      // 保证金约定
      const marginRuleTable = toolUtil.getDataTabFromTab(this, 'marginRuleList')
      if (marginRuleTable) {
        const tableData = this.$refs.tab.tableData
        const productMap = new Map()
        for (let i = 0; i < tableData.length; i++) {
          productMap.set(tableData[i].productCode, tableData[i].productName)
        }
        const tempTable = []
        for (let i = 0; i < marginRuleTable.length; i++) {
          if (productMap.has(marginRuleTable[i].productCode)) {
            tempTable.push(marginRuleTable[i])
          }
        }
        if (tempTable.length < marginRuleTable.length) {
          marginRuleTable.splice(0)
          for (let i = 0; i < tempTable.length; i++) {
            marginRuleTable.push(tempTable[i])
          }
        }
      }
    },
    changeMeasurementQuantity(rowData) {
      this.calcAmount()
    },
    changeEstimatedPrice(rowData) {
      this.calcAmount()
    },
    changeTaxRate(rowData) {
      this.calcAmount()
    },
    validateAdd() {
      const editForm = this.$parent.editForm
      if (editForm.contractNo === null || editForm.contractNo === '' || editForm.contractNo === undefined) {
        this.$notify(notifyInfo({ msg: this.$t('请先选择合同') }))
        return false
      }
      return true
    },
    setDefaultAdd() {
      const editForm = this.$parent.editForm
      this.$refs.tab.$refs.viewFormTab.$refs.qmDialogTable.listQuery.data.contractNo = editForm.contractNo
      this.$refs.tab.$refs.viewFormTab.$refs.qmDialogTable.getList()
    },
    changePremium(rowData) {
      this.calcAmount()
    }
  }
}
</script>

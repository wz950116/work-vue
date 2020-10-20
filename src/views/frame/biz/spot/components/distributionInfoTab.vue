<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='closeHandler'></qm-edit-tab>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
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
            let contractNo = param.contractNo
            let changeNo = param.changeNo
            let purchaseOrSale = null
            switch (param.billType) {
              case 'CON_SC_INFO':
              case 'sc':
              case 'DOM_CON_SC_INFO':
              case 'dsc':
              case 'EXT_CON_SC_INFO':
              case 'esc':
                contractNo = param.contractNo || param.uk
                changeNo = null
                purchaseOrSale = 'S'
                break
              case 'CON_SCC_INFO':
              case 'scc':
              case 'DOM_CON_SCC_INFO':
              case 'dscc':
              case 'EXT_CON_SCC_INFO':
              case 'escc':
                contractNo = param.contractNo
                changeNo = param.changeNo || param.uk
                purchaseOrSale = 'S'
                break
            }
            return {
              contractNo: contractNo,
              changeNo: changeNo,
              purchaseOrSale: purchaseOrSale
            }
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            type: 'dialog',
            i18n: '期货合同',
            isShow: ['add', 'update', 'copy'],
            component: () => import('./chooseFutures.vue'),
            validate: this.validateAdd,
            callback: e => this.handleCallback(e, '2'),
            initChoose: this.initContractChoose
          },
          {
            name: 'add',
            iconName: '线性-增行',
            type: 'dialog',
            i18n: '现货库存',
            isShow: ['add', 'update', 'copy'],
            component: () => import('./chooseStorage.vue'),
            validate: this.validateAdd,
            callback: e => this.handleCallback(e, '3'),
            initChoose: this.initContractChoose
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
              label: 'spot.contractLot.form.whSource',
              prop: 'whSource',
              width: '100',
              format: {
                dict: this.$t('datadict.distributionSrc')
              }
            },
            {
              label: 'spot.contractLot.form.docuentNo',
              prop: 'documentNo',
              width: '150'
            },
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
              label: 'spot.contractLot.form.whType',
              prop: 'whType',
              width: '100',
              format: {
                dict: this.$t('datadict.distributionSrc')
              }
            },
            {
              label: 'spot.contractLot.form.warehouseName',
              prop: 'warehouseName',
              width: '120'
            },
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '120'
            },
            ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols),
            ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy' ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols),
            {
              label: 'spot.contractLot.form.storageQuantity',
              prop: 'inQuantity',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight'
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
              label: 'spot.contractLot.form.storageMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight'
              }
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
            {
              label: 'spot.contractLot.form.remark',
              prop: 'remark',
              width: '120',
              element: 'input-validate'
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
    },
    editForm: {
      type: Object,
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
        url: '/api/contract/whSaleContract/listByContract',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            contractNo: contractNo,
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
    handleCallback(params, whType) {
      const product = this.$parent.$parent.$parent.$refs.productDetailList[0].$refs.tab.currentRow
      const productDetailIds = []
      this.$refs.tab.tableData.forEach(param => productDetailIds.push(param.documentProductDetailNo))
      params.forEach(param => {
        const obj = {}
        if (productDetailIds.includes(param.productDetailNo)) {
          return
        }
        obj.whSource = this.editForm.whType
        obj.documentProductDetailNo = param.productDetailNo
        obj.documentNo = param.contractNo
        obj.productDetailNo = product.productDetailNo
        obj.whType = whType
        obj.pricingType = param.pricingType
        obj.warehouseCode = param.warehouseCode
        obj.warehouseName = param.warehouseName
        obj.productCode = param.productCode
        obj.productName = param.productName
        obj.brand = param.brand
        obj.spec = param.spec
        obj.origin = param.origin
        obj.productKeyAttr01 = param.productKeyAttr01
        obj.productKeyAttr02 = param.productKeyAttr02
        obj.productKeyAttr03 = param.productKeyAttr03
        obj.productReservedNum1 = param.productReservedNum1
        obj.productReservedNum2 = param.productReservedNum2
        obj.productReservedNum3 = param.productReservedNum3
        obj.productReservedNum4 = param.productReservedNum4
        obj.productReservedNum5 = param.productReservedNum5
        obj.productReservedNum6 = param.productReservedNum6
        obj.productReservedNum7 = param.productReservedNum7
        obj.productReservedNum8 = param.productReservedNum8
        obj.productReservedStr1 = param.productReservedStr1
        obj.productReservedStr2 = param.productReservedStr2
        obj.productReservedStr3 = param.productReservedStr3
        obj.productReservedStr4 = param.productReservedStr4
        obj.productReservedStr5 = param.productReservedStr5
        obj.productReservedStr6 = param.productReservedStr6
        obj.productReservedStr7 = param.productReservedStr7
        obj.productReservedStr8 = param.productReservedStr8
        obj.productReservedStr9 = param.productReservedStr9
        obj.productReservedStr10 = param.productReservedStr10
        obj.productReservedStr11 = param.productReservedStr11
        obj.productReservedStr12 = param.productReservedStr12
        obj.allProductQuantity = param.allProductQuantity
        obj.inQuantity = param.productQuantity
        obj.productUnitCode = param.productUnitCode
        obj.allMeasurementQuantity = param.allMeasurementQuantity
        obj.measurementQuantity = param.measurementQuantity
        obj.measurementUnitCode = param.measurementUnitCode
        this.$refs.tab.tableData.push(obj)
        if (whType === '2') {
          this.addRelated(param, product.productDetailNo)
        }
      })
    },
    addRelated(row, productDetailNo) {
      const newRow = {}
      newRow.relatedContractNo = row.contractNo
      newRow.productDetailNo = productDetailNo
      newRow.relatedProductDetailNo = row.productDetailNo
      newRow.productCode = row.productCode
      newRow.productName = row.productName
      newRow.brand = row.brand
      newRow.spec = row.spec
      newRow.origin = row.origin
      newRow.productKeyAttr01 = row.productKeyAttr01
      newRow.productKeyAttr02 = row.productKeyAttr02
      newRow.productKeyAttr03 = row.productKeyAttr03
      newRow.productQuantity = row.productQuantity
      newRow.measurementQuantity = row.measurementQuantity
      this.$parent.$parent.$parent.$refs.relatedList[0].$refs.tab.tableData.push(newRow)
    },
    validateAdd() {
      const productDtlRow = this.$parent.$parent.$parent.$refs.productDetailList[0].$refs.tab.currentRow
      if (productDtlRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.needChooseProduct') }))
        return false
      }
      return true
    },
    initContractChoose() {
      const productDtlRow = this.$parent.$parent.$parent.$refs.productDetailList[0].$refs.tab.currentRow
      return {
        hasRmnFlg: {
          value: '0'
        },
        productCode: {
          value: productDtlRow.productCode,
          disabled: true
        },
        brand: {
          value: productDtlRow.brand
        },
        spec: {
          value: productDtlRow.spec
        },
        origin: {
          value: productDtlRow.origin
        },
        productKeyAttr01: {
          value: productDtlRow.productKeyAttr01
        },
        productKeyAttr02: {
          value: productDtlRow.productKeyAttr02
        },
        productKeyAttr03: {
          value: productDtlRow.productKeyAttr03
        }
      }
    },
    getApi() {
      switch (this.param.billType) {
        case 'CON_SC_INFO':
        case 'sc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
          return '/api/contract/whSaleContract/listByContract'
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return '/api/contract/whSaleContractChange/listByChangeNo'
      }
    },
    getPurchaseSaleType() {
      switch (this.param.billType) {
        case 'CON_PC_INFO':
        case 'CON_PCC_INFO':
        case 'pc':
        case 'pcc':
          return 'P'
        case 'CON_SC_INFO':
        case 'CON_SCC_INFO':
        case 'sc':
        case 'scc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return 'S'
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

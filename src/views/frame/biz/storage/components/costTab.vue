<template>
  <qm-edit-tab ref='tab' :tab='tab' @initCallback='handleInitCallback'></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
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
              case 'WH_IN_BILL':
                return param.inBillNo
              case 'WH_IN_CHECK':
                return param.outBillNo
              // case 'ladingBill': return param.id
              // case 'ladingOut': return param.id
              // case 'transfer': return param.id
              // case 'inReturn': return param.id
              // case 'outReturn': return param.id
              default:
                return param.id
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
              label: 'storage.cost.list.settlementCode',
              prop: 'settlementCode',
              width: '210',
              element: 'base-select',
              required: true,
              attrs: {
                data: 'CUST_INFO',
                params: {
                  // typeCode: '12',
                  usingFlag: '1',
                  auditStatus: '3'
                },
                disabled: this.$route.params.type === 'complete',
                clearable: true,
                filterable: true
              },
              event: this.onSettlementCodeChange
            },
            {
              label: 'storage.cost.list.feeDirection',
              prop: 'feeDirection',
              element: 'base-select',
              list: this.$t('datadict.feeDirection'),
              align: 'center',
              width: '120',
              required: true,
              attrs: {
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyyMMdd',
                disabled: this.$route.params.type === 'complete'
              },
              event: this.onFeeDirectionChange
            },
            {
              label: 'storage.cost.list.feeCode',
              prop: 'feeCode',
              width: '120',
              element: 'base-select',
              required: true,
              attrs: {
                canChangeList: true,
                data: 'DD_FEE_TYPE',
                params: {
                  usingFlag: '1'
                },
                disabled: this.$route.params.type === 'complete',
                clearable: false
              },
              event: this.onFeeCodeChange,
              changeAll: this.onFeeCodeChangeAll
            },
            {
              label: 'storage.cost.list.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'storage.cost.list.quantity',
              prop: 'quantity',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight',
                disabled: this.$route.params.type === 'complete'
              },
              event: this.onQuantityChange
            },
            {
              label: 'storage.cost.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'price',
                disabled: this.$route.params.type === 'complete'
              },
              event: this.onIncludeTaxPriceChange
            },
            {
              label: 'storage.cost.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'storage.cost.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'price'
              }
            },
            {
              label: 'storage.cost.list.excludeTaxAmount',
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
              label: 'storage.cost.list.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'taxrate',
                disabled: this.$route.params.type === 'complete'
              },
              event: this.onTaxRateChange
            },
            {
              label: 'storage.cost.list.taxAmount',
              prop: 'taxAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'storage.cost.list.costFlag',
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
              label: 'storage.cost.list.intercourseFlag',
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
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    'editForm.supplierCode'(value) {
      // 防止TAB初始化时，edit的get请求返回迟导致无法获取supplierCode
      this.handleInitCallback()
    },
    'editForm.customerCode'(value) {
      // 防止TAB初始化时，edit的get请求返回迟导致无法获取customerCode
      this.handleInitCallback()
    }
  },
  methods: {
    handleInitCallback() {
      this.resetFeeCodeOptions()
    },
    getApi() {
      switch (this.param.billType) {
        case 'WH_LADING_BILL':
          return '/api/warehouse/whLadingBillCost/list'
        case 'WH_LADING_BILL_OUT':
          return '/api/warehouse/whLadingOutCost/list'
        case 'WH_IN_BILL':
          return '/api/warehouse/whInBillCost/list'
        case 'WH_OUT_BILL':
          return '/api/warehouse/whOutBillCost/list'
        case 'WH_TRANSFER_IN':
          return '/api/warehouse/whTransferInCost/list'
        case 'WH_IN_RETURN':
          return '/api/warehouse/whInReturnCost/list'
        case 'WH_OUT_RETURN':
          return '/api/warehouse/whOutReturnCost/list'
      }
    },
    validateAdd() {
      let productRow = null
      var quantity = null
      switch (this.param.billType) {
        case 'WH_LADING_BILL':
          productRow = this.$parent.$parent.$refs.qmRouteEdit.$refs['whLadingBillProductDtoList']['0'].$refs.tab.currentRow
          quantity = productRow ? productRow.ladingQuantity : null
          break
        case 'WH_LADING_BILL_OUT':
          productRow = this.$parent.$parent.$parent.$refs['whLadingOutProductDtoList'][0].$refs.tab.currentRow
          quantity = productRow ? productRow.outQuantity : null
          break
        case 'WH_IN_BILL':
          productRow = this.$parent.$parent.$refs.qmRouteEdit.$refs['inProductList']['0'].$refs.tab.currentRow
          quantity = productRow ? productRow.inQuantity : null
          break
        case 'WH_OUT_BILL':
          productRow = this.$parent.$parent.$parent.$refs['outProductList'][0].$refs.tab.currentRow
          quantity = productRow ? productRow.outQuantity : null
          break
        case 'WH_TRANSFER_IN':
          productRow = this.$parent.$parent.$refs.qmRouteEdit.$refs['whTransferInProductDtoList']['0'].$refs.tab.currentRow
          quantity = productRow ? productRow.transferQuantity : null
          break
        case 'WH_IN_RETURN':
          productRow = this.$parent.$parent.$refs.qmRouteEdit.$refs['whInReturnProductDtoList']['0'].$refs.tab.currentRow
          quantity = productRow ? productRow.outQuantity : null
          break
        case 'WH_OUT_RETURN':
          productRow = this.$parent.$parent.$refs.qmRouteEdit.$refs['whOutReturnProductDtoList']['0'].$refs.tab.currentRow
          quantity = productRow ? productRow.inQuantity : null
          break
      }

      if (productRow === null) {
        // 请选择一条商品信息
        this.$notify(notifyInfo({ msg: this.$t('storage.cost.validateMsg.needChooseProduct') }))
        return false
      } else {
        const row = {
          stockDetailNo: productRow.stockDetailNo,
          lotProductDetailCode: productRow.lotProductDetailCode,
          preBillProductDetailCode: productRow.preBillProductDetailCode,
          // 出库商品编号（销售退货时有值）
          outProductNo: productRow.outProductNo,
          productCode: productRow.productCode,
          productName: productRow.productName,
          brand: productRow.brand,
          spec: productRow.spec,
          origin: productRow.origin,
          productKeyAttr01: productRow.productKeyAttr01,
          productKeyAttr02: productRow.productKeyAttr02,
          productKeyAttr03: productRow.productKeyAttr03,
          quantity: quantity,
          costFlag: '1',
          intercourseFlag: '1',
          list: []
        }
        this.$refs.tab.tableData.push(row)
        // 初始化费用名称下拉数据
        this.listByBaseCurrencyRequest(row)

        return false
      }
    },
    // 费用名称下拉筛选接口
    listByCurrencyRequest(row) {
      request({
        url: '/api/data/ddFeeType/listByCurrency',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.editForm.currencyCode
        }
      }).then(response => {
        row.list = response.data
      })
    },
    // 费用名称基础档案接口
    listByBaseCurrencyRequest(row) {
      request({
        url: '/api/dd/selectData/list',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            type: 'DD_FEE_TYPE',
            queryParams: {
              usingFlag: '1'
            }
          }
        }
      }).then(response => {
        row.list = response.data
      })
    },
    // 结算单位选择
    onSettlementCodeChange(param) {
      this.resetFeeCodeOptions()
    },
    onFeeDirectionChange(param) {
      // this.getLotFee(param)
    },
    onFeeCodeChange(param) {
      // this.getLotFee(param)
    },
    onFeeCodeChangeAll(param) {
      const row = param.row
      const val = param.val
      row.currencyCode = val.data.currency
      row.taxRate = val.data.rate
      row.includeTaxPrice = val.data.defaultPrice
    },
    getLotFee(param) {
      if (!this.editForm.lotNo) {
        return
      }
      const row = param.row
      const productDetailNo = row.lotProductDetailCode
      const settlementCode = row.settlementCode
      const feeDirection = row.feeDirection
      const feeCode = row.feeCode
      if (productDetailNo && settlementCode && feeDirection && feeCode) {
        let api = null
        switch (this.param.billType) {
          case 'WH_LADING_BILL_OUT':
            api = '/api/contract/slEstimatedCost/list'
            break
          case 'WH_IN_BILL':
            api = '/api/contract/plEstimatedCost/list'
            break
          case 'WH_OUT_BILL':
            api = '/api/contract/slEstimatedCost/list'
            break
        }

        request({
          url: api,
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              lotNo: this.editForm.lotNo,
              productDetailNo: productDetailNo,
              settlementCode: settlementCode,
              feeDirection: feeDirection,
              feeCode: feeCode,
              feeOccurs: this.param.billType
            }
          }
        }).then(response => {
          if (response.data && response.data.length > 0) {
            row.quantity = response.data[0].quantity
            row.includeTaxPrice = response.data[0].includeTaxPrice
            row.includeTaxAmount = response.data[0].includeTaxAmount
            row.excludeTaxPrice = response.data[0].excludeTaxPrice
            row.excludeTaxAmount = response.data[0].excludeTaxAmount
            row.currencyCode = response.data[0].currencyCode
            row.taxRate = response.data[0].taxRate
            row.taxAmount = response.data[0].taxAmount
          }
        })
      }
    },
    onQuantityChange(param) {
      const row = param.row
      const quantity = toolUtil.toDecimal(param.val)
      const includeTaxPrice = toolUtil.toDecimal(row.includeTaxPrice)
      const taxRate = toolUtil.toDecimal(row.taxRate)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    onIncludeTaxPriceChange(param) {
      const row = param.row
      const quantity = toolUtil.toDecimal(row.quantity)
      const includeTaxPrice = toolUtil.toDecimal(param.val)
      const taxRate = toolUtil.toDecimal(row.taxRate)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    onTaxRateChange(param) {
      const row = param.row
      const quantity = toolUtil.toDecimal(row.quantity)
      const includeTaxPrice = toolUtil.toDecimal(row.includeTaxPrice)
      const taxRate = toolUtil.toDecimal(param.val)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    calculate(row, quantity, includeTaxPrice, taxRate) {
      row.includeTaxAmount = quantity.mul(includeTaxPrice)
      row.excludeTaxPrice = includeTaxPrice.div(taxRate.div(100).add(1)).toFixed(6)
      row.excludeTaxAmount = row.includeTaxAmount.div(taxRate.div(100).add(1)).toFixed(2)
      row.taxAmount = row.includeTaxAmount.sub(row.excludeTaxAmount)
    },
    resetFeeCodeOptions() {
      let formData = null
      switch (this.param.billType) {
        case 'WH_LADING_BILL':
          formData = this.$parent.edit.formData
          break
        case 'WH_LADING_BILL_OUT':
          formData = this.$parent.$parent.$parent.edit.formData
          break
        case 'WH_IN_BILL':
          formData = this.$parent.edit.formData
          break
        case 'WH_OUT_BILL':
          formData = this.$parent.$parent.$parent.edit.formData
          break
        case 'WH_TRANSFER_IN':
          formData = this.$parent.edit.formData
          break
        case 'WH_IN_RETURN':
          formData = this.$parent.edit.formData
          break
        case 'WH_OUT_RETURN':
          formData = this.$parent.edit.formData
          break
      }

      const custPropList = ['supplierCode', 'customerCode']
      let custCodeList = []
      formData.part1.content.forEach(info => {
        if (custPropList.includes(info.prop)) {
          custCodeList = info.list.map(v => v.code)
          return
        }
      })

      const tableData = this.$refs.tab.tableData
      tableData.forEach(row => {
        if (custCodeList.includes(row.settlementCode) && this.editForm.lotNo) {
          this.listByCurrencyRequest(row)
        } else {
          this.listByBaseCurrencyRequest(row)
        }
      })
    }
  }
}
</script>

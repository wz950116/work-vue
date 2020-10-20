<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleCloseDialog' @deleteRow='handleDelete'></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        editForm: this.editForm,
        api: {
          search: '/api/invoice/domApplyDetail/listByApplyNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            isShow: ['add', 'update'],
            type: 'dialog',
            i18n: 'biz.btn.selectOutProductInfo',
            component: () => import('@/views/frame/biz/storage/dialog/chooseOutProduct.vue'),
            validate: this.validateAdd,
            initChoose: this.initChooseAdd
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.deleteRow'
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.copy'
          }
        ],
        table: {
          height: 300,
          cols: [
            // 合同号
            {
              label: 'invoice.domesticInvoiceApply.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left'
            },
            // 出库单号
            {
              label: 'invoice.domesticInvoiceApply.list.outNoticeNo',
              prop: 'relateBillNo',
              width: 200,
              align: 'left'
            },
            // 商品
            {
              label: 'invoice.domesticInvoiceApply.list.productName',
              prop: 'productName',
              width: 100,
              align: 'left'
            },
            // 物资属性
            ...this.$store.state.user.mainGoodCols,
            // 发票名称
            {
              label: 'invoice.domesticInvoiceApply.list.invoiceName',
              prop: 'invoiceName',
              element: 'input-validate',
              attrs: {
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'left',
              required: true
            },
            // 申请数量
            {
              label: 'invoice.domesticInvoiceApply.list.applyQuantity',
              prop: 'applyQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onApplyQuantityChange
            },
            // 含税价格
            {
              label: 'invoice.domesticInvoiceApply.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onIncludeTaxPriceChange
            },
            // 含税金额
            {
              label: 'invoice.domesticInvoiceApply.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 税率
            {
              label: 'invoice.domesticInvoiceApply.list.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              attrs: {
                type: 'taxrate',
                disabled: false,
                clearable: true
              },
              width: 100,
              align: 'right',
              required: true,
              event: this.onTaxRateChange
            },
            // 税额
            {
              label: 'invoice.domesticInvoiceApply.list.taxAmount',
              prop: 'taxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 不含税价格
            {
              label: 'invoice.domesticInvoiceApply.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              element: 'input-formatter',
              attrs: {
                type: 'exprice',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 不含税金额
            {
              label: 'invoice.domesticInvoiceApply.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 备注
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              element: 'el-input',
              attrs: {
                maxlength: 100,
                clearable: true
              },
              'min-width': 200
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
  methods: {
    // 点击增行验证
    validateAdd() {
      if (!this.editForm.customerNo) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('invoice.domesticInvoiceApply.form.customerNo') }))
        return false
      }
      if (!this.editForm.bizOrganCode) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.pleaseSelect') + this.$t('biz.lbl.bizOrganName') }))
        return false
      }
      return true
    },
    // 点击增行弹窗初始化
    initChooseAdd() {
      return {
        initSearch: true,
        multiple: true,
        customerCode: {
          disabled: true,
          value: this.editForm.customerNo
        },
        bizOrganCode: {
          disabled: true,
          value: this.editForm.bizOrganCode
        }
      }
    },
    // 增行弹窗关闭
    handleCloseDialog(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['contractNo'] = row.contractNo
        this.$refs.tab.tableData[_index]['lotNo'] = row.lotNo
        this.$refs.tab.tableData[_index]['lotDetailNo'] = row.lotProductDetailCode
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['invoiceName'] = row.productName
        this.$refs.tab.tableData[_index]['applyQuantity'] = row.unApplyQuantity
        this.$refs.tab.tableData[_index]['excludeTaxPrice'] = ''
        this.$refs.tab.tableData[_index]['excludeTaxAmount'] = ''
        this.$refs.tab.tableData[_index]['taxRate'] = row.taxRate
        this.$refs.tab.tableData[_index]['taxAmount'] = ''
        this.$refs.tab.tableData[_index]['includeTaxPrice'] = row.includeTaxPrice
        this.$refs.tab.tableData[_index]['includeTaxAmount'] = ''
        this.$refs.tab.tableData[_index]['remark'] = ''
        this.$refs.tab.tableData[_index]['relateBillNo'] = row.outBillNo
        this.$refs.tab.tableData[_index]['relateBillDetailNo'] = row.outProductNo
        this.$refs.tab.tableData[_index]['relateBillType'] = 'WH_OUT_PRODUCT'
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.lotNo + v.lotDetailNo
            })
            .includes(row.lotNo + row.lotDetailNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 删行触发事件
    handleDelete() {
      this.sumApplyAmount()
    },
    // 申请数量change事件
    onApplyQuantityChange(param) {
      const row = param.row
      // 数量修改影响含税金额、税额、不含税金额、不含税单价
      row.includeTaxAmount = (Number(row.includeTaxPrice) * Number(row.applyQuantity)).toFixed(2)
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.applyQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.applyQuantity)).toFixed(6)
      } else {
        row.excludeTaxPrice = '0'
      }
      this.sumApplyAmount()
    },
    // 含税单价change事件
    onIncludeTaxPriceChange(param) {
      const row = param.row
      // 含税单价修改，影响含税金额、税额、不含税金额、不含税单价
      row.includeTaxAmount = (Number(row.includeTaxPrice) * Number(row.applyQuantity)).toFixed(2)
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.applyQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.applyQuantity)).toFixed(6)
      } else {
        row.excludeTaxPrice = '0'
      }
      this.sumApplyAmount()
    },
    // 税率change事件
    onTaxRateChange(param) {
      const row = param.row
      // 税率修改，影响税额、不含税金额、不含税单价
      row.excludeTaxAmount = (Number(row.includeTaxAmount) / (1 + Number(row.taxRate) / 100)).toFixed(2)
      row.taxAmount = (Number(row.includeTaxAmount) - Number(row.excludeTaxAmount)).toFixed(2)
      if (Number(row.applyQuantity) !== 0) {
        row.excludeTaxPrice = (Number(row.excludeTaxAmount) / Number(row.applyQuantity)).toFixed(2)
      } else {
        row.excludeTaxPrice = '0'
      }
      this.sumApplyAmount()
    },
    // 计算合计信息
    sumApplyAmount() {
      var excludeTaxAmount = 0
      var taxAmount = 0
      var includeTaxAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        excludeTaxAmount = (Number(excludeTaxAmount) + Number(row.excludeTaxAmount)).toFixed(2)
        taxAmount = (Number(taxAmount) + Number(row.taxAmount)).toFixed(2)
        includeTaxAmount = (Number(includeTaxAmount) + Number(row.includeTaxAmount)).toFixed(2)
      })
      this.editForm.excludeTaxAmount = excludeTaxAmount + ''
      this.editForm.taxAmount = taxAmount + ''
      this.editForm.includeTaxAmount = includeTaxAmount + ''
    }
  }
}
</script>

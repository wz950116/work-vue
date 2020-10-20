<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleCloseDialog' @deleteRow='handleDeleteRow'></qm-edit-tab>
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
          search: '/api/margin/marginClaimDetail/listByClaimNo'
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
            i18n: 'margin.marginApply.btn.selectBond',
            component: () => import('./chooseMarginRec.vue'),
            validate: this.validateAdd,
            initChoose: this.initChooseAdd
          },
          {
            name: 'add',
            iconName: '线性-增行',
            isShow: false,
            type: 'dialog',
            i18n: 'margin.marginApply.btn.selectBond',
            component: () => import('./chooseMarginRecReturn.vue'),
            validate: this.validateAdd,
            initChoose: this.initChooseAdd
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.deleteRow'
          }
        ],
        table: {
          height: 300,
          cols: [
            // 合同号
            {
              label: 'margin.marginClaim.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left'
            },
            {
              label: 'margin.form.billType',
              width: '120',
              prop: 'billType',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            {
              label: 'margin.form.billNo',
              width: '180',
              prop: 'billNo'
            },
            // 商品
            {
              label: 'margin.marginClaim.list.productName',
              prop: 'productName',
              width: 200,
              align: 'left'
            },
            // 认领金额
            {
              label: 'margin.marginClaim.list.claimAmount',
              prop: 'claimAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onClaimAmountChange
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
        this.$notify(notifyInfo({ msg: this.$t('请选择客户') }))
        return false
      }
      return true
    },
    // 点击增行弹框初始化
    initChooseAdd() {
      return {
        initSearch: true,
        multiple: true,
        realCustCode: {
          disabled: true,
          value: this.editForm.customerNo
        },
        applyType: {
          disabled: true,
          value: this.editForm.claimType
        },
        openType: {
          disabled: true,
          value: 'MARGIN_CLAIM'
        }
      }
    },
    // 增行弹窗关闭
    handleCloseDialog(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        if (row.returnTransferFlag) {
          // 退还保证金
          this.$refs.tab.tableData[_index]['contractNo'] = row.contractNo
          this.$refs.tab.tableData[_index]['billType'] = row.billType
          this.$refs.tab.tableData[_index]['billNo'] = row.billNo
          this.$refs.tab.tableData[_index]['productCode'] = row.productCode
          this.$refs.tab.tableData[_index]['productName'] = row.productName
          this.$refs.tab.tableData[_index]['customerNo'] = row.customerNo
          this.$refs.tab.tableData[_index]['customerName'] = row.customerName
          this.$refs.tab.tableData[_index]['toRecAmt'] = row.refundAmount
          this.$refs.tab.tableData[_index]['claimAmount'] = Number(row.refundAmount).toFixed(2)
          this.$refs.tab.tableData[_index]['remark'] = ''
        } else {
          // 支付保证金
          this.$refs.tab.tableData[_index]['contractNo'] = row.contractNo
          this.$refs.tab.tableData[_index]['billType'] = row.billType
          this.$refs.tab.tableData[_index]['billNo'] = row.billNo
          this.$refs.tab.tableData[_index]['productCode'] = row.productCode
          this.$refs.tab.tableData[_index]['productName'] = row.productName
          this.$refs.tab.tableData[_index]['customerNo'] = row.realCustCode
          this.$refs.tab.tableData[_index]['customerName'] = row.realCustName
          this.$refs.tab.tableData[_index]['toRecAmt'] = row.amount
          this.$refs.tab.tableData[_index]['claimAmount'] = Number(row.amount).toFixed(2)
          this.$refs.tab.tableData[_index]['remark'] = ''
        }
      })
      // 后过滤
      //const newData = []
      //this.$refs.tab.tableData.forEach(row => {
      //  if (
      //   !newData
      //      .map(v => {
      //        return v.lotNo
      //      })
      //      .includes(row.lotNo)
      //  ) {
      //    newData.push(row)
      //  }
      //})
      //this.$refs.tab.tableData = newData
    },
    // 删行触发事件
    handleDeleteRow() {
      this.onClaimAmountChange()
    },
    // 认领金额change事件
    onClaimAmountChange(val) {
      var claimAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        claimAmount = (Number(claimAmount) + Number(row.claimAmount)).toFixed(2)
      })
      this.editForm.claimAmount = claimAmount + ''
    }
  }
}
</script>

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
          search: '/api/fee/applyAdvTranDe/listByTransferNo'
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
            i18n: 'biz.btn.selectFeeSettleDetail',
            component: () => import('@/views/frame/biz/fee/dialog/feeSettleFeeDetailDialogForFund.vue'),
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
            // 费用结算单据号
            {
              label: 'fee.feeAdvanceApplyTransfer.list.settleNo',
              prop: 'settleNo',
              width: 200,
              align: 'left'
            },
            // 费用结算明细单据号
            {
              label: 'fee.feeAdvanceApplyTransfer.list.settleDetailNo',
              prop: 'settleDetailNo',
              width: 200,
              align: 'left'
            },
            // 费用方向
            {
              label: 'fee.feeAdvanceApplyTransfer.list.feeDirection',
              prop: 'feeDirection',
              format: {
                dict: this.$t('datadict.feeDirection')
              },
              width: 100,
              align: 'center'
            },
            // 费用名称
            {
              label: 'fee.feeAdvanceApplyTransfer.list.feeNameCode',
              prop: 'feeNameCode',
              element: 'base-select',
              attrs: {
                data: 'DD_FEE_TYPE',
                disabled: true,
                clearable: true
              },
              width: 120,
              align: 'left'
            },
            // 转换金额
            {
              label: 'fee.feeAdvanceApplyTransfer.list.transferAmount',
              prop: 'transferAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onTransferAmountChange
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
        this.$notify(notifyInfo({ msg: this.$t('请选择服务商') }))
        return false
      }
      if (!this.editForm.currency) {
        this.$notify(notifyInfo({ msg: this.$t('请选择币种') }))
        return false
      }
      if (!this.editForm.bizOrganCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择业务机构') }))
        return false
      }
      return true
    },
    // 点击增行弹框初始化
    initChooseAdd() {
      return {
        initSearch: true,
        multiple: true,
        customerNo: {
          disabled: true,
          value: this.editForm.customerNo
        },
        feeDirection: {
          disabled: true,
          value: '2'
        },
        currency: {
          disabled: true,
          value: this.editForm.currency
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
        this.$refs.tab.tableData[_index]['settleNo'] = row.settleNo
        this.$refs.tab.tableData[_index]['settleDetailNo'] = row.settleFeeDetailNo
        this.$refs.tab.tableData[_index]['feeDirection'] = row.feeDirection
        this.$refs.tab.tableData[_index]['feeNameCode'] = row.feeNameCode
        this.$refs.tab.tableData[_index]['transferAmount'] = row.includeTaxAmount
        this.$refs.tab.tableData[_index]['remark'] = ''
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.settleNo + v.settleDetailNo
            })
            .includes(row.settleNo + row.settleDetailNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 删行触发事件
    handleDeleteRow() {
      this.onTransferAmountChange()
    },
    // 转换金额change事件
    onTransferAmountChange(val) {
      var transferAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        transferAmount = Number(transferAmount) + Number(row.transferAmount)
      })
      this.editForm.transferAmount = transferAmount + ''
    }
  }
}
</script>

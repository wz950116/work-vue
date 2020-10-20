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
          search: '/api/fee/feeApplyDetail/list'
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
            i18n: 'fee.feeApplyInfo.group.selectFeeSettle',
            component: () => import('@/views/frame/biz/fee/dialog/chooseFeeSettleFeeDetail.vue'),
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
          height: 200,
          cols: [
            // 费用结算单据号
            {
              label: 'fee.feeApplyInfo.feeApplyDetail.settleNo',
              prop: 'settleNo',
              width: 200,
              align: 'left',
              required: true
            },
            // 费用结算明细单据号
            {
              label: 'fee.feeApplyInfo.feeApplyDetail.settleDetailNo',
              prop: 'settleDetailNo',
              width: 200,
              align: 'left',
              required: true
            },
            // 费用方向
            {
              label: 'fee.feeApplyInfo.feeApplyDetail.feeDirection',
              prop: 'feeDirection',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.feeDirection')
              },
              required: true
            },
            // 费用名称
            {
              label: 'fee.feeApplyInfo.feeApplyDetail.feeNameCode',
              prop: 'feeName',
              width: 100,
              align: 'center',
              required: true
            },

            // 申请金额
            {
              label: 'fee.feeApplyInfo.feeApplyDetail.applyAmount',
              prop: 'applyAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              event: this.onApplyAmountChange,
              required: true
            },
            // 币种
            {
              label: 'fee.feeApplyInfo.feeApplyDetail.currency',
              prop: 'currency',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              },
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
        this.$notify(notifyInfo({ msg: this.$t('请选择结算单位') }))
        return false
      }
      if (!this.editForm.businessType) {
        this.$notify(notifyInfo({ msg: this.$t('请选择业务类别') }))
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
          value: this.getBillType()
        },
        bizOrganCode: {
          disabled: true,
          value: this.editForm.bizOrganCode
        },
        currency: {
          disabled: true,
          value: this.editForm.currency
        }
      }
    },
    getBillType() {
      if (this.editForm.businessType === 'RECEIVABLE') {
        return '1'
      }
      if (this.editForm.businessType === 'PAYABLE') {
        return '2'
      }
      if (this.editForm.businessType === 'A') {
        return '3'
      }
      return ''
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
        this.$refs.tab.tableData[_index]['feeName'] = row.feeName
        this.$refs.tab.tableData[_index]['applyAmount'] = row.includeTaxAmount
        this.$refs.tab.tableData[_index]['currency'] = row.currency
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
      this.onApplyAmountChange()
    },
    // 申请金额change事件
    onApplyAmountChange(val) {
      var applyAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        applyAmount = (Number(applyAmount) + Number(row.applyAmount)).toFixed(2)
      })
      this.editForm.applyAmount = applyAmount + ''
    }
  }
}
</script>

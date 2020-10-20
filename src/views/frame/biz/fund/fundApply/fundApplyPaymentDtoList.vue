<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        editForm: this.editForm,
        api: {
          search: '/api/fund/applyPayment/listByApplyNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        table: {
          height: 150,
          cols: [
            // 付款方式
            {
              label: 'fund.fundApply.list.paymentType',
              prop: 'paymentType',
              format: {
                dict: this.$t('datadict.settlementTypePay')
              },
              width: 100,
              align: 'center',
              required: true
            },
            // 付款比例
            {
              label: 'fund.fundApply.list.paymentRate',
              prop: 'paymentRate',
              element: 'input-formatter',
              attrs: {
                type: 'percent',
                disabled: false,
                clearable: true
              },
              width: 120,
              align: 'right',
              required: true,
              event: this.onPaymentRateChange
            },
            // 申请金额
            {
              label: 'fund.fundApply.list.applyAmount',
              prop: 'applyAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onApplyAmountChange
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
    // 付款比例change事件
    onPaymentRateChange(param) {
      var row = param.row
      row.applyAmount = (Number(this.editForm.applyAmount) * Number(row.paymentRate) / 100).toFixed(2)
    },
    // 付款金额change事件
    onApplyAmountChange(param) {
      // var row = param.row
      // if (Number(this.editForm.applyAmount) !== 0) {
      //   row.paymentRate = (Number(row.applyAmount) / Number(this.editForm.applyAmount) * 100).toFixed(2)
      // } else {
      //   row.paymentRate = '0'
      // }
    }
  }
}
</script>

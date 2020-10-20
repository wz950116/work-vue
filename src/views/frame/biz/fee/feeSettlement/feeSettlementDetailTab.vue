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
        api: {
          search: '/api/fee/feeSettleDetail/list'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        table: {
          cols: [
            // // 结算商
            // {
            //   label: 'fee.feeSettle.feeSettleDetail.customerNo',
            //   prop: 'customerName',
            //   width: 200
            // },
            // 费用名称
            {
              label: 'fee.feeSettle.feeSettleDetail.feeName',
              prop: 'feeName',
              width: 100
            },
            // 费用方向
            {
              label: 'fee.feeSettle.feeSettleDetail.feeDirection',
              prop: 'feeDirection',
              width: 100,
              align: 'center',
              format: {
                dict: this.$t('datadict.feeDirection')
              }
            },
            // 结算单价
            {
              label: 'fee.feeSettle.feeSettleDetail.includeTaxPrice',
              prop: 'includeTaxPrice',
              align: 'right',
              width: 150,
              format: {
                func: 'money'
              }
            },
            // 结算无税单价
            {
              label: 'fee.feeSettle.feeSettleDetail.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              width: 150,
              align: 'right',
              format: {
                func: 'money'
              }
            },
            // 结算数量
            {
              label: 'fee.feeSettle.feeSettleDetail.feeQuantity',
              prop: 'feeQuantity',
              width: 150,
              align: 'right',
              format: {
                func: 'num'
              }
            },
            // 计量单位
            {
              label: 'fee.feeSettle.feeSettleDetail.quantityUnit',
              prop: 'quantityUnit',
              width: 100,
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            // 结算税率
            {
              label: 'fee.feeSettle.feeSettleDetail.taxRate',
              prop: 'taxRate',
              width: 100,
              align: 'right',
              format: {
                func: 'taxrate'
              }
            },
            // 含税金额
            {
              label: 'fee.feeSettle.feeSettleDetail.includeTaxAmount',
              prop: 'includeTaxAmount',
              align: 'right',
              width: 150,
              format: {
                func: 'money'
              }
            },
            // 不含税金额
            {
              label: 'fee.feeSettle.feeSettleDetail.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              width: 150,
              align: 'right',
              format: {
                func: 'money'
              }
            },

            // 税额
            {
              label: 'fee.feeSettle.feeSettleDetail.taxAmount',
              prop: 'taxAmount',
              width: 150,
              align: 'right',
              format: {
                func: 'money'
              }
            },
            // 币种
            {
              label: 'fee.feeSettle.feeSettleDetail.currency',
              prop: 'currency',
              align: 'center',
              width: 100,
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            // 商品名称
            {
              label: 'fee.feeSettle.feeSettleDetail.productName',
              prop: 'productName',
              width: 100
            },
            ...this.$store.state.user.mainGoodColsTxt,
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
    }
  },
  mounted() {},
  methods: {}
}
</script>

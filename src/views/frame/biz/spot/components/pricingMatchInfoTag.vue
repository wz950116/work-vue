<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: ''
        },
        apiData: {
          search(param) {
            return param
          }
        },
        topBar: [
        ],
        table: {
          cols: [
            {
              label: 'spot.pricingMatch.list.pricingCode',
              prop: 'pricingCode',
              width: '120'
            },
            {
              label: 'spot.pricingMatch.list.productName',
              prop: 'productName',
              width: '120'
            },
            {
              label: 'spot.pricingMatch.list.pricingType',
              width: '90',
              prop: 'pricingType',
              isSon: true,
              format: {
                dict: this.$t('datadict.pricingType')
              }
            },
            {
              label: 'spot.pricingMatch.list.pricingTime',
              width: '120',
              prop: 'pricingTime',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingMatch.list.confirmPrice',
              width: '120',
              isSon: true,
              prop: 'confirmPrice',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'money'
              }
            },
            {
              label: 'spot.pricingMatch.list.currency',
              prop: 'currency',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.pricingMatch.list.confirmQuantity',
              width: '120',
              isSon: true,
              prop: 'confirmQuantity',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'weight'
              }
            },
            {
              label: 'spot.pricingMatch.list.valueUnit',
              prop: 'valueUnit',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.pricingMatch.list.validQuantity',
              width: '120',
              isSon: true,
              prop: 'validQuantity',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'weight'
              }
            },
            {
              label: 'spot.pricingMatch.list.matchQuantity',
              prop: 'matchQuantity',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight'
              },
              event: this.matchQuantityChange
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
  methods: {
    matchQuantityChange(val) {
      this.$parent.edit.changeFlag = true
    },
    getPricingMatch(row) {
      request({
        url: '/api/pricingMatch/listMatchPricing',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view'),
          data: row
        }
      }).then(response => {
        if (response.data) {
          const tableData = response.data
          for (let i = 0; i < tableData.length; i++) {
            const curr = tableData[i]
            if (!curr.docType) {
              if (row.billType) {
                curr.docType = row.billType
              } else {
                curr.docType = row.docType
              }
            }
            if (!curr.docCode) {
              curr.docCode = row.docCode
            }
            curr.lotNo = this.param.row.lotNo
          }
          this.$refs.tab.tableData = tableData
        }
      })
    }
  }
}
</script>

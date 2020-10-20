<template>
  <qm-edit-tab ref='tab' :tab='tab' @selectRow="selectRow"></qm-edit-tab>
</template>
<script>
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        reveseRowFlag: false,
        type: this.type,
        param: this.param,
        api: {
          search: '/api/pricingMatch/listMatchProduct'
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
              label: 'spot.pricingMatch.list.docCode',
              prop: 'docCode',
              width: '120'
            },
            {
              label: 'spot.pricingMatch.list.productName',
              prop: 'productName',
              width: '180'
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
              label: 'spot.pricingMatch.list.measurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
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
              label: 'spot.pricingMatch.list.residualQuantity',
              prop: 'residualQuantity',
              width: '120',
              align: 'right',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'weight'
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
      default: 'add'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.getProductList()
  },
  methods: {
    getProductList() {
      request({
        url: '/api/pricingMatch/listMatchProduct',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view'),
          data: this.param.row
        }
      }).then(response => {
        if (response.data) {
          this.$refs.tab.tableData = response.data
        }
      })
    },
    selectRow(row, oldRow) {
      if (this.reveseRowFlag) {
        return false
      }
      if (this.$parent.edit.changeFlag) {
        this.$confirm(
          this.$t('spot.pricingMatch.msg.confirmClear'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        ).then(() => {
          row.docType = this.param.row.matchPoint
          row.contractCode = this.param.row.contractCode
          this.$parent.$refs.pricingMatchInfoList[0].getPricingMatch(row)
        })
          .catch(() => {
            this.reveseRow(oldRow)
          })
      } else {
        row.docType = this.param.row.matchPoint
        row.contractCode = this.param.row.contractCode
        this.$parent.$refs.pricingMatchInfoList[0].getPricingMatch(row)
      }
    },
    reveseRow(row) {
      this.reveseRowFlag = true
      this.$refs.tab.$refs.singleTable.setCurrentRow(row)
      this.reveseRowFlag = false
    }
  }
}
</script>

<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        type: 'add',
        param: { type: 'add' },
        api: {},
        apiData: {},
        topBar: [
          {
            name: 'view',
            iconName: '线性-查看',
            i18n: 'biz.btn.view',
            type: 'route',
            isShow: ['view', 'add'],
            event: this.doView
          }
        ],
        table: {
          id: '',
          mergeProp: 'productDetailList',
          maxHeight: 100,
          cols: [
            {
              label: 'spot.pricingReg.list.docMakeDate',
              prop: 'docMakeDate',
              width: '90',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingReg.list.contractCode',
              prop: 'contractCode',
              width: '180'
            },
            {
              label: 'spot.pricingReg.list.pricingCode',
              prop: 'pricingCode',
              width: '180'
            },
            {
              label: 'spot.pricingReg.list.productName',
              prop: 'productName',
              width: '180'
            },
            {
              label: 'spot.pricingReg.list.pricingType',
              prop: 'pricingType',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.pricingType')
              }
            },
            {
              label: 'spot.pricingReg.list.pricingBenchmark',
              prop: 'pricingItemName',
              width: '180'
            },
            {
              label: 'spot.pricingReg.list.pricingTime',
              prop: 'pricingTime',
              width: '90',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingReg.list.pricingQuantity',
              prop: 'pricingQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              label: 'spot.pricingReg.list.confirmQuantity',
              prop: 'confirmQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              label: 'spot.pricingReg.list.valueUnit',
              prop: 'valueUnit',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.pricingReg.list.price',
              prop: 'price',
              width: '120',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'spot.pricingReg.list.confirmPrice',
              prop: 'confirmPrice',
              width: '120',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              label: 'spot.pricingReg.list.currency',
              prop: 'currency',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
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
    }
  },
  mounted() {},
  methods: {
    searchDataList(billNoMap) {
      const tableData = this.$refs.tab.$refs.singleTable.data
      tableData.splice(0)
      if (billNoMap['SPOT_PRICING_INFO'] !== undefined) {
        request({
          url: '/api/pricingInfo/list',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            isPage: false,
            data: {
              pricingCodeList: billNoMap['SPOT_PRICING_INFO'],
              purchaseOrSale: 'P',
              auditStatus: '3'
            }
          }
        }).then(response => {
          if (response.status) {
            for (let i = 0; i < response.data.length; i++) {
              tableData.push(response.data[i])
            }
          }
        })
      }
    },
    doView() {
      const currentRow = this.$refs.tab.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      this.$router.push({
        name: 'pricingRegView',
        params: {
          id: currentRow.pricingCode,
          opType: 'view',
          back: 'archiveShow',
          backParam: this.$route.params
        }
      })
    }
  }
}
</script>

<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>

import exportExcel from '@/utils/frame/base/downloadExcel'

export default {
  data() {
    return {
      exchangeRate: 1,
      tab: {
        type: this.$route.params.type,
        param: this.$route.params,
        api: {
          search: ''
        },
        apiData: {
          search(param) {
            return param.id
          }
        },
        topBar: [
          {
            name: 'export',
            i18n: 'biz.btn.export',
            iconName: '线性-导出',
            event: this.handleDownload
          }
        ],
        table: {
          cols: [
            {
              width: 180,
              label: 'spotProj.exposure.list.contractNo',
              prop: 'contractNo'
            },
            {
              width: 180,
              label: 'spotProj.exposure.list.documentNo',
              prop: 'documentNo'
            },
            {
              width: 180,
              label: 'spotProj.exposure.list.pricingNo',
              prop: 'priceNo'
            },
            {
              width: 120,
              label: 'spotProj.exposure.list.productName',
              prop: 'productName'
            },
            {
              prop: 'documentQuantity',
              align: 'right',
              width: '100',
              label: 'spotProj.exposure.list.documentQuantity',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'rawQuantity',
              align: 'right',
              width: '100',
              label: 'spotProj.exposure.list.rawQuantity',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'pricingDate',
              align: 'center',
              width: '100',
              label: 'spotProj.exposure.list.pricingDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'avgPrice',
              align: 'right',
              width: '120',
              label: 'spotProj.exposure.list.avgPrice',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'premium',
              align: 'right',
              width: '120',
              label: 'spotProj.exposure.list.premium',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'price',
              align: 'right',
              width: '120',
              label: 'spotProj.exposure.list.price',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'exchangeRate',
              align: 'right',
              width: '120',
              label: 'spotProj.exposure.list.exchangeRate',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'unitCode',
              align: 'center',
              width: '100',
              label: 'spotProj.exposure.list.unitCode',
              format: {
                dict: this.$t('datadict.measurementUnit')
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
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    // 导出
    handleDownload() {
      exportExcel({
        fileName: this.$t('spotProj.exposure.tab.monthDetail'),
        header: [
          this.$t('spotProj.exposure.list.contractNo'),
          this.$t('spotProj.exposure.list.documentNo'),
          this.$t('spotProj.exposure.list.pricingNo'),
          this.$t('spotProj.exposure.list.productName'),
          this.$t('spotProj.exposure.list.documentQuantity'),
          this.$t('spotProj.exposure.list.rawQuantity'),
          this.$t('spotProj.exposure.list.pricingDate'),
          this.$t('spotProj.exposure.list.avgPrice'),
          this.$t('spotProj.exposure.list.premium'),
          this.$t('spotProj.exposure.list.price'),
          this.$t('spotProj.exposure.list.exchangeRate'),
          this.$t('spotProj.exposure.list.unitCode')
        ],
        filterVal: [
          'contractNo',
          'documentNo',
          'priceNo',
          'productName',
          'documentQuantity',
          'rawQuantity',
          'pricingDate',
          'avgPrice',
          'premium',
          'price',
          'exchangeRate',
          {
            val: 'unitCode',
            dicCode: this.$t('datadict.measurementUnit')
          }
        ],
        exportData: this.$refs.tab.tableData
      })
    }
  }
}
</script>

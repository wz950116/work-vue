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
              label: 'spot.contractLot.form.docMakeDt',
              width: '150',
              align: 'center',
              prop: 'docMakeDt'
            },
            {
              label: 'spot.contractLot.form.contractNo',
              width: '180',
              prop: 'contractNo'
            },
            {
              label: 'spot.contractLot.form.lotNo',
              width: '180',
              prop: 'lotNo'
            },
            {
              label: 'spot.contractLot.form.supplierNames',
              width: '210',
              prop: 'supplierNames'
            },
            {
              label: 'spot.contractLot.form.currency',
              width: '80',
              prop: 'currency',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.contractLot.form.productName',
              width: '180',
              prop: 'productName',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            {
              label: 'spot.contractLot.form.productQuantity',
              width: '120',
              prop: 'productQuantity',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.productUnitCode',
              width: '90',
              prop: 'productUnitCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.measurementQuantity',
              width: '120',
              prop: 'measurementQuantity',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 3
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.measurementUnitCode',
              width: '90',
              prop: 'measurementUnitCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.originalAmount',
              prop: 'originalAmount',
              width: '120',
              format: {
                func: 'thousands',
                dict: 2
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.localAmount',
              prop: 'localAmount',
              width: '120',
              format: {
                func: 'thousands',
                dict: 2
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.taxedAmount',
              prop: 'taxedAmount',
              width: '120',
              format: {
                func: 'thousands',
                dict: 2
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.taxFreeAmount',
              prop: 'taxFreeAmount',
              width: '120',
              format: {
                func: 'thousands',
                dict: 2
              },
              isSon: true
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
      if (billNoMap['CON_PL_INFO'] !== undefined) {
        request({
          url: '/api/contract/plInfo/list',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            isPage: false,
            data: {
              lotNoList: billNoMap['CON_PL_INFO'],
              lotState: '3'
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
        name: 'purchaseLotView',
        params: {
          lotNo: currentRow.lotNo,
          opType: 'view',
          back: 'archiveShow',
          backParam: this.$route.params
        }
      })
    }
  }
}
</script>

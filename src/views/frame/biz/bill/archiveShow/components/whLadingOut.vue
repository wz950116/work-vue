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
          mergeProp: 'whLadingOutPickDtoList',
          maxHeight: 100,
          cols: [
            {
              label: 'spot.pricingReg.list.docMakeDate',
              prop: 'createDate',
              width: '150',
              align: 'center'
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
              label: 'storage.ladingOut.list.ladingOutNo',
              prop: 'ladingOutNo',
              width: '180'
            },
            {
              label: 'storage.ladingOut.list.ladingOutDate',
              prop: 'ladingOutDate',
              width: '90',
              align: 'center',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              label: 'storage.ladingOut.list.customerName',
              prop: 'customerName',
              width: '180'
            },
            {
              label: 'storage.ladingOut.list.settlementName',
              prop: 'settlementName',
              width: '180'
            },
            {
              label: 'storage.ladingOut.list.productName',
              prop: 'productName',
              width: '180',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            {
              label: 'storage.ladingOut.list.ladingOutQuantity',
              prop: 'outQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              isSon: true
            },
            {
              label: 'storage.ladingOut.list.productUnitName',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              label: 'storage.ladingOut.list.ladingOutMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              isSon: true
            },
            {
              label: 'storage.ladingOut.list.measurementUnitName',
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
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
      if (billNoMap['WH_LADING_OUT'] !== undefined) {
        request({
          url: '/api/warehouse/whLadingOut/list',
          method: 'post',
          data: {
            isPage: false,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              ladingOutNoList: billNoMap['WH_LADING_OUT'],
              noticeAuditStatus: '3'
            }
          }
        }).then(response => {
          if (response.status) {
            this.fillContractLotNo(response.data)
            for (let i = 0; i < response.data.length; i++) {
              tableData.push(response.data[i])
            }
          }
        })
      }
    },
    fillContractLotNo(dataList) {
      if (dataList.length <= 0) {
        return
      }
      const billNoList = []
      for (let i = 0; i < dataList.length; i++) {
        billNoList.push(dataList[i].ladingOutNo)
      }
      request({
        url: '/api/bill/bizBill/getRelationPrevBill',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            billType: 'WH_LADING_OUT',
            billNoList: billNoList
          }
        }
      }).then(response => {
        if (response.status) {
          for (let i = 0; i < dataList.length; i++) {
            const selfNo = dataList[i].ladingOutNo
            const prevList = response.data.relationPrevBill[selfNo]
            for (let j = 0; j < prevList.length; j++) {
              if (prevList[j].billType === 'CON_PC_INFO' || prevList[j].billType === 'CON_SC_INFO') {
                dataList[i].contractNo = prevList[j].billNo
                break
              }
            }
            for (let j = 0; j < prevList.length; j++) {
              if (prevList[j].billType === 'CON_PL_INFO' || prevList[j].billType === 'CON_SL_INFO') {
                dataList[i].lotNo = prevList[j].billNo
                break
              }
            }
          }
        }
      })
    },
    doView() {
      const currentRow = this.$refs.tab.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      this.$router.push({
        name: 'ladingOutView',
        params: {
          id: currentRow.ladingOutNo,
          opType: 'view',
          back: 'archiveShow',
          backParam: this.$route.params
        }
      })
    }
  }
}
</script>

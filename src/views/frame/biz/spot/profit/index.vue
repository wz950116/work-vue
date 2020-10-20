<template>
  <qm-edit ref="profitDialog" :edit="edit" @closeDialog="handleCloseDialog"></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        param: this.param,
        initChooseParam: this.initChooseParam,
        initType: 'param',
        titleName: this.$t('spot.contractLot.popup.profit'),
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view', 'assist', 'audit'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update', 'copy']
          },
          {
            name: 'biz.btn.confirm',
            iconName: '线性-确认',
            event: this.save,
            showLoading: true,
            isShow: ['add', 'update', 'copy'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        tables: [
          {
            name: 'purchaseProdList',
            label: 'spot.contractLot.tab.profitProdPurchase',
            component: () => import('../profit/profitProdPurchase')
          },
          {
            name: 'saleProdList',
            label: 'spot.contractLot.tab.profitProdSale',
            component: () => import('../profit/profitProdSale')
          },
          {
            name: 'profitItem',
            label: 'spot.contractLot.tab.profitItem',
            component: () => import('../profit/profitItem')
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
    },
    opMode: {
      type: String,
      default: 'dialog'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    },
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    save() {
      const profitItem = this.$refs.profitDialog.$refs.qmDialogEdit.$refs.profitItem[0].$data.itemData
      const purchaseProdList = this.$refs.profitDialog.$refs.qmDialogEdit.$refs.purchaseProdList[0].$refs.tab.tableData
      const saleProdList = this.$refs.profitDialog.$refs.qmDialogEdit.$refs.saleProdList[0].$refs.tab.tableData
      const contractInfo = this.initChooseParam.contractInfo
      profitItem.purchaseProdList = purchaseProdList
      profitItem.saleProdList = saleProdList
      contractInfo.profitItemDto = profitItem
      this.handleCloseDialog()
    }
  }
}
</script>

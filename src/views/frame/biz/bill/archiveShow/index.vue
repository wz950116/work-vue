<template>
  <qm-edit ref='qmEdit' :edit='edit' @initCallback='initCallback'></qm-edit>
</template>
<script>
export default {
  name: 'archiveShow',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/bill/bizBill/getRelationBill'
        },
        apiData: {
          view(param) {
            return param
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            isShow: ['view'],
            event: this.doClose,
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-刷新',
            name: 'biz.btn.refresh',
            isShow: ['view'],
            event: this.doRefresh
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: [
          {
            label: 'bill.bizBill.form.billType',
            prop: 'billType',
            element: 'base-select',
            list: this.$t('datadict.tradeType'),
            attrs: {
              disabled: true
            }
          },
          {
            label: 'bill.bizBill.form.billNo',
            prop: 'billNo',
            element: 'input-validate',
            attrs: {
              disabled: true
            }
          }
        ],
        tables: [
          {
            isShow: ['view'],
            name: 'conPcInfo',
            label: 'bill.bizBill.tables.conPcInfo',
            component: () => import('./components/conPcInfo')
          },
          {
            isShow: ['view'],
            name: 'conPlInfo',
            label: 'bill.bizBill.tables.conPlInfo',
            component: () => import('./components/conPlInfo')
          },
          {
            isShow: ['view'],
            name: 'priInfoP',
            label: 'bill.bizBill.tables.priLotP',
            component: () => import('./components/priInfoP')
          },
          {
            isShow: ['view'],
            name: 'whLadingBill',
            label: 'bill.bizBill.tables.whLadingBill',
            component: () => import('./components/whLadingBill')
          },
          {
            isShow: ['view'],
            name: 'whInBill',
            label: 'bill.bizBill.tables.whInBill',
            component: () => import('./components/whInBill')
          },
          {
            isShow: ['view'],
            name: 'conScInfo',
            label: 'bill.bizBill.tables.conScInfo',
            component: () => import('./components/conScInfo')
          },
          {
            isShow: ['view'],
            name: 'conSlInfo',
            label: 'bill.bizBill.tables.conSlInfo',
            component: () => import('./components/conSlInfo')
          },
          {
            isShow: ['view'],
            name: 'priInfoS',
            label: 'bill.bizBill.tables.priLotS',
            component: () => import('./components/priInfoS')
          },
          {
            isShow: ['view'],
            name: 'whLadingOut',
            label: 'bill.bizBill.tables.whLadingOut',
            component: () => import('./components/whLadingOut')
          },
          {
            isShow: ['view'],
            name: 'whOutBill',
            label: 'bill.bizBill.tables.whOutBill',
            component: () => import('./components/whOutBill')
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
      default: 'router'
    },
    param: {
      type: [String, Object],
      default() {}
    }
  },
  mounted() {
    const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
    const routeParams = this.$refs.qmEdit.edit.param
    editForm.billType = routeParams.billType
    editForm.billNo = routeParams.billNo
  },
  methods: {
    initCallback(data) {
      const billNoMap = data.relationBill === null || data.relationBill === undefined ? {} : data.relationBill
      const tables = this.$refs.qmEdit.$refs.qmRouteEdit.$refs
      tables.conPcInfo[0].searchDataList(billNoMap)
      tables.conPlInfo[0].searchDataList(billNoMap)
      tables.conScInfo[0].searchDataList(billNoMap)
      tables.conSlInfo[0].searchDataList(billNoMap)
      tables.priInfoP[0].searchDataList(billNoMap)
      tables.priInfoS[0].searchDataList(billNoMap)
      tables.whLadingBill[0].searchDataList(billNoMap)
      tables.whLadingOut[0].searchDataList(billNoMap)
      tables.whInBill[0].searchDataList(billNoMap)
      tables.whOutBill[0].searchDataList(billNoMap)
    },
    doRefresh() {
      this.$refs.qmEdit.$refs.qmRouteEdit.getEditData()
    },
    doClose() {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: this.$route.params.backParam
        })
      })
    }
  }
}
</script>

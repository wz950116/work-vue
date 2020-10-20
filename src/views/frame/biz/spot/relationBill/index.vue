<template>
  <qm-edit ref='qmEdit' :edit='edit' @initCallback='initCallback'></qm-edit>
</template>
<script>
export default {
  name: 'conRelationBill',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/contract/bill/listConRelBillNo'
        },
        apiData: {
          view(param) {
            if (param.billType === 'CON_PC_INFO') {
              return { pcNo: param.billNo }
            } else if (param.billType === 'CON_PL_INFO') {
              return { plNo: param.billNo }
            } else if (param.billType === 'CON_SC_INFO' || param.billType === 'DOM_CON_SC_INFO' || param.billType === 'EXT_CON_SC_INFO') {
              return { scNo: param.billNo }
            } else if (param.billType === 'CON_SL_INFO' || param.billType === 'DOM_CON_SL_INFO' || param.billType === 'EXT_CON_SL_INFO') {
              return { slNo: param.billNo }
            }
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
            list: this.$t('datadict.bizCode'),
            default: this.$route.params.billType,
            attrs: {
              disabled: true
            }
          },
          {
            label: 'bill.bizBill.form.billNo',
            prop: 'billNo',
            element: 'input-validate',
            default: this.$route.params.billNo,
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
            name: 'inInvoice',
            label: 'bill.bizBill.tables.inInvoice',
            component: () => import('./components/inInvoice')
          },
          {
            isShow: ['view'],
            name: 'payment',
            label: 'bill.bizBill.tables.payment',
            component: () => import('./components/payment')
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
          },
          {
            isShow: ['view'],
            name: 'outInvoice',
            label: 'bill.bizBill.tables.outInvoice',
            component: () => import('./components/outInvoice')
          },
          {
            isShow: ['view'],
            name: 'receive',
            label: 'bill.bizBill.tables.receive',
            component: () => import('./components/receive')
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
      const tables = this.$refs.qmEdit.$refs.qmRouteEdit.$refs
      tables.conPcInfo[0].searchDataList(data['CON_PC_INFO'])
      tables.conPlInfo[0].searchDataList(data['CON_PL_INFO'])
      tables.conScInfo[0].searchDataList(data['CON_SC_INFO'])
      tables.conSlInfo[0].searchDataList(data['CON_SL_INFO'])
      tables.priInfoP[0].searchDataList(data['CON_PC_INFO'])
      tables.priInfoS[0].searchDataList(data['CON_SC_INFO'])
      tables.whLadingBill[0].searchDataList(data['WH_LADING_BILL'])
      tables.whLadingOut[0].searchDataList(data['WH_LADING_BILL_OUT'])
      tables.whInBill[0].searchDataList(data['WH_IN_BILL'])
      tables.whOutBill[0].searchDataList(data['WH_OUT_BILL'])
      tables.payment[0].searchDataList(data['CON_PL_INFO'])
      tables.receive[0].searchDataList(data['CON_SL_INFO'])
      tables.inInvoice[0].searchDataList(data['CON_PL_INFO'])
      tables.outInvoice[0].searchDataList(data['CON_SL_INFO'])
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

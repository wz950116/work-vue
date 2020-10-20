<template>
  <qm-dialog-array-table ref='qmDialogTable' :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-array-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('cst.creditCs.dialog.title'),
        initChooseParam: this.initChooseParam,
        moreShowFlg: false,
        formData: [
          {
            label: 'cst.creditCs.form.custCode',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3',
                typeCode: '2'
              }
            }
          },
          {
            label: 'cst.creditCs.form.docNo',
            prop: 'docNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'cst.creditCs.form.docNo',
            prop: 'billNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            isShow: false
          }
        ],

        mainData: {
          api: {
            search: '/api/cust/credit/listTempDialogCs'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'custName.desc,docNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: true,
          table: {
            cols: [
              {
                prop: 'custName',
                width: '150',
                label: 'cst.creditCs.list.custName'
              },
              {
                prop: 'docType',
                width: '100',
                align: 'center',
                label: 'cst.creditCs.list.docType',
                format: {
                  dict: this.$t('datadict.custCreditDocType')
                }
              },
              {
                prop: 'docNo',
                width: '150',
                label: 'cst.creditCs.list.docNo'
              },
              {
                prop: 'creditType',
                width: '100',
                align: 'center',
                label: 'cst.creditCs.list.creditType',
                format: {
                  dict: this.$t('datadict.creditType')
                }
              },
              {
                prop: 'creditQuotaType',
                width: '100',
                align: 'center',
                label: 'cst.creditCs.list.creditQuotaType',
                format: {
                  dict: this.$t('datadict.creditQuotaType')
                }
              },
              {
                prop: 'creditWay',
                width: '100',
                align: 'center',
                label: 'cst.creditCs.list.creditWay',
                format: {
                  dict: this.$t('datadict.creditWay')
                }
              },
              {
                prop: 'creditQuota',
                width: '100',
                align: 'right',
                label: 'cst.creditCs.list.creditQuota'
              }
            ]
          }
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        },
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {},
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

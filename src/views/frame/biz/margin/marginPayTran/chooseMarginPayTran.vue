<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: '退还保证金',
        moreShowFlg: false,
        initType: 'param',
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'margin.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'margin.form.billType',
            prop: 'billType',
            element: 'base-select',
            list: [
              { key: 'CON_PC_INFO', value: 'CON_PC_INFO', label: '采购合同' },
              { key: 'CON_PL_INFO', value: 'CON_PL_INFO', label: '采购批次' }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'margin.form.billNo',
            prop: 'billNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'margin.form.custCode',
            prop: 'realCustCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'margin.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          }
        ],
        mainData: {
          api: {
            search: '/api/margin/monitorStat/listChooseMarginReturnTransfer'
          },
          apiData: {
            search(param) {
              if (param === null || param === undefined) {
                param = {}
              }
              if (param.data === null || param.data === undefined) {
                param.data = {}
              }
              param.data.marginDirection = 'P'
              param.data.returnTransferFlag = 'T'
              param.defaultSortString = 'needFlag.desc, billType.asc, billNo.asc, productCode.asc'
              return param
            }
          },
          initSearch: true,
          table: {
            showCheckbox: false,
            cols: [
              {
                label: 'margin.form.contractNo',
                width: '180',
                prop: 'contractNo'
              },
              {
                label: 'margin.form.billType',
                width: '120',
                prop: 'billType',
                format: {
                  dict: this.$t('datadict.bizCode')
                }
              },
              {
                label: 'margin.form.billNo',
                width: '180',
                prop: 'billNo'
              },
              {
                label: 'margin.form.custCode',
                width: '180',
                prop: 'customerName'
              },
              {
                label: 'margin.form.productCode',
                width: '120',
                prop: 'productName'
              },
              {
                label: 'margin.form.currencyName',
                width: '90',
                prop: 'currencyName',
                align: 'center'
              },
              {
                label: 'margin.form.ttlPayAmt',
                prop: 'totalAmount',
                align: 'right',
                width: '120',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'margin.form.returnAmount',
                prop: 'returnAmount',
                align: 'right',
                width: '120',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'margin.form.transferAmount',
                prop: 'transferAmount',
                align: 'right',
                width: '120',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'margin.form.transformableAmount',
                prop: 'transformableAmount',
                align: 'right',
                width: '120',
                format: {
                  func: 'money'
                }
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
  beforeMount() {},
  mounted() {},
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

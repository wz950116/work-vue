<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('margin.marginApply.tab.chooseMargin'),
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
              { key: 'CON_PL_INFO', value: 'CON_PL_INFO', label: '采购批次' },
              { key: 'CON_SC_INFO', value: 'CON_SC_INFO', label: '销售合同' },
              { key: 'CON_SL_INFO', value: 'CON_SL_INFO', label: '销售批次' }
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
            search: '/api/margin/monitorStat/listChooseMarginPayRec'
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
              param.defaultSortString = 'needFlag.desc, billType.asc, billNo.asc, productCode.asc'
              return param
            }
          },
          initSearch: true,
          table: {
            showCheckbox: true,
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
                prop: 'custCode'
              },
              {
                label: 'margin.form.thirdPartyHostFlag',
                width: '90',
                prop: 'thirdPartyHostFlag',
                align: 'center',
                format: {
                  dict: this.$t('datadict.yesNo')
                }
              },
              {
                label: 'margin.form.thirdPartyName',
                width: '180',
                prop: 'thirdPartyName'
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
                label: 'margin.form.toPayAmt',
                prop: 'amount',
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

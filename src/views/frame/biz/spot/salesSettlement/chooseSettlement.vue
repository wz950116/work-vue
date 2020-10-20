<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('spot.contractLot.popup.chooseSettlement'),
        moreShowFlg: false,
        initType: 'param',
        formData: [
          {
            label: 'spot.contractLot.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
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
            search: '/api/contract/ssOutRelation/listUnSettlementOutBill'
          },
          apiData: {
            search(param) {
              return param
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            id: '',
            showCheckbox: true,
            cols: [
              {
                label: 'spot.contractLot.form.outBillNo',
                width: '180',
                prop: 'outBillNo'
              },
              {
                label: 'spot.contractLot.form.outDate',
                width: '90',
                prop: 'outDate',
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
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
                label: 'spot.contractLot.form.settlementBillNo',
                width: '180',
                prop: 'srcBillNo'
              },
              {
                label: 'spot.contractLot.form.currency',
                width: '90',
                prop: 'currency',
                align: 'center',
                format: {
                  dict: this.$t('datadict.currency')
                }
              },
              {
                label: 'spot.contractLot.form.headlineName',
                width: '180',
                prop: 'headlineName'
              },
              {
                label: 'spot.contractLot.form.customerName',
                width: '180',
                prop: 'customerName'
              },
              {
                label: 'spot.contractLot.form.productName',
                width: '180',
                prop: 'productName'
              },
              ...this.$store.state.user.mainGoodColsTxt,
              {
                label: 'spot.contractLot.form.outPrice',
                width: '120',
                prop: 'outPrice',
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'spot.contractLot.form.outTaxRate',
                width: '120',
                prop: 'outTaxRate',
                align: 'right',
                format: {
                  func: 'taxrate'
                }
              },
              {
                label: 'spot.contractLot.form.outQuantity',
                width: '120',
                prop: 'outQuantity',
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'spot.contractLot.form.acceptQuantity',
                width: '120',
                prop: 'acceptQuantity',
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.contractLot.form.returnQuantity',
                width: '120',
                prop: 'returnQuantity',
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.contractLot.form.settlementQuantity',
                width: '120',
                prop: 'settlementQuantity',
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.contractLot.form.measurementUnitCode',
                width: '90',
                prop: 'valueUnit',
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
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
    // 是否进行初始化查询
    // 是否进行初始化查询
    initSearch: {
      type: Boolean,
      default: true
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
    getInitSearch() {
      if (typeof this.param.initSearch === 'boolean') {
        return this.param.initSearch
      }
      if (typeof this.initChooseParam.initSearch === 'boolean') {
        return this.initChooseParam.initSearch
      }
      return this.initSearch
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  name: 'pricingLotSelect',
  data() {
    return {
      dialog: {
        titleName: '选择定价批次',
        listQuery: {
          current: 1,
          size: 100,
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            pricingLotCode: '',
            purchaseOrSale: '',
            pricingType: '',
            productCode: ''
          },
          defaultSortString: 'pricingLotCode.desc'
        },
        formData: [
          {
            label: 'spot.pricingLot.form.pricingLotCode',
            prop: 'pricingLotCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingLot.form.purchaseOrSale',
            prop: 'purchaseOrSale',
            element: 'base-select',
            list: this.$t('datadict.purchaseOrSale'),
            validate: [
              {
                trigger: 'change'
              }
            ],
            attrs: {
              disabled: true,
              clearable: true
            },
            default: this.param.purchaseOrSale
          },
          {
            label: 'spot.pricingRule.form.pricingType',
            prop: 'pricingType',
            element: 'base-select',
            list: this.$t('datadict.pricingType'),
            validate: [
              {
                trigger: 'change'
              }
            ],
            attrs: {
              disabled: true,
              clearable: true
            },
            default: this.param.pricingType
          },
          {
            label: 'spot.pricingRule.form.productName',
            prop: 'productCode',
            element: 'base-select',
            validate: [
              {
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'DD_PRODUCT',
              disabled: true,
              clearable: true
            },
            default: this.param.productCode
          },
          {
            label: 'spot.pricingLot.form.currency',
            prop: 'currency',
            element: 'base-select',
            list: this.$t('datadict.currency'),
            attrs: {
              disabled: true
            },
            default: this.param.currency
          }
        ],

        mainData: {
          api: {
            search: '/api/pricingLot/listForRule'
          },
          apiData: {},
          table: {
            id: '',
            cols: [
              {
                label: 'spot.pricingLot.list.pricingLotCode',
                prop: 'pricingLotCode'
              },
              {
                label: 'spot.pricingLot.list.contractCode',
                prop: 'contractCode'
              },
              {
                label: 'spot.pricingLot.list.purchaseOrSale',
                prop: 'purchaseOrSale',
                format: {
                  dict: this.$t('datadict.purchaseOrSale')
                }
              },
              {
                label: 'spot.pricingLot.list.currency',
                prop: 'currency'
              },
              {
                label: 'spot.pricingLot.list.productName',
                prop: 'productName'
              },
              {
                label: 'spot.pricingLot.list.pricingType',
                prop: 'pricingType',
                format: {
                  dict: this.$t('datadict.pricingType')
                }
              },
              {
                label: 'spot.pricingLot.list.pricingBenchmark',
                prop: 'pricingItemName'
              },
              {
                label: 'spot.pricingLot.list.pricingTimeStart',
                prop: 'pricingTimeStart',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.pricingLot.list.pricingTimeEnd',
                prop: 'pricingTimeEnd',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.pricingLot.list.pricingQuantity',
                prop: 'pricingQuantity',
                attrs: {
                  min: 0,
                  max: 999999999999,
                  type: 'weight'
                }
              },
              {
                label: 'spot.pricingLot.list.valueUnit',
                prop: 'valueUnit',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                }
              },
              {
                label: 'spot.pricingLot.list.premium',
                prop: 'premium',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'spot.pricingLot.list.docMaker',
                prop: 'optEmployeeCode',
                element: 'base-select',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  filterable: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingLot.list.docMakeDate',
                prop: 'createDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.pricingLot.list.note',
                prop: 'note'
              }
            ]
          }
        },
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['view']
          },
          {
            name: 'biz.btn.save',
            event: this.doSelect,
            isShow: ['add'],
            attrs: {
              type: 'primary'
            }
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
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    doSelect() {
      const row = this.$refs.qmDialogTable.currentRow
      this.handleCloseDialog(row)
    }
  }
}
</script>

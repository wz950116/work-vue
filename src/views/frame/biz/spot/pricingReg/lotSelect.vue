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
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            pricingLotCode: '',
            contractCode: '',
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
            label: 'spot.pricingLot.form.contractCode',
            prop: 'contractCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingLot.form.productName',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          }
        ],
        mainData: {
          initSearch: true,
          api: {
            search: '/api/pricingLot/listForReg'
          },
          apiData: {},
          table: {
            id: '',
            cols: [
              {
                label: 'spot.pricingLot.list.pricingLotCode',
                prop: 'pricingLotCode',
                width: 180
              },
              {
                label: 'spot.pricingLot.list.contractCode',
                prop: 'contractCode',
                width: 180
              },
              {
                label: 'spot.pricingLot.list.purchaseOrSale',
                prop: 'purchaseOrSale',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.purchaseOrSale')
                }
              },
              {
                label: 'spot.pricingLot.list.currency',
                prop: 'currency',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.currency')
                }
              },
              {
                label: 'spot.pricingLot.list.productName',
                prop: 'productName',
                width: 150
              },
              {
                label: 'spot.pricingLot.list.pricingType',
                prop: 'pricingType',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.pricingType')
                }
              },
              {
                label: 'spot.pricingLot.list.pricingBenchmark',
                prop: 'pricingItemName',
                width: 180
              },
              {
                label: 'spot.pricingLot.list.pricingTimeStart',
                prop: 'pricingTimeStart',
                width: 90,
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.pricingLot.list.pricingTimeEnd',
                prop: 'pricingTimeEnd',
                width: 90,
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.pricingLot.list.pricingQuantity',
                prop: 'pricingQuantity',
                width: 120,
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.pricingLot.list.rmnRegQty',
                prop: 'rmnMemQty',
                width: 120,
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.pricingLot.list.valueUnit',
                prop: 'valueUnit',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                }
              },
              {
                label: 'spot.pricingLot.list.premium',
                prop: 'premium',
                width: 120,
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'spot.pricingLot.list.docMaker',
                prop: 'docMaker',
                width: 120
              },
              {
                label: 'spot.pricingLot.list.docMakeDate',
                prop: 'docMakeDate',
                width: 90,
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.pricingLot.list.note',
                prop: 'note',
                width: 180
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
            isShow: ['view']
          },
          {
            name: 'biz.btn.save',
            event: this.doSelect,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
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

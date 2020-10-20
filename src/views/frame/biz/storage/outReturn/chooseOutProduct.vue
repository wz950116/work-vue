<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('storage.outNotice.popup.outNoticeSelect'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'storage.outNotice.form.auditStatus',
            prop: 'auditStatus',
            element: 'input-validate',
            default: '3',
            isShow: false
          },
          {
            label: 'storage.outNotice.form.outBillNo',
            prop: 'outBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.outNotice.form.outDate',
            props: ['outDateStart', 'outDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.outNotice.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          {
            label: 'storage.outNotice.form.productCode',
            prop: 'productCodeList',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true,
              multiple: true
            },
            default: []
          },
          {
            label: 'storage.outNotice.form.customerCode',
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
            label: 'storage.outNotice.form.settlementCode',
            prop: 'settlementCode',
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
            },
            isShow: false
          },
          {
            label: 'storage.stock.form.noRest',
            prop: 'noRest',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            default: '1',
            attrs: {
              disabled: false,
              clearable: true
            },
            isShow: false
          },
          {
            label: 'storage.stock.form.goodsFlag',
            prop: 'goodsFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            default: '0',
            attrs: {
              disabled: false,
              clearable: true
            },
            isShow: false
          }
        ],

        mainData: {
          api: {
            search: '/api/warehouse/whOutProduct/listOutPick'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'outDate.desc, outBillNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              {
                prop: 'outBillNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.outBillNo'
              },
              {
                prop: 'outDate',
                width: '100',
                align: 'center',
                sortable: 'custom',
                label: 'storage.outNotice.list.outDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                }
              },
              {
                prop: 'preBillType',
                width: '120',
                align: 'center',
                label: 'storage.outNotice.list.preBillType',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.bizCode')
                }
              },
              {
                prop: 'preBillNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.preBillNo'
              },
              {
                prop: 'customerName',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.customerName'
              },
              {
                prop: 'warehouseName',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.warehouseName'
              },
              {
                prop: 'inBillNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.inBillNo'
              },
              {
                prop: 'purchaseLotNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.purchaseLotNo'
              },
              {
                prop: 'supplierName',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.supplierName'
              },
              {
                prop: 'productName',
                width: '100',
                sortable: 'custom',
                label: 'storage.outNotice.list.productName'
              },
              ...this.$store.state.user.mainGoodColsTxt,
              {
                prop: 'itemCount',
                width: '120',
                align: 'right',
                label: 'storage.outNotice.list.itemCount',
                format: {
                  func: 'thousands',
                  dict: 0
                }
              },
              {
                prop: 'outQuantity',
                width: '120',
                align: 'right',
                label: 'storage.outNotice.list.outQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              {
                prop: 'actualQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.outNotice.list.actualQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              {
                prop: 'productUnitCode',
                width: '90',
                align: 'center',
                label: 'storage.outNotice.list.productUnitName',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                },
                isSon: true
              },
              {
                prop: 'measurementQuantity',
                width: '120',
                align: 'right',
                label: 'storage.outNotice.list.outMeasurementQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              {
                prop: 'actualMeasurementQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.outNotice.list.actualMeasurementQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              {
                prop: 'measurementUnitCode',
                width: '90',
                align: 'center',
                sortable: 'custom',
                label: 'storage.outNotice.list.measurementUnitName',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                isSon: true
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
    // 列表是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否进行初始化查询
    initSearch: {
      type: Boolean,
      default: false
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
  mounted() {},
  methods: {
    // 列表是否支持多选
    getInitSearch() {
      if (typeof this.param.initSearch === 'boolean') {
        return this.param.initSearch
      }
      if (typeof this.initChooseParam.initSearch === 'boolean') {
        return this.initChooseParam.initSearch
      }
      return this.initSearch
    },
    // 列表是否支持多选
    getMultiple() {
      if (typeof this.param.multiple === 'boolean') {
        return this.param.multiple
      }
      if (typeof this.initChooseParam.multiple === 'boolean') {
        return this.initChooseParam.multiple
      }
      return this.multiple
    },
    // 关闭回调
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

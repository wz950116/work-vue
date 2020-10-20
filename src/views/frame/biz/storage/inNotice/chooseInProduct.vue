<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('storage.inNotice.popup.inNoticeSelect'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'storage.inNotice.form.auditStatus',
            prop: 'auditStatus',
            element: 'input-validate',
            default: '3',
            isShow: false
          },
          {
            label: 'storage.inNotice.form.inBillNo',
            prop: 'inBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.stock.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          {
            label: 'storage.stock.form.supplierCode',
            prop: 'supplierCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'storage.stock.form.deliverCode',
            prop: 'deliverCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            },
            isShow: false
          },
          {
            type: 'date',
            label: 'storage.stock.form.inDate',
            props: ['inDateFrom', 'inDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.inNotice.form.productCode',
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
            search: '/api/warehouse/inProduct/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'inDate.desc, inBillNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              {
                prop: 'inBillNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.inBillNo'
              },
              {
                prop: 'inDate',
                width: '100',
                align: 'center',
                sortable: 'custom',
                label: 'storage.inNotice.list.inDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                }
              },
              {
                prop: 'preBillType',
                width: '120',
                align: 'center',
                label: 'storage.inNotice.list.preBillType',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.bizCode')
                }
              },
              {
                prop: 'preBillNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.preBillNo'
              },
              {
                prop: 'supplierName',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.supplierName'
              },
              {
                prop: 'deliverName',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.deliverName'
              },
              {
                prop: 'warehouseName',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.warehouseName'
              },
              {
                prop: 'productName',
                width: '100',
                sortable: 'custom',
                label: 'storage.inNotice.list.productName'
              },
              ...this.$store.state.user.mainGoodColsTxtSon,
              {
                prop: 'rightFlag',
                width: '90',
                align: 'center',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.yesNo')
                },
                label: 'storage.inNotice.list.rightFlag'
              },
              {
                prop: 'itemCount',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.inNotice.list.itemCount',
                format: {
                  func: 'thousands',
                  dict: 0
                }
              },
              {
                prop: 'inQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.inNotice.list.inQuantity',
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
                label: 'storage.inNotice.list.actualQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              {
                prop: 'restQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.inNotice.list.restQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              {
                prop: 'productUnitCode',
                width: '90',
                align: 'center',
                label: 'storage.inNotice.list.productUnitCode',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                }
              },
              {
                prop: 'measurementQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.inNotice.list.inMeasurementQuantity',
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
                label: 'storage.inNotice.list.actualMeasurementQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              {
                prop: 'restMeasurementQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.inNotice.list.restMeasurementQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              {
                prop: 'measurementUnitCode',
                width: '100',
                align: 'center',
                sortable: 'custom',
                label: 'storage.inNotice.list.measurementUnitCode',
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
    // 列表是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
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
  mounted() {},
  methods: {
    // 列表是否初始化查询
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
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

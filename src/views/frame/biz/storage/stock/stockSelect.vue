<template>
  <qm-dialog-table ref='qmDialogTable' :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('storage.stock.popup.stockSelect'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'storage.stock.form.contractNos',
            prop: 'contractNos',
            element: 'base-select',
            attrs: {
              data: 'WH_IN_CONTRACT',
              clearable: true,
              multiple: true
            },
            default: []
          },
          {
            label: 'storage.stock.form.productCodeList',
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
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
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
          // {
          //   label: 'storage.stock.form.preBillType',
          //   prop: 'preBillType',
          //   element: 'base-select',
          //   list: this.$t(''),
          //   attrs: {
          //     clearable: true
          //   }
          // },
          {
            label: 'storage.stock.form.inBillNo',
            prop: 'inBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          // {
          //   label: 'storage.stock.form.deliverCode',
          //   prop: 'deliverCode',
          //   element: 'base-select',
          //   attrs: {
          //     data: 'CUST_INFO',
          //     params: {
          //       usingFlag: '1',
          //       auditStatus: '3'
          //     },
          //     clearable: true,
          //     filterable: true
          //   }
          // },
          {
            type: 'date',
            label: 'storage.stock.form.inCheckDate',
            props: ['inCheckDateStart', 'inCheckDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },

          {
            label: 'storage.stock.form.brand',
            prop: 'brand',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'storage.stock.form.spec',
            prop: 'spec',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'storage.stock.form.origin',
            prop: 'origin',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'storage.stock.form.productKeyAttr01',
            prop: 'productKeyAttr01',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'storage.stock.form.productKeyAttr02',
            prop: 'productKeyAttr02',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'storage.stock.form.productKeyAttr03',
            prop: 'productKeyAttr03',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'storage.stock.form.inType',
            prop: 'inType',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            isShow: false
          }
        ],

        mainData: {
          api: {
            search: '/api/warehouse/stockProductDetail/list'
          },
          apiData: {
            search(defaultParams) {
              return {
                ...defaultParams,
                brand: '',
                spec: '',
                origin: '',
                productKeyAttr01: '',
                productKeyAttr02: '',
                productKeyAttr03: '',
                defaultSortString: 'stockDetailNo.desc',
                contractNos: []
              }
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              {
                prop: 'inContractNo',
                width: '180',
                label: 'storage.stock.list.inContractNo'
              },
              {
                prop: 'inLotNo',
                width: '180',
                label: 'storage.stock.list.inLotNo'
              },
              {
                prop: 'inBillNo',
                width: '180',
                label: 'storage.stock.list.inBillNo'
              },
              {
                prop: 'inDate',
                width: '100',
                label: 'storage.stock.list.inDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                }
              },
              {
                prop: 'warehouseName',
                width: '180',
                label: 'storage.stock.list.warehouseName'
              },
              {
                prop: 'productCode',
                width: '180',
                label: 'storage.stock.list.productCode',
                isShow: false
              },
              {
                prop: 'productName',
                width: '180',
                label: 'storage.stock.list.productName'
              },
              ...this.$store.state.user.mainGoodColsTxt,
              ...this.$store.state.user.reserveGoodColsTxt,
              {
                prop: 'supplierName',
                width: '180',
                label: 'storage.stock.list.supplierName'
              },
              {
                prop: 'inCheckDate',
                width: '100',
                label: 'storage.stock.list.inCheckDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                }
              },
              {
                prop: 'inBillNo',
                width: '180',
                label: 'storage.stock.list.inBillNo'
              },
              {
                prop: 'stockArea',
                width: '120',
                label: 'storage.stock.list.stockArea'
              },
              {
                prop: 'stockPosition',
                width: '120',
                label: 'storage.stock.list.stockPosition'
              },
              {
                prop: 'stockNo',
                width: '120',
                label: 'storage.stock.list.stockNo'
              },
              {
                prop: 'itemCount',
                width: '120',
                align: 'right',
                label: 'storage.stock.list.itemCount'
              },
              {
                prop: 'quantity',
                width: '120',
                align: 'right',
                label: 'storage.stock.list.quantity'
              },
              // {
              //   prop: 'actualQuantity',
              //   width: '120',
              //   align: 'right',
              //   label: 'storage.stock.list.actualQuantity'
              // },
              // {
              //   prop: 'lockQuantity',
              //   width: '120',
              //   align: 'right',
              //   label: 'storage.stock.list.lockQuantity'
              // },
              {
                prop: 'restQuantity',
                width: '120',
                align: 'right',
                label: 'storage.stock.list.restQuantity'
              },
              {
                label: 'storage.stock.list.productUnitCode',
                prop: 'productUnitCode',
                width: '100',
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                }
              },
              {
                prop: 'measurementQuantity',
                width: '120',
                align: 'right',
                label: 'storage.stock.list.measurementQuantity'
              },
              // {
              //   prop: 'actualMeasurementQuantity',
              //   width: '120',
              //   align: 'right',
              //   label: 'storage.stock.list.actualMeasurementQuantity'
              // },
              // {
              //   prop: 'lockMeasurementQuantity',
              //   width: '120',
              //   align: 'right',
              //   label: 'storage.stock.list.lockMeasurementQuantity'
              // },
              {
                prop: 'restMeasurementQuantity',
                width: '120',
                align: 'right',
                label: 'storage.stock.list.restMeasurementQuantity'
              },
              {
                label: 'storage.stock.list.measurementUnitCode',
                prop: 'measurementUnitCode',
                width: '100',
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
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
      default: true
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

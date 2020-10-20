<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('storage.inNotice.popup.inProductSelect'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'storage.inNotice.form.inBillNo',
            prop: 'inBillNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
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
              disabled: false,
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
            label: 'storage.inNotice.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizDeptName',
            prop: 'bizDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizEmployeeName',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.optName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          }
        ],

        mainData: {
          api: {
            search: '/api/warehouse/inProduct/listForInvoiceClaim'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'inDate.asc, inBillNo.asc'
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
                label: 'storage.inNotice.list.inBillNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              {
                prop: 'inProductNo',
                label: 'storage.inNotice.list.inProductNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              {
                prop: 'supplierName',
                label: 'storage.inNotice.list.supplierName',
                width: 300,
                align: 'left',
                sortable: 'custom'
              },
              {
                prop: 'inDate',
                label: 'storage.inNotice.list.inDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              {
                prop: 'warehouseName',
                label: 'storage.inNotice.list.warehouseName',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              {
                prop: 'contractNo',
                label: 'storage.inNotice.list.contractNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              {
                prop: 'lotNo',
                label: 'storage.inNotice.list.lotNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              {
                prop: 'productName',
                label: 'storage.inNotice.list.productName',
                width: 100,
                align: 'left',
                sortable: 'custom'
              },
              ...this.$store.state.user.mainGoodColsTxtSon,
              {
                prop: 'measurementQuantity',
                label: 'storage.inNotice.list.measurementQuantity',
                format: {
                  func: 'weight'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              {
                prop: 'unClaimQuantity',
                label: 'storage.inNotice.list.unCliamQuantity',
                format: {
                  func: 'weight'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              {
                prop: 'measurementUnitCode',
                label: 'storage.inNotice.list.measurementUnitCode',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 业务机构
              {
                prop: 'bizOrganName',
                width: 100,
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizOrganName'
              },
              // 业务部门
              {
                prop: 'bizDeptName',
                width: 100,
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizDeptName'
              },
              // 业务员
              {
                prop: 'bizEmployeeName',
                width: 100,
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.bizEmployeeName'
              },
              // 制单人
              {
                prop: 'optEmployeeName',
                width: 100,
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.optName'
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

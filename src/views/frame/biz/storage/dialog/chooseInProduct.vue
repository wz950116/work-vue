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
            label: 'storage.inNotice.form.inBillNo',
            prop: 'inBillNo',
            element: 'input-validate',
            attrs: {
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
            type: 'date',
            label: 'storage.stock.form.inDate',
            props: ['inDateFrom', 'inDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.inNotice.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.inNotice.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
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
            search: '/api/warehouse/inProduct/listForVer'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'inDate.desc, inProductNo.desc'
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
                prop: 'inProductNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.inProductNo'
              },
              {
                prop: 'supplierName',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.supplierName'
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
                prop: 'contractNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.contractNo'
              },
              {
                prop: 'lotNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.inNotice.list.lotNo'
              },
              {
                prop: 'productName',
                width: '100',
                sortable: 'custom',
                label: 'storage.inNotice.list.productName'
              },
              ...this.$store.state.user.mainGoodColsTxt,

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
                prop: 'unVerificatQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.inNotice.list.unVerificatQuantity',
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

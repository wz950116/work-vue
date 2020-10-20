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
            label: 'storage.outNotice.form.lotNoGroup',
            prop: 'lotNoList',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            default: this.initChooseParam.lotNoGroup,
            isShow: false
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
            type: 'date',
            label: 'storage.outNotice.form.outDate',
            props: ['outDateStart', 'outDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.outNotice.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
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
            search: '/api/warehouse/whOutProduct/listProductForMakeVer'
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
              // 出库单号
              {
                prop: 'outBillNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.outBillNo'
              },
              // 出库商品编码
              {
                prop: 'outProductNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.productDetailNo'
              },
              // 客户名称
              {
                prop: 'customerName',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.customerName'
              },
              // 出库日期
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
              // 销售合同号
              {
                prop: 'contractNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.salesContractNo'
              },
              // 销售批次号
              {
                prop: 'lotNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.salesLotNo'
              },
              // 商品名称
              {
                prop: 'productName',
                width: '100',
                sortable: 'custom',
                label: 'storage.outNotice.list.productName'
              },
              ...this.$store.state.user.mainGoodColsTxt,
              // 出库计量数量
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
              // 未核销数量
              {
                prop: 'unVerificatQuantity',
                width: '120',
                align: 'right',
                label: 'storage.outNotice.list.unVerificatQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                }
              },
              // 计量单位
              {
                prop: 'measurementUnitCode',
                width: '90',
                align: 'center',
                sortable: 'custom',
                label: 'storage.outNotice.list.measurementUnitName',
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

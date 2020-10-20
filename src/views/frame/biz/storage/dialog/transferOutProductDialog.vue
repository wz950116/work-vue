<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('storage.transferOut.popup.list'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'storage.transferOut.form.transferOutBillNo',
            prop: 'transferOutBillNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.transferOut.form.transferOutDate',
            props: ['transferOutDateStart', 'transferOutDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.transferOut.form.stockDetailNo',
            prop: 'stockDetailNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.transferOut.list.productCode',
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
            label: 'storage.transferOut.form.outWarehouseCode',
            prop: 'outWarehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.transferOut.form.inWarehouseCode',
            prop: 'inWarehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.transferOut.form.outDeptCode',
            prop: 'outDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.transferOut.form.inDeptCode',
            prop: 'inDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
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
          },
          {
            prop: 'auditStatus',
            default: '3',
            isShow: false
          },
          {
            prop: 'transferInFlag',
            default: '1',
            isShow: false
          }
        ],
        mainData: {
          api: {
            search: '/api/warehouse/whTransferOutProduct/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'transferOutDate.desc, transferOutBillNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              // 单据号
              {
                label: 'storage.transferOut.list.transferOutBillNo',
                prop: 'transferOutBillNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 调出日期
              {
                label: 'storage.transferOut.list.transferOutDate',
                prop: 'transferOutDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 库存商品明细编号
              {
                label: 'storage.transferOut.list.contractNo',
                prop: 'contractNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 库存商品明细编号
              {
                label: 'storage.transferOut.list.lotNo',
                prop: 'lotNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 库存商品明细编号
              {
                label: 'storage.transferOut.list.stockDetailNo',
                prop: 'stockDetailNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 商品
              {
                label: 'storage.transferOut.list.productCode',
                prop: 'productName',
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              ...this.$store.state.user.mainGoodColsTxt,
              // 调拨出库数量
              {
                label: 'storage.transferOut.list.transferOutQuantity',
                prop: 'transferOutQuantity',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                sortable: 'custom'
              },
              // 调拨入库数量
              {
                label: 'storage.transferOut.list.transferInQuantity',
                prop: 'transferInQuantity',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                sortable: 'custom'
              },
              // 未调拨入库数量
              {
                label: 'storage.transferOut.list.transferLeftQuantity',
                prop: 'transferLeftQuantity',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                sortable: 'custom'
              },
              // 商品单位
              {
                label: 'storage.transferOut.list.productUnitCode',
                prop: 'productUnitCode',
                width: 80,
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                },
                sortable: 'custom'
              },
              // 调拨出库计量数量
              {
                label: 'storage.transferOut.list.transferOutMeasurementQty',
                prop: 'transferOutMeasurementQty',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                sortable: 'custom'
              },
              // 调拨入库计量数量
              {
                label: 'storage.transferOut.list.transferInMeasurementQty',
                prop: 'transferInMeasurementQty',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                sortable: 'custom'
              },
              // 未调拨入库计量数量
              {
                label: 'storage.transferOut.list.transferLeftMeasurementQty',
                prop: 'transferLeftMeasurementQty',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                sortable: 'custom'
              },
              // 计量单位
              {
                label: 'storage.transferOut.list.measurementUnitCode',
                prop: 'measurementUnitCode',
                width: 80,
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                sortable: 'custom'
              },
              // 库区
              {
                label: 'storage.transferOut.list.stockArea',
                prop: 'stockArea',
                width: 80,
                align: 'left',
                sortable: 'custom'
              },
              // 库位
              {
                label: 'storage.transferOut.list.stockPosition',
                prop: 'stockPosition',
                width: 80,
                align: 'left',
                sortable: 'custom'
              },
              // 仓储号
              {
                label: 'storage.transferOut.list.stockNo',
                prop: 'stockNo',
                width: 80,
                align: 'left',
                sortable: 'custom'
              },
              ...this.$store.state.user.reserveGoodColsTxt,
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

<template>
  <qm-dialog-array-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-array-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        moreShowFlg: false,
        titleName: this.$t('storage.outNotice.form.list'),
        formData: [
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
            label: 'storage.outNotice.form.outBillNo',
            prop: 'outBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
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
            label: 'storage.outNotice.form.preBillNo',
            prop: 'preBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
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
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
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
              clearable: true
            }
          }
        ],
        mainData: {
          api: {
            search: '/api/warehouse/whOutBill/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign({}, listQuery, {
                defaultSortString: 'outDate.desc, outBillNo.desc',
                data: { productCodeList: [] }
              })
              return newListQuery
            }
          },
          initSearch: true,
          table: {
            id: '',
            mergeProp: 'outProductList',
            cols: [
              {
                prop: 'auditStatus',
                width: '80',
                align: 'center',
                label: 'storage.outNotice.list.auditStatus',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.auditStatus')
                }
              },
              {
                prop: 'outBillNo',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.outBillNo'
              },
              {
                prop: 'outDate',
                width: '90',
                align: 'center',
                label: 'storage.outNotice.list.outDate',
                sortable: 'custom',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                }
              },
              {
                prop: 'outType',
                width: '90',
                align: 'center',
                label: 'storage.outNotice.list.outType',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.outType')
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
                prop: 'settlementName',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.settlementName'
              },
              {
                prop: 'currencyCode',
                width: '90',
                align: 'center',
                label: 'storage.outNotice.list.currencyCode',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.currency')
                }
              },
              {
                prop: 'warehouseName',
                width: '180',
                sortable: 'custom',
                label: 'storage.outNotice.list.warehouseName'
              },
              {
                prop: 'productName',
                width: '100',
                label: 'storage.outNotice.list.productName',
                isSon: true
              },
              ...this.$store.state.user.mainGoodColsTxtSon,
              ...this.$store.state.user.reserveGoodColsTxtSon,
              {
                prop: 'rightFlag',
                width: '90',
                align: 'center',
                format: {
                  dict: this.$t('datadict.yesNo')
                },
                label: 'storage.outNotice.list.rightFlag',
                isSon: true
              },
              {
                prop: 'itemCount',
                width: '120',
                align: 'right',
                label: 'storage.outNotice.list.itemCount',
                format: {
                  func: 'thousands',
                  dict: 0
                },
                isSon: true
              },
              {
                prop: 'outQuantity',
                width: '120',
                align: 'right',
                label: 'storage.outNotice.list.outQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                },
                isSon: true
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
                },
                isSon: true
              },
              {
                prop: 'measurementUnitCode',
                width: '90',
                align: 'center',
                label: 'storage.outNotice.list.measurementUnitName',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                isSon: true
              },
              {
                prop: 'bizOrganName',
                width: '120',
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizOrganName'
              },
              {
                prop: 'bizDeptName',
                width: '120',
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizDeptName'
              },
              {
                prop: 'bizEmployeeName',
                width: '120',
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.bizEmployeeName'
              },
              {
                prop: 'optEmployeeName',
                width: '120',
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.optName'
              }
            ]
          },

          bottomBar: {
            pagination: {
              show: true,
              layout: 'total, sizes, prev, pager, next, jumper',
              pageSizes: [20, 40, 60, 80, 100]
            }
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
  methods: {
    // 关闭回调
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

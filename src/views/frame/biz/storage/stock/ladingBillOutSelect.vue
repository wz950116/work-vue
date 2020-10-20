<template>
  <qm-dialog-array-table ref='qmDialogTable' :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-array-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('storage.ladingBillOutSelect.popup.title'),
        moreShowFlg: false,
        formData: [
          {
            label: 'storage.ladingBillOutSelect.form.productCode',
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
            label: 'storage.ladingBillOutSelect.form.ladingOutNo',
            prop: 'ladingOutNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.ladingBillOutSelect.form.ladingOutDate',
            props: ['ladingOutStartDate', 'ladingOutEndDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.ladingBillOutSelect.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          }
        ],

        mainData: {
          api: {
            search: '/api/warehouse/whLadingOutProduct/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'ladingOutDate.desc,ladingOutNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: true,
          table: {
            mergeProp: 'whLadingOutProductDtoList',
            sortable: 'custom',
            cols: [
              {
                prop: 'ladingOutNo',
                width: '200',
                align: 'left',
                sortable: 'custom',
                label: 'storage.ladingBillOutSelect.list.ladingOutNo'
              },
              {
                prop: 'ladingOutDate',
                width: '90',
                align: 'center',
                sortable: 'custom',
                label: 'storage.ladingBillOutSelect.list.ladingOutDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                }
              },
              {
                prop: 'customerName',
                width: '200',
                align: 'left',
                sortable: 'custom',
                label: 'storage.ladingBillOutSelect.list.customerName'
              },
              {
                prop: 'preBillType',
                align: 'center',
                width: '120',
                format: {
                  dict: this.$t('datadict.bizCode')
                },
                label: 'storage.ladingBillOutSelect.list.preBIllType'
              },
              {
                prop: 'preBillNo',
                width: '120',
                align: 'left',
                sortable: 'custom',
                label: 'storage.ladingBillOutSelect.list.preBillNo'
              },
              {
                prop: 'productName',
                width: '120',
                sortable: 'custom',
                label: 'storage.ladingBillOutSelect.list.productName',
                isSon: true
              },
              ...this.$store.state.user.mainGoodColsTxtSon,
              {
                prop: 'itemCount',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.ladingBillOutSelect.list.itemCount',
                format: {
                  func: 'thousands',
                  dict: 0
                },
                isSon: true
              },
              {
                prop: 'measurementQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.ladingBillOutSelect.list.measurementQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                },
                isSon: true
              },
              {
                prop: 'lastMeasurementQuantity',
                width: '120',
                align: 'right',
                sortable: 'custom',
                label: 'storage.ladingBillOutSelect.list.lastMeasurementQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                },
                isSon: true
              },
              {
                prop: 'measurementUnitCode',
                width: '120',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                label: 'storage.ladingBillOutSelect.list.measurementUnitCode',
                isSon: true
              },
              {
                prop: 'outQuantity',
                width: '120',
                sortable: 'custom',
                align: 'right',
                label: 'storage.ladingBillOutSelect.list.outQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                },
                isSon: true
              },
              {
                prop: 'lastQuantity',
                width: '120',
                sortable: 'custom',
                align: 'right',
                label: 'storage.ladingBillOutSelect.list.lastQuantity',
                format: {
                  func: 'thousands',
                  dict: 3
                },
                isSon: true
              },
              {
                prop: 'productUnitCode',
                width: '120',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                },
                label: 'storage.ladingBillOutSelect.list.productUnitCode',
                isSon: true
              },
              {
                prop: 'bizOrganName',
                width: '90',
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizOrganName'
              },
              {
                prop: 'bizDeptName',
                width: '90',
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizDeptName'
              },
              {
                prop: 'bizEmployeeName',
                width: '90',
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.bizEmployeeName'
              },
              {
                prop: 'optEmployeeName',
                width: '90',
                align: 'center',
                sortable: 'custom',
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
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

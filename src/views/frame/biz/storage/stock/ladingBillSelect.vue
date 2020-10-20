<template>
  <qm-dialog-table ref='qmDialogTable' :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('storage.ladingBillSelect.popup.title'),
        moreShowFlg: false,
        formData: [
          {
            label: 'storage.ladingBillSelect.form.productCodeList',
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
            label: 'storage.ladingBillSelect.form.ladingBillNo',
            prop: 'ladingBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.ladingBillSelect.form.ladingDate',
            props: ['ladingStartDate', 'ladingEndDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.ladingBillSelect.form.supplierCode',
            prop: 'supplierCode',
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
            search: '/api/warehouse/whLadingBillProduct/page'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'ladingDate.desc,contractNo.desc,lotNo.desc,ladingBillNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: false,
          table: {
            showCheckbox: true,
            cols: [
              {
                prop: 'contractNo',
                width: '200',
                label: 'storage.ladingBillSelect.list.contractNo'
              },
              {
                prop: 'lotNo',
                width: '200',
                label: 'storage.ladingBillSelect.list.lotNo'
              },
              {
                prop: 'ladingBillNo',
                width: '200',
                label: 'storage.ladingBillSelect.list.ladingBillNo'
              },
              {
                prop: 'ladingDate',
                width: '120',
                align: 'center',
                label: 'storage.ladingBillSelect.list.ladingDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                }
              },
              {
                prop: 'supplierName',
                width: '200',
                label: 'storage.ladingBillSelect.list.supplierName'
              },
              {
                prop: 'productName',
                width: '120',
                label: 'storage.ladingBillSelect.list.productName'
              },
              {
                prop: 'rightFlag',
                width: '120',
                label: 'storage.ladingBillSelect.list.rightFlag',
                format: {
                  dict: this.$t('datadict.yesNo')
                }
              },
              {
                prop: 'brand',
                width: '120',
                label: 'storage.ladingBillSelect.list.brand'
              },
              {
                prop: 'origin',
                width: '120',
                label: 'storage.ladingBillSelect.list.origin'
              },
              {
                prop: 'spec',
                width: '120',
                label: 'storage.ladingBillSelect.list.spec'
              },
              {
                prop: 'productKeyAttr01',
                width: '120',
                label: 'storage.ladingBillSelect.list.productKeyAttr01'
              },
              {
                prop: 'productKeyAttr02',
                width: '120',
                label: 'storage.ladingBillSelect.list.productKeyAttr02'
              },
              {
                prop: 'productKeyAttr03',
                width: '120',
                label: 'storage.ladingBillSelect.list.productKeyAttr03'
              },
              {
                prop: 'itemCount',
                width: '120',
                align: 'right',
                label: 'storage.ladingBillSelect.list.itemCount'
              },
              {
                prop: 'restMeasurementQuantity',
                width: '120',
                align: 'right',
                label: 'storage.ladingBillSelect.list.restMeasurementQuantity',
                isSon: true
              },
              {
                prop: 'measurementUnitCode',
                width: '120',
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                label: 'storage.ladingBillSelect.list.measurementUnitCode',
                isSon: true
              },
              {
                prop: 'restQuantity',
                width: '120',
                align: 'right',
                label: 'storage.ladingBillSelect.list.restQuantity',
                isSon: true
              },
              {
                prop: 'productUnitCode',
                width: '120',
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                },
                label: 'storage.ladingBillSelect.list.productUnitCode',
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
              },
              // 选择返回的批次商品编码
              {
                prop: 'lotProductDetailCode',
                isShow: false
              },
              // 选择返回的批次商品编码
              {
                prop: 'preBillProductDetailCode',
                isShow: false
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

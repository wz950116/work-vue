<template>
  <qm-dialog-table ref='qmDialogTable' :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('invoice.invoiceSelect.popup.title'),
        formData: [
          {
            label: 'invoice.foreignInvoiceReceive.form.receiveNo',
            prop: 'invoiceForeignNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'invoice.foreignInvoiceReceive.form.customerName',
            prop: 'customerName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'invoice.foreignInvoiceReceive.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'invoice.foreignInvoiceReceive.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'invoice.foreignInvoiceReceive.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.foreignInvoiceReceive.form.invoiceType',
            prop: 'invoiceType',
            default: 'P',
            element: 'base-select',
            list: this.$t('datadict.foreignInvoiceCommonType'),
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'invoice.foreignInvoiceReceive.form.receiveDate',
            props: ['receiveDateStart', 'receiveDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.foreignInvoiceReceive.form.receiveUserCode',
            prop: 'receiveUserCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_STAFF',
              clearable: true
            }
          },
          // 发票方向 收票
          {
            prop: 'invoiceDirection',
            default: 'TAKE',
            isShow: false
          }
        ],

        mainData: {
          api: {
            search: '/api/invoice/foreign/invoiceSelectList'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'invoiceDate.desc,invoiceForeignNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: true,
          table: {
            cols: [
              {
                label: 'invoice.foreignInvoiceReceive.list.receiveNo',
                prop: 'invoiceForeignNo',
                width: '200',
                align: 'left'
              },
              {
                label: 'invoice.foreignInvoiceReceive.list.customerName',
                prop: 'customerName',
                width: '200',
                align: 'left'
              },
              {
                label: 'invoice.foreignInvoiceReceive.list.lotNo',
                prop: 'lotNo',
                width: '200',
                align: 'left'
              },
              {
                label: 'invoice.foreignInvoiceReceive.list.invoiceNo',
                prop: 'invoiceNo',
                width: '200',
                align: 'left'
              },
              {
                label: 'invoice.foreignInvoiceReceive.list.invoiceDate',
                prop: 'invoiceDate',
                width: '90',
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.list.invoiceType',
                prop: 'invoiceType',
                width: '80',
                align: 'center',
                format: {
                  dict: this.$t('datadict.foreignInvoiceType')
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.list.invoiceAmount',
                prop: 'invoiceAmount',
                width: '120',
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.list.currency',
                prop: 'currency',
                width: '80',
                align: 'center',
                format: {
                  dict: this.$t('datadict.currency')
                }
              },
              {
                label: 'invoice.foreignInvoiceReceive.list.diffAmount',
                prop: 'diffAmount',
                width: '120',
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              {
                prop: 'bizOrganName',
                width: '80',
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizOrganName'
              },
              {
                prop: 'bizDeptName',
                width: '80',
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizDeptName'
              },
              {
                prop: 'bizEmployeeName',
                width: '80',
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.bizEmployeeName'
              },
              {
                prop: 'optEmployeeName',
                width: '80',
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
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

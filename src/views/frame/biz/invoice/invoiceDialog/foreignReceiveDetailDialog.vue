<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.initChooseParam.invoiceDirection.value === 'TAKE' ? this.$t('invoice.foreignInvoiceReceive.popup.list') : this.$t('invoice.foreignInvoiceMake.popup.list'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'invoice.foreignInvoiceReceive.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.foreignInvoiceReceive.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.foreignInvoiceReceive.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              disabled: false,
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
            label: 'invoice.foreignInvoiceReceive.list.productCode',
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
          },
          {
            label: 'invoice.foreignInvoiceReceive.form.invoiceDirection',
            prop: 'invoiceDirection',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            },
            isShow: false
          }
        ],
        mainData: {
          api: {
            search: '/api/invoice/foreignDetail/listForVer'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'invoiceDate.asc, receiveNo.asc'
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
                label: 'invoice.foreignInvoiceReceive.list.receiveNo',
                prop: 'invoiceForeignNo',
                width: '150',
                align: 'left'
              },
              // 发票号
              {
                label: 'invoice.foreignInvoiceReceive.list.invoiceNo',
                prop: 'invoiceNo',
                width: '150',
                align: 'left'
              },
              // 发票日期
              {
                label: 'invoice.foreignInvoiceReceive.list.invoiceDate',
                prop: 'invoiceDate',
                width: '150',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                },
                align: 'center'
              },
              // 供应商
              {
                label: 'invoice.foreignInvoiceReceive.list.customerName',
                prop: 'customerName',
                width: '150',
                align: 'left'
              },
              // 批次号
              {
                label: this.initChooseParam.invoiceDirection.value === 'TAKE' ? 'invoice.foreignInvoiceReceive.list.lotNo' : 'invoice.foreignInvoiceMake.list.lotNo',
                prop: 'lotNo',
                width: 150,
                align: 'left'
              },
              // 发票类型
              {
                label: 'invoice.foreignInvoiceReceive.list.invoiceType',
                prop: 'invoiceType',
                width: '100',
                align: 'center',
                format: {
                  dict: this.$t('datadict.foreignInvoiceType')
                }
              },
              // 商品
              {
                label: 'invoice.foreignInvoiceReceive.list.productCode',
                prop: 'productName',
                width: '150'
              },
              // 物资属性
              ...this.$store.state.user.mainGoodCols,
              // 毛重
              {
                label: 'invoice.foreignInvoiceReceive.list.grossWeight',
                prop: 'grossWeight',
                width: '150',
                format: {
                  func: 'weight'
                },
                align: 'right'
              },
              //净重
              {
                label: 'invoice.foreignInvoiceReceive.list.netWeight',
                prop: 'netWeight',
                width: '150',
                format: {
                  func: 'weight'
                },
                align: 'right'
              },
              // 干重
              {
                label: 'invoice.foreignInvoiceReceive.list.dryWeight',
                prop: 'dryWeight',
                width: '150',
                format: {
                  func: 'weight'
                },
                align: 'right'
              },
              // 发票价格
              {
                label: 'invoice.foreignInvoiceReceive.list.invoicePrice',
                prop: 'invoicePrice',
                width: '150',
                format: {
                  func: 'price'
                },
                align: 'right'
              },
              // 发票金额
              {
                label: 'invoice.foreignInvoiceReceive.list.invoiceAmount',
                prop: 'invoiceAmount',
                width: '150',
                format: {
                  func: 'money'
                },
                align: 'right'
              },
              //未核销数量
              {
                label: 'invoice.foreignInvoiceReceive.list.unVerificatQuantity',
                prop: 'unVerificatQuantity',
                width: '150',
                center: 'right',
                format: {
                  func: 'weight'
                }
              },
              // 核销状态
              {
                label: 'invoice.foreignInvoiceReceive.list.verificatStatus',
                prop: 'verificatStatus',
                width: '150',
                center: 'right',
                format: {
                  dict: this.$t('datadict.verificatStatus')
                }
              },
              // 币种
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
    // 列表是否初始化查询
    getInitSearch() {
      console.log(this.initChooseParam, '1234')
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

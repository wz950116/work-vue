<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('invoice.domesticInvoiceApply.popup.list'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            type: 'date',
            label: 'invoice.domesticInvoiceApply.form.applyDate',
            props: ['applyDateStart', 'applyDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.domesticInvoiceApply.form.applyNo',
            prop: 'applyNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceApply.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
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
            label: 'invoice.domesticInvoiceApply.form.latestInvoiceDate',
            props: ['latestInvoiceDateStart', 'latestInvoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: []
          },
          {
            label: 'invoice.domesticInvoiceApply.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceApply.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceApply.list.productCode',
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
            prop: 'confirmStatusNe',
            default: '2',
            isShow: false
          },
          {
            prop: 'auditStatus',
            default: '3',
            isShow: false
          }
        ],
        mainData: {
          api: {
            search: '/api/invoice/domApplyDetail/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'applyDate.asc, applyNo.asc'
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
                label: 'invoice.domesticInvoiceApply.list.applyNo',
                prop: 'applyNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 申请日期
              {
                label: 'invoice.domesticInvoiceApply.list.applyDate',
                prop: 'applyDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 客户
              {
                label: 'invoice.domesticInvoiceApply.list.customerName',
                prop: 'customerName',
                width: 300,
                align: 'left',
                sortable: 'custom'
              },
              // 合同号
              {
                label: 'invoice.domesticInvoiceApply.list.contractNo',
                prop: 'contractNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 批次号
              {
                label: 'invoice.domesticInvoiceApply.list.lotNo',
                prop: 'lotNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 商品
              {
                label: 'invoice.domesticInvoiceApply.list.productName',
                prop: 'productName',
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 物资属性
              ...this.$store.state.user.mainGoodColsTxt,
              // 发票名称
              {
                label: 'invoice.domesticInvoiceApply.list.invoiceName',
                prop: 'invoiceName',
                width: 100,
                align: 'left',
                sortable: 'custom'
              },
              // 申请数量
              {
                label: 'invoice.domesticInvoiceApply.list.applyQuantity',
                prop: 'applyQuantity',
                format: {
                  func: 'weight'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 含税价格
              {
                label: 'invoice.domesticInvoiceApply.list.includeTaxPrice',
                prop: 'includeTaxPrice',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 含税金额
              {
                label: 'invoice.domesticInvoiceApply.list.includeTaxAmount',
                prop: 'includeTaxAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 税率
              {
                label: 'invoice.domesticInvoiceApply.list.taxRate',
                prop: 'taxRate',
                format: {
                  func: 'taxrate'
                },
                width: 100,
                align: 'right',
                sortable: 'custom'
              },
              // 税额
              {
                label: 'invoice.domesticInvoiceApply.list.taxAmount',
                prop: 'taxAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 不含税价格
              {
                label: 'invoice.domesticInvoiceApply.list.excludeTaxPrice',
                prop: 'excludeTaxPrice',
                format: {
                  func: 'exprice'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 不含税金额
              {
                label: 'invoice.domesticInvoiceApply.list.excludeTaxAmount',
                prop: 'excludeTaxAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right',
                sortable: 'custom'
              },
              // 币种
              {
                label: 'invoice.domesticInvoiceApply.list.currency',
                prop: 'currency',
                format: {
                  dict: this.$t('datadict.currency')
                },
                width: 80,
                align: 'center',
                sortable: 'custom'
              },
              // 确认数量
              {
                label: 'invoice.domesticInvoiceApply.list.confirmQuantity',
                prop: 'confirmQuantity',
                format: {
                  func: 'weight'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 确认状态
              {
                label: 'invoice.domesticInvoiceApply.list.confirmStatus',
                prop: 'confirmStatus',
                format: {
                  dict: this.$t('datadict.confirmStatus')
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

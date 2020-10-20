<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'feeInvoiceAllotCheck',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            feeInvoiceNo: '',
            invoiceNo: '',
            customerNo: '',
            productCode: '',
            invoiceDateStart: '',
            invoiceDateEnd: '',
            feeType: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            allotStatusNe: '2',
            auditStatus: '3'
          },
          defaultSortString: 'invoiceDate.desc, feeInvoiceDetailNo.desc'
        },
        formData: [
          // 发票日期
          {
            type: 'date',
            label: 'fee.feeInvoiceAllot.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          // 费用单据号
          {
            label: 'fee.feeInvoiceAllot.form.feeInvoiceNo',
            prop: 'feeInvoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          // 费用明细单据号
          {
            label: 'fee.feeInvoiceAllot.form.feeInvoiceDetailNo',
            prop: 'feeInvoiceDetailNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          // 发票号
          {
            label: 'fee.feeInvoiceAllot.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          // 服务商
          {
            label: 'fee.feeInvoiceAllot.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              clearable: true
            }
          },
          // 商品名称
          {
            label: 'fee.feeInvoiceAllot.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              params: {},
              filterable: true,
              clearable: true
            }
          },
          // 费用类型
          {
            label: 'fee.feeInvoiceAllot.form.feeType',
            prop: 'feeType',
            element: 'base-select',
            attrs: {
              data: 'DD_FEE_TYPE',
              params: {},
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
        ]
      },

      mainData: {
        api: {
          search: '/api/fee/feeInvoiceDetail/list'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        initSearch: true,
        isColset: true,
        isTopBar: true,
        topBar: [
          // 费用发票分摊
          {
            name: 'next',
            permitName: ['feeInvoiceAllot'],
            type: 'route',
            i18n: 'fee.feeInvoiceAllot.btn.feeInvoiceAllot',
            routeInfo(currentRow) {
              return {
                name: 'feeInvoiceAllotAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.feeInvoiceDetailNo,
                  preBillType: 'FEE_INVOICE_ALLOT_CHECK',
                  back: 'feeInvoiceAllotCheck'
                }
              }
            }
          }
        ],
        table: {
          id: '',
          sortable: 'custom',
          cols: [
            // 费用单据号
            {
              label: 'fee.feeInvoiceAllot.list.feeInvoiceNo',
              prop: 'feeInvoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 费用明细单据号
            {
              label: 'fee.feeInvoiceAllot.list.feeInvoiceDetailNo',
              prop: 'feeInvoiceDetailNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 费用发票号
            {
              label: 'fee.feeInvoiceAllot.list.invoiceNo',
              prop: 'invoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 服务商名称
            {
              label: 'fee.feeInvoiceAllot.list.customerNo',
              prop: 'customerName',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 发票日期
            {
              label: 'fee.feeInvoiceAllot.list.invoiceDate',
              prop: 'invoiceDate',
              width: 100,
              align: 'center',
              sortable: 'custom',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            // 费用类型
            {
              label: 'fee.feeInvoiceAllot.list.feeType',
              prop: 'feeName',
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 商品名称
            {
              label: 'fee.feeInvoiceAllot.list.productCode',
              prop: 'productName',
              width: 100,
              align: 'left',
              sortable: 'custom'
            },
            // 发票数量
            {
              label: 'fee.feeInvoiceAllot.list.invoiceQuantity',
              prop: 'invoiceQuantity',
              format: {
                func: 'num'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票价格(不含税)
            {
              label: 'fee.feeInvoiceAllot.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              format: {
                func: 'exprice'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票金额(不含税)
            {
              label: 'fee.feeInvoiceAllot.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 税额
            {
              label: 'fee.feeInvoiceAllot.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 税率
            {
              label: 'fee.feeInvoiceAllot.list.taxRate',
              prop: 'taxRate',
              format: {
                func: 'taxrate'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票价格(含税)
            {
              label: 'fee.feeInvoiceAllot.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票金额(含税)
            {
              label: 'fee.feeInvoiceAllot.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'fee.feeInvoiceAllot.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 分摊状态
            {
              label: 'fee.feeInvoiceAllot.list.allotStatus',
              prop: 'allotStatus',
              format: {
                dict: this.$t('datadict.allotStatus')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 分摊金额
            {
              label: 'fee.feeInvoice.list.allotAmount',
              prop: 'allotAmount',
              format: {
                func: 'money'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 剩余分摊金额
            {
              label: 'fee.feeInvoiceAllot.list.canAllotAmount',
              prop: 'canAllotAmount',
              format: {
                func: 'money'
              },
              width: 100,
              align: 'right',
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
        },

        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  }
}
</script>

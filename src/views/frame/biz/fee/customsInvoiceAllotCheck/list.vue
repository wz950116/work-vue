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
  name: 'customsInvoiceAllotCheck',
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
            customsInvoiceNo: '',
            customsInvoiceDetailNo: '',
            invoiceNo: '',
            customsNo: '',
            invoiceDateStart: '',
            invoiceDateEnd: '',
            customsInvoiceType: '',
            contractNo: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            auditStatus: '3',
            allotStatusNe: '2'
          },
          defaultSortString: 'invoiceDate.desc, customsInvoiceDetailNo.desc'
        },
        formData: [
          // 发票日期
          {
            type: 'date',
            label: 'fee.customsInvoiceAllot.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          // 海关发票单据号
          {
            label: 'fee.customsInvoiceAllot.form.customsInvoiceNo',
            prop: 'customsInvoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          // 海关发票明细单据号
          {
            label: 'fee.customsInvoiceAllot.form.customsInvoiceDetailNo',
            prop: 'customsInvoiceDetailNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          // 发票号
          {
            label: 'fee.customsInvoiceAllot.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          // 海关
          {
            label: 'fee.customsInvoiceAllot.form.customsNo',
            prop: 'customsNo',
            element: 'base-select',
            attrs: {
              data: 'DD_CUSTOMS',
              params: {},
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          // 科目
          {
            label: 'fee.customsInvoiceAllot.form.customsInvoiceType',
            prop: 'customsInvoiceType',
            element: 'base-select',
            list: this.$t('datadict.feeTypeCustoms'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          // 采购合同号
          {
            label: 'fee.customsInvoiceAllot.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
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
          search: '/api/fee/customsInvoiceDetail/list'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          // 费用发票分摊
          {
            name: 'next',
            permitName: ['customsInvoiceAllot'],
            type: 'route',
            i18n: 'fee.customsInvoiceAllot.btn.customsInvoiceAllot',
            routeInfo(currentRow) {
              return {
                name: 'customsInvoiceAllotAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.customsInvoiceDetailNo,
                  preBillType: 'CUSTOMS_INVOICE_ALLOT_CHECK',
                  back: 'customsInvoiceAllotCheck'
                }
              }
            }
          }
        ],

        isColset: true,
        table: {
          id: '',
          sortable: 'custom',
          cols: [
            // 海关发票单据号
            {
              label: 'fee.customsInvoiceAllot.list.customsInvoiceNo',
              prop: 'customsInvoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },

            // 发票号
            {
              label: 'fee.customsInvoiceAllot.list.invoiceNo',
              prop: 'invoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 海关发票详细单据号
            {
              label: 'fee.customsInvoiceAllot.list.customsInvoiceDetailNo',
              prop: 'customsInvoiceDetailNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 发票日期
            {
              label: 'fee.customsInvoiceAllot.list.invoiceDate',
              prop: 'invoiceDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 商品
            {
              label: 'fee.customsInvoiceAllot.list.productCode',
              prop: 'productName',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 海关
            {
              label: 'fee.customsInvoiceAllot.list.customsNo',
              prop: 'customsName',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 科目
            {
              label: 'fee.customsInvoiceAllot.list.customsInvoiceType',
              prop: 'customsInvoiceType',
              format: {
                dict: this.$t('datadict.feeTypeCustoms')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 采购合同号
            {
              label: 'fee.customsInvoiceAllot.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 税额
            {
              label: 'fee.customsInvoiceAllot.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 完税价格
            {
              label: 'fee.customsInvoiceAllot.list.dutyPayingValue',
              prop: 'dutyPayingValue',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 发票数量
            {
              label: 'fee.customsInvoiceAllot.list.invoiceQuantity',
              prop: 'invoiceQuantity',
              format: {
                func: 'num'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 税率
            {
              label: 'fee.customsInvoiceAllot.list.taxRate',
              prop: 'taxRate',
              format: {
                func: 'taxrate'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'fee.customsInvoiceAllot.list.currency',
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
              prop: 'allotStatus',
              width: '80',
              align: 'center',
              label: 'fee.customsInvoiceAllot.list.allotStatus',
              format: {
                dict: this.$t('datadict.allotStatus')
              }
            },
            // 分摊数量
            {
              label: 'fee.customsInvoiceAllot.list.allotQuantity',
              prop: 'allotQuantity',
              format: {
                func: 'num'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },

            // 剩余分摊数量
            {
              label: 'fee.customsInvoiceAllot.list.remainAllotQuantity',
              prop: 'remainAllotQuantity',
              format: {
                func: 'num'
              },
              width: 120,
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

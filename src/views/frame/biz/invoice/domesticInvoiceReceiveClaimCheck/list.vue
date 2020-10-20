<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'domesticInvoiceReceiveClaimCheck',
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
            receiveNo: '',
            invoiceDateStart: '',
            invoiceDateEnd: '',
            invoiceNo: '',
            customerNo: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            claimStatus: ''
          },
          defaultSortString: 'invoiceDate.desc, receiveNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'invoice.domesticInvoiceReceive.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.domesticInvoiceReceive.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceReceive.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.domesticInvoiceReceive.form.customerNo',
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
            label: 'invoice.domesticInvoiceReceive.form.claimStatus',
            prop: 'claimStatus',
            element: 'base-select',
            list: this.$t('datadict.claimStatus'),
            attrs: {
              disabled: false,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/invoice/domesticReceive/claimCheck'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        initSearch: true,
        isColset: true,
        table: {
          id: '',
          sortable: 'custom',
          mergeProp: 'invoiceDomReceDetailDtoList',
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              align: 'center',
              label: 'biz.lbl.auditStatus',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            // 单据号
            {
              label: 'invoice.domesticInvoiceReceive.list.receiveNo',
              prop: 'receiveNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 发票号
            {
              label: 'invoice.domesticInvoiceReceive.list.invoiceNo',
              prop: 'invoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 发票日期
            {
              label: 'invoice.domesticInvoiceReceive.list.invoiceDate',
              prop: 'invoiceDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 供应商
            {
              label: 'invoice.domesticInvoiceReceive.list.customerName',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 商品
            {
              label: 'invoice.domesticInvoiceReceive.list.productCode',
              prop: 'productName',
              width: 150,
              align: 'left',
              sortable: 'custom',
              isSon: true
            },
            // 发票数量
            {
              label: 'invoice.domesticInvoiceReceive.list.invoiceQuantity',
              prop: 'invoiceQuantity',
              format: {
                func: 'num'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 不含税金额
            {
              label: 'invoice.domesticInvoiceReceive.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 税额
            {
              label: 'invoice.domesticInvoiceReceive.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 含税金额
            {
              label: 'invoice.domesticInvoiceReceive.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 币种
            {
              label: 'invoice.domesticInvoiceReceive.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom',
              isSon: true
            },
            // 认领数量
            {
              label: 'invoice.domesticInvoiceReceive.list.claimQuantity',
              prop: 'claimQuantity',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom',
              isSon: true
            },
            // 认领状态
            {
              label: 'invoice.domesticInvoiceReceive.list.claimStatus',
              prop: 'claimStatus',
              format: {
                dict: this.$t('datadict.claimStatus')
              },
              width: 100,
              align: 'center',
              sortable: 'custom',
              isSon: true
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

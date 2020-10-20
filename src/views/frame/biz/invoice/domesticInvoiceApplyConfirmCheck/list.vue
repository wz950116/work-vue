<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template> -->
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'domesticInvoiceApplyConfirmCheck',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {},
          defaultSortString: 'applyDate.desc, applyNo.desc'
        },
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
        ]
      },

      mainData: {
        api: {
          search: '/api/invoice/domApplyDetail/confirmCheck'
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
          // 开票确认(内贸)
          {
            name: 'next',
            permitName: ['domesticInvoiceConfirm'],
            type: 'route',
            i18n: 'invoice.domesticInvoiceApply.btn.domesticInvoiceConfirm',
            routeInfo(currentRow) {
              return {
                name: 'domesticInvoiceConfirmAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.applyNo,
                  preBillType: 'DOMESTIC_INVOICE_APPLY_CONFIRM_CHECK',
                  back: 'domesticInvoiceApplyConfirmCheck'
                }
              }
            }
          }
        ],
        table: {
          id: '',
          sortable: 'custom',
          mergeProp: 'invoiceDomApplyDetailDtoList',
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
              sortable: 'custom',
              isSon: true
            },
            // 合同号
            {
              label: 'invoice.domesticInvoiceApply.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left',
              sortable: 'custom',
              isSon: true
            },
            // 批次号
            {
              label: 'invoice.domesticInvoiceApply.list.lotNo',
              prop: 'lotNo',
              width: 200,
              align: 'left',
              sortable: 'custom',
              isSon: true
            },
            // 商品
            {
              label: 'invoice.domesticInvoiceApply.list.productName',
              prop: 'productName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              isSon: true
            },
            // 发票名称
            {
              label: 'invoice.domesticInvoiceApply.list.invoiceName',
              prop: 'invoiceName',
              width: 100,
              align: 'left',
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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
              sortable: 'custom',
              isSon: true
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

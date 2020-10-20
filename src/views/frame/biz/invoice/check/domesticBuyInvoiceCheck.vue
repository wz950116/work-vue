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
  name: 'domesticBuyInvoiceCheck',
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
            contractNo: '',
            signDateStart: '',
            signDateEnd: '',
            headlineCode: '',
            supplierCode: '',
            productCode: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'signDate.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'invoice.check.domesticBuyInvoiceCheck.form.signDate',
            props: ['signDateStart', 'signDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.check.domesticBuyInvoiceCheck.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'invoice.check.domesticBuyInvoiceCheck.form.supplierCode',
            prop: 'supplierCode',
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
            label: 'invoice.check.domesticBuyInvoiceCheck.form.productCode',
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
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/invoice/check/domesticBuyInvoiceCheck'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: false,
        topBar: [],

        isColset: true,
        table: {
          id: '',
          sortable: 'custom',
          cols: [
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.lotNo',
              prop: 'lotNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.headlineNames',
              prop: 'headlineNames',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.supplierNames',
              prop: 'supplierNames',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.signDate',
              prop: 'signDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.productName',
              prop: 'productName',
              width: 100,
              align: 'left',
              sortable: 'custom'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.lotMeasurementQuantity',
              prop: 'lotMeasurementQuantity',
              format: {
                func: 'weight'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.measurementUnitCode',
              prop: 'measurementUnitCode',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.lotIncludeTaxAmount',
              prop: 'lotIncludeTaxAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.noticeMeasurementQuantity',
              prop: 'noticeMeasurementQuantity',
              format: {
                func: 'weight'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.checkMeasurementQuantity',
              prop: 'checkMeasurementQuantity',
              format: {
                func: 'weight'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.hasInvoiceQuantity',
              prop: 'hasInvoiceQuantity',
              format: {
                func: 'weight'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.hasInvoiceAmount',
              prop: 'hasInvoiceAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            {
              label: 'invoice.check.domesticBuyInvoiceCheck.list.noneInvoiceQuantity',
              prop: 'noneInvoiceQuantity',
              format: {
                func: 'weight'
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

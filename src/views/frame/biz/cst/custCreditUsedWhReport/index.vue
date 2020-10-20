<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'custCreditUsedWhReport',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            custCode: '',
            warehouseCode: '',
            productCode: '',
            optEmployeeCode: '',
            createDateStart: '',
            createDateEnd: ''
          },
          defaultSortString: 'createDate.desc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            type: 'date',
            label: 'cst.custCreditUsedWhReport.form.createDate',
            props: ['createDateStart', 'createDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'cst.custCreditUsedWhReport.form.custCode',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '3',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'cst.custCreditUsedWhReport.form.warehouse',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'cst.custCreditUsedWhReport.form.productCode',
            prop: 'productCodeList',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'cst.custCreditUsedWhReport.form.optEmployeeCode',
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
          search: '/api/cust/creditUsedWh/list',
          export: '/api/cust/creditUsedWh/list'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'export',
            getParam() {
              return {
                autoWidth: true
              }
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title + '_index',
          sortable: 'custom',
          cols: [
            {
              label: 'cst.custCreditUsedWhReport.list.custName',
              prop: 'custName',
              width: '200',
              align: 'left'
            },
            {
              label: 'cst.custCreditUsedWhReport.list.warehouse',
              prop: 'warehouseName',
              width: '200',
              align: 'left'
            },
            {
              prop: 'productName',
              width: '120',
              align: 'left',
              label: 'cst.custCreditUsedWhReport.list.productName'
            },
            {
              label: 'cst.custCreditUsedWhReport.list.usedType',
              prop: 'usedType',
              width: '120',
              format: {
                dict: this.$t('datadict.creditUsedType')
              }
            },
            {
              prop: 'usedAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              },
              label: 'cst.custCreditUsedWhReport.list.usedAmount'
            },
            {
              prop: 'usedQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'cst.custCreditUsedWhReport.list.usedQuantity'
            },
            {
              label: 'cst.custCreditUsedWhReport.list.optEmployeeName',
              prop: 'optEmployeeName',
              width: '85',
              align: 'center'
            },
            {
              label: 'cst.custCreditUsedWhReport.list.createDate',
              prop: 'createDate',
              width: '120',
              align: 'right'
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

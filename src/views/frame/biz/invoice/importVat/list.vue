<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'importVat',
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
            importVatNo: '',
            invoiceNo: '',
            customHouseCode: '',
            invoiceDate: '',
            contractNo: '',
            receiveDate: '',
            receiveUserCode: ''
          },
          defaultSortString: 'id.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'invoice.importVat.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.importVat.form.importVatNo',
            prop: 'importVatNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'invoice.importVat.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'invoice.importVat.form.customHouseCode',
            prop: 'customHouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_CUSTOMS',
              clearable: true
            }
          },
          {
            label: 'invoice.importVat.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              filterable: true,
              data: 'FUNC_ORG',
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
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          cancelAudit: '/api/invoice/importVat/cancelAudit',
          search: '/api/invoice/importVat/list',
          doDelete: '/api/invoice/importVat/remove'
        },
        apiData: {
          search(param) {
            return param.id
          },
          doDelete(param) {
            return param.id
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'importVatAdd',
                params: {
                  type: 'add',
                  back: 'importVat'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'importVatUpdate',
                params: {
                  type: 'update',
                  id: currentRow.importVatNo,
                  back: 'importVat'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/invoice/importVat/validatedApi',
                data: row.importVatNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.importVatNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'importVatView',
                params: {
                  type: 'view',
                  id: currentRow.importVatNo,
                  back: 'importVat'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.importVatNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.importVatNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.importVatNo,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.importVatNo // 变量值
              }
            }
          },
          {
            name: 'cancelAudit',
            msg: this.$t('biz.msg.disableCancelAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            getParam(currentRow) {
              return {
                billNum: currentRow.importVatNo
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh',
            $refs: this.$refs,
            validate() {}
          }
        ],

        isColset: true,
        table: {
          id: '',
          sortable: 'custom',
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
            {
              label: 'invoice.importVat.list.importVatNo',
              prop: 'importVatNo',
              width: '200',
              align: 'left',
              sortable: 'custom'
            },
            {
              label: 'invoice.importVat.list.invoiceNo',
              prop: 'invoiceNo',
              width: '200',
              align: 'left',
              sortable: 'custom'
            },
            {
              label: 'invoice.importVat.list.customHouseName',
              prop: 'customHouseName',
              width: '120',
              align: 'left',
              sortable: 'custom'
            },
            {
              label: 'invoice.importVat.list.invoiceDate',
              prop: 'invoiceDate',
              width: '100',
              align: 'center',
              sortable: 'custom',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'invoice.importVat.list.taxAmount',
              prop: 'taxAmount',
              width: '80',
              align: 'right',
              sortable: 'custom',
              format: {
                func: 'money'
              }
            },
            {
              label: 'invoice.importVat.list.currency',
              prop: 'currency',
              width: '80',
              align: 'center',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'invoice.importVat.list.contractNo',
              prop: 'contractNo',
              width: '200',
              align: 'left',
              sortable: 'custom'
            },
            {
              label: 'invoice.importVat.list.dueDate',
              prop: 'dueDate',
              width: '100',
              align: 'center',
              sortable: 'custom',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'bizOrganName',
              width: '100',
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizOrganName'
            },
            {
              prop: 'bizDeptName',
              width: '100',
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

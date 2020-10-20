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
  name: 'foreignInvoiceMake',
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
            invoiceForeignNo: '',
            customerName: '',
            lotNo: '',
            invoiceNo: '',
            invoiceDate: '',
            invoiceType: '',
            receiveUserCode: ''
          },
          defaultSortString: 'invoiceDate.desc,invoiceForeignNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'invoice.foreignInvoiceMake.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'invoice.foreignInvoiceMake.form.makeNo',
            prop: 'invoiceForeignNo',
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
            label: 'invoice.foreignInvoiceMake.form.customerName',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'invoice.foreignInvoiceMake.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'invoice.foreignInvoiceMake.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'invoice.foreignInvoiceMake.form.invoiceType',
            prop: 'invoiceType',
            element: 'base-select',
            list: this.$t('datadict.foreignInvoiceType'),
            attrs: {
              clearable: true
            }
          },
          // 发票方向 开票
          {
            prop: 'invoiceDirection',
            default: 'MAKE',
            isShow: false
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
          cancelAudit: '/api/invoice/foreign/cancelAudit',
          search: '/api/invoice/foreign/list',
          doDelete: '/api/invoice/foreign/remove'
        },
        apiData: {
          search(param) {
            return param.code
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
            permitName: ['addProvisional'],
            iconName: '线性-新增',
            i18n: 'biz.btn.addProvisional',
            type: 'route',
            routeInfo() {
              return {
                name: 'makeProvisionalAdd',
                params: {
                  type: 'add',
                  back: 'foreignInvoiceMake'
                }
              }
            }
          },
          {
            name: 'add',
            permitName: ['addAdjust'],
            iconName: '线性-新增',
            i18n: 'biz.btn.addAdjust',
            type: 'route',
            routeInfo() {
              return {
                name: 'makeAdjustAdd',
                params: {
                  type: 'add',
                  back: 'foreignInvoiceMake'
                }
              }
            }
          },
          {
            name: 'add',
            permitName: ['addProFinal'],
            iconName: '线性-新增',
            i18n: 'biz.btn.addProFinal',
            type: 'route',
            routeInfo() {
              return {
                name: 'makeProFinalAdd',
                params: {
                  type: 'add',
                  back: 'foreignInvoiceMake'
                }
              }
            }
          },
          {
            name: 'add',
            permitName: ['addFinal'],
            iconName: '线性-新增',
            i18n: 'biz.btn.addFinal',
            type: 'route',
            routeInfo() {
              return {
                name: 'makeFinalAdd',
                params: {
                  type: 'add',
                  back: 'foreignInvoiceMake'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: currentRow.invoiceType === 'P' ? 'makeProvisionalUpdate' : currentRow.invoiceType === 'A' ? 'makeAdjustUpdate' : currentRow.invoiceType === 'PF' ? 'makeProFinalUpdate' : 'makeFinalUpdate',
                params: {
                  type: 'update',
                  id: currentRow.invoiceForeignNo,
                  back: 'foreignInvoiceMake'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/invoice/foreign/validatedApi',
                data: row.invoiceForeignNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.invoiceForeignNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: currentRow.invoiceType === 'P' ? 'makeProvisionalView' : currentRow.invoiceType === 'A' ? 'makeAdjustView' : currentRow.invoiceType === 'PF' ? 'makeProFinalView' : 'makeFinalView',
                params: {
                  type: 'view',
                  id: currentRow.invoiceForeignNo,
                  back: 'foreignInvoiceMake'
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
                  value: currentRow.invoiceForeignNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.invoiceForeignNo // 变量值
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
                uk: currentRow.invoiceForeignNo,
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
                uk: currentRow.invoiceForeignNo // 变量值
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
                billNum: currentRow.invoiceForeignNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.invoiceForeignNo
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
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
              label: 'invoice.foreignInvoiceMake.list.makeNo',
              prop: 'invoiceForeignNo',
              width: '200',
              align: 'left'
            },
            {
              label: 'invoice.foreignInvoiceMake.list.customerName',
              prop: 'customerName',
              width: '300',
              align: 'left'
            },
            {
              label: 'invoice.foreignInvoiceMake.list.lotNo',
              width: '200',
              prop: 'lotNo'
            },
            {
              label: 'invoice.foreignInvoiceMake.list.invoiceNo',
              width: '200',
              prop: 'invoiceNo'
            },
            {
              label: 'invoice.foreignInvoiceMake.list.invoiceDate',
              prop: 'invoiceDate',
              width: '100',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'invoice.foreignInvoiceMake.list.invoiceType',
              prop: 'invoiceType',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.foreignInvoiceType')
              }
            },
            {
              label: 'invoice.foreignInvoiceMake.list.prevInvoiceNo',
              prop: 'prevInvoiceNo',
              width: '200',
              align: 'left'
            },
            {
              label: 'invoice.foreignInvoiceMake.list.invoiceAmount',
              prop: 'invoiceAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'invoice.foreignInvoiceMake.list.currency',
              prop: 'currency',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'invoice.foreignInvoiceMake.list.diffAmount',
              prop: 'diffAmount',
              width: '120',
              align: 'right',
              format: {
                func: 'money'
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

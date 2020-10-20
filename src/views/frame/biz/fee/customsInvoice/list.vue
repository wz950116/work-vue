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
  name: 'customsInvoice',
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
            invoiceNo: '',
            customsNo: '',
            invoiceDateStart: '',
            invoiceDateEnd: '',
            customsInvoiceType: '',
            contractNo: '',
            dueDateStart: '',
            dueDateEnd: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'invoiceDate.desc, customsInvoiceNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'fee.customsInvoice.form.invoiceDate',
            props: ['invoiceDateStart', 'invoiceDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.customsInvoice.form.customsInvoiceNo',
            prop: 'customsInvoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.customsInvoice.form.invoiceNo',
            prop: 'invoiceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.customsInvoice.form.customsNo',
            prop: 'customsNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3',
                typeCode: 'B'
              },
              filterable: true,
              clearable: true,
              disabled: false
            }
          },
          {
            label: 'fee.customsInvoice.form.customsInvoiceType',
            prop: 'customsInvoiceType',
            element: 'base-select',
            list: this.$t('datadict.feeTypeCustoms'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.customsInvoice.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'fee.customsInvoice.form.dueDate',
            props: ['dueDateStart', 'dueDateEnd'],
            attrs: {
              pickStart: 'dateStartBeforeLv2',
              pickEnd: 'dateEndBeforeLv2',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: []
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
          cancelAudit: '/api/fee/customsInvoice/cancelAudit',
          search: '/api/fee/customsInvoice/list',
          doDelete: '/api/fee/customsInvoice/remove'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          // 新增
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'customsInvoiceAdd',
                params: {
                  type: 'add',
                  back: 'customsInvoice'
                }
              }
            }
          },
          // 修改
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'customsInvoiceUpdate',
                params: {
                  type: 'update',
                  id: currentRow.customsInvoiceNo,
                  back: 'customsInvoice'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fee/customsInvoice/validatedApi',
                data: row.customsInvoiceNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.customsInvoiceNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'customsInvoiceView',
                params: {
                  type: 'view',
                  id: currentRow.customsInvoiceNo,
                  back: 'customsInvoice'
                }
              }
            }
          },
          // 提交审批
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
                  value: currentRow.customsInvoiceNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.customsInvoiceNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          // 审批历史
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.customsInvoiceNo,
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
                uk: currentRow.customsInvoiceNo // 变量值
              }
            }
          },
          // 弃审
          {
            name: 'cancelAudit',
            msg: this.$t('biz.msg.disableCancelAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            getParam(currentRow) {
              return {
                billNum: currentRow.customsInvoiceNo
              }
            }
          },
          // 导出
          {
            name: 'export'
          },
          // 刷新
          {
            name: 'refresh'
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                customsInvoiceNo: currentRow.customsInvoiceNo
              }
            }
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
            // 单据号
            {
              label: 'fee.customsInvoice.list.customsInvoiceNo',
              prop: 'customsInvoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 发票号
            {
              label: 'fee.customsInvoice.list.invoiceNo',
              prop: 'invoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 发票日期
            {
              label: 'fee.customsInvoice.list.invoiceDate',
              prop: 'invoiceDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 海关
            {
              label: 'fee.customsInvoice.list.customsName',
              prop: 'customerName',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 科目
            {
              label: 'fee.customsInvoice.list.customsInvoiceType',
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
              label: 'fee.customsInvoice.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 税额
            {
              label: 'fee.customsInvoice.list.taxAmount',
              prop: 'taxAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'fee.customsInvoice.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 缴款期限
            {
              label: 'fee.customsInvoice.list.dueDate',
              prop: 'dueDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
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

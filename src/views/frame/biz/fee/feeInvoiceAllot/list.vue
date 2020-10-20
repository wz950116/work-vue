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
  name: 'feeInvoiceAllot',
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
            allotNo: '',
            invoiceNo: '',
            customerNo: '',
            allotDateStart: '',
            allotDateEnd: '',
            feeType: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'invoiceDate.desc, allotNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'fee.feeInvoiceAllot.form.allotDate',
            props: ['allotDateStart', 'allotDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.feeInvoiceAllot.form.allotNo',
            prop: 'allotNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.feeInvoiceAllot.form.invoiceNo',
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
          search: '/api/fee/invoiceAllot/list',
          doDelete: '/api/fee/invoiceAllot/remove',

          cancelAudit: '/api/fee/invoiceAllot/cancelAudit'
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
                name: 'feeInvoiceAllotAdd',
                params: {
                  type: 'add',
                  back: 'feeInvoiceAllot'
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
                name: 'feeInvoiceAllotUpdate',
                params: {
                  type: 'update',
                  id: currentRow.allotNo,
                  back: 'feeInvoiceAllot'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fee/invoiceAllot/validatedApi',
                data: row.allotNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.allotNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'feeInvoiceAllotView',
                params: {
                  type: 'view',
                  id: currentRow.allotNo,
                  back: 'feeInvoiceAllot'
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
                  value: currentRow.allotNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.allotNo // 变量值
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
                uk: currentRow.allotNo,
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
                uk: currentRow.allotNo // 变量值
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
                billNum: currentRow.allotNo
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
                allotNo: currentRow.allotNo
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
              label: 'fee.feeInvoiceAllot.list.allotNo',
              prop: 'allotNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 海关发票号
            {
              label: 'fee.feeInvoiceAllot.list.invoiceNo',
              prop: 'invoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 费用发票单据号
            {
              label: 'fee.feeInvoiceAllot.list.feeInvoiceNo',
              prop: 'feeInvoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 费用发票单据详细号
            {
              label: 'fee.feeInvoiceAllot.list.feeInvoiceDetailNo',
              prop: 'feeInvoiceDetailNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 分摊日期
            {
              label: 'fee.feeInvoiceAllot.list.allotDate',
              prop: 'allotDate',
              width: 100,
              align: 'center',
              sortable: 'custom',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            // 服务商
            {
              label: 'fee.feeInvoiceAllot.list.customerNo',
              prop: 'customerName',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 费用类型
            {
              label: 'fee.feeInvoiceAllot.list.feeType',
              prop: 'feeName',
              width: 100,
              align: 'center',
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

            // 分摊数量
            {
              label: 'fee.feeInvoiceAllot.list.allotQuantity',
              prop: 'allotQuantity',
              format: {
                func: 'num'
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

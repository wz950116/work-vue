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
  name: 'customsInvoiceAllot',
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
            customsNo: '',
            allotDateStart: '',
            allotDateEnd: '',
            customsInvoiceType: '',
            contractNo: '',
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
            label: 'fee.customsInvoiceAllot.form.allotDate',
            props: ['allotDateStart', 'allotDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.customsInvoiceAllot.form.allotNo',
            prop: 'allotNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.customsInvoiceAllot.form.invoiceNo',
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
          search: '/api/fee/customsInvoiceAllot/list',
          doDelete: '/api/fee/customsInvoiceAllot/remove',

          cancelAudit: '/api/fee/customsInvoiceAllot/cancelAudit'
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
                name: 'customsInvoiceAllotAdd',
                params: {
                  type: 'add',
                  back: 'customsInvoiceAllot'
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
                name: 'customsInvoiceAllotUpdate',
                params: {
                  type: 'update',
                  id: currentRow.allotNo,
                  back: 'customsInvoiceAllot'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fee/customsInvoiceAllot/validatedApi',
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
                name: 'customsInvoiceAllotView',
                params: {
                  type: 'view',
                  id: currentRow.allotNo,
                  back: 'customsInvoiceAllot'
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
              label: 'fee.customsInvoiceAllot.list.allotNo',
              prop: 'allotNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 海关发票号
            {
              label: 'fee.customsInvoiceAllot.list.invoiceNo',
              prop: 'invoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 海关发票单据号
            {
              label: 'fee.customsInvoiceAllot.list.customsInvoiceNo',
              prop: 'customsInvoiceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 海关发票单据详细号
            {
              label: 'fee.customsInvoiceAllot.list.customsInvoiceDetailNo',
              prop: 'customsInvoiceDetailNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 分摊日期
            {
              label: 'fee.customsInvoiceAllot.list.allotDate',
              prop: 'allotDate',
              width: 100,
              align: 'center',
              sortable: 'custom',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
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
              width: 100,
              align: 'center',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.feeTypeCustoms')
              }
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

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
  name: 'lcConfirm',
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
            confirmNo: '',
            letterCreditNo: '',
            issueDateStart: '',
            issueDateEnd: '',
            customerNo: '',
            contractNo: '',
            lcType: '',
            dueDateStart: '',
            dueDateEnd: '',
            useFlag: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'issueDate.desc, confirmNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'lc.lcConfirm.form.issueDate',
            props: ['issueDateStart', 'issueDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'lc.lcConfirm.form.confirmNo',
            prop: 'confirmNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcConfirm.form.letterCreditNo',
            prop: 'letterCreditNo',
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
            label: 'lc.lcConfirm.form.customerNo',
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
            label: 'lc.lcConfirm.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcConfirm.form.lcType',
            prop: 'lcType',
            element: 'base-select',
            list: this.$t('datadict.letterCreditType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'lc.lcConfirm.form.dueDate',
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
            label: 'lc.lcConfirm.form.useFlag',
            prop: 'useFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
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
          cancelAudit: '/api/lc/confirm/cancelAudit',
          search: '/api/lc/confirm/list',
          doDelete: '/api/lc/confirm/remove'
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
                name: 'lcConfirmAdd',
                params: {
                  type: 'add',
                  back: 'lcConfirm'
                }
              }
            }
          },
          // 修改
          {
            name: 'update',
            type: 'route',
            validateApi(row) {
              return {
                url: '/api/lc/confirm/validatedApi',
                data: row.confirmNo
              }
            },
            routeInfo(currentRow) {
              return {
                name: 'lcConfirmUpdate',
                params: {
                  type: 'update',
                  id: currentRow.confirmNo,
                  back: 'lcConfirm'
                }
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.confirmNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'lcConfirmView',
                params: {
                  type: 'view',
                  id: currentRow.confirmNo,
                  back: 'lcConfirm'
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
                  value: currentRow.confirmNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.confirmNo // 变量值
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
                uk: currentRow.confirmNo,
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
                uk: currentRow.confirmNo // 变量值
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
                billNum: currentRow.confirmNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.confirmNo
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
              prop: 'confirmNo',
              label: 'lc.lcConfirm.list.confirmNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 信用证号
            {
              prop: 'letterCreditNo',
              label: 'lc.lcConfirm.list.letterCreditNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 信用证日期
            {
              prop: 'issueDate',
              label: 'lc.lcConfirm.list.issueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 申请单号
            {
              prop: 'applyNo',
              label: 'lc.lcConfirm.list.applyNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 客户
            {
              prop: 'customerName',
              label: 'lc.lcConfirm.list.customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 合同号
            {
              prop: 'contractNo',
              label: 'lc.lcConfirm.list.contractNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 信用证金额
            {
              prop: 'letterCreditAmount',
              label: 'lc.lcConfirm.list.letterCreditAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'lc.lcConfirm.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 信用证类型
            {
              label: 'lc.lcConfirm.list.lcType',
              prop: 'lcType',
              format: {
                dict: this.$t('datadict.letterCreditType')
              },
              width: 120,
              align: 'center',
              sortable: 'custom'
            },
            // 远期天数
            {
              label: 'lc.lcConfirm.list.usanceDays',
              prop: 'usanceDays',
              format: {
                func: 'num'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 到期日
            {
              prop: 'dueDate',
              label: 'lc.lcConfirm.list.dueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 已使用金额
            {
              prop: 'usedAmount',
              label: 'lc.lcConfirm.list.usedAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 使用状态
            {
              label: 'lc.lcConfirm.list.useStatus',
              prop: 'useStatus',
              format: {
                dict: this.$t('datadict.useStatus')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 是否使用
            {
              label: 'lc.lcConfirm.list.useFlag',
              prop: 'useFlag',
              format: {
                dict: this.$t('datadict.yesNo')
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

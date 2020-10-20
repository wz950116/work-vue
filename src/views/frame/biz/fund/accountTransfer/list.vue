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
  name: 'accountTransfer',
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
            accountTransferNo: '',
            accountTransferDateStart: '',
            accountTransferDateEnd: '',
            outOrganCode: '',
            outBankCode: '',
            outBankAccountCode: '',
            inOrganCode: '',
            inBankCode: '',
            inBankAccountCode: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'accountTransferDate.desc, accountTransferNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'fund.accountTransfer.form.accountTransferDate',
            props: ['accountTransferDateStart', 'accountTransferDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fund.accountTransfer.form.accountTransferNo',
            prop: 'accountTransferNo',
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
              clearable: true
            }
          },
          {
            label: 'fund.accountTransfer.form.outOrganCode',
            prop: 'outOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.accountTransfer.form.outBankCode',
            prop: 'outBankCode',
            element: 'base-select',
            attrs: {
              data: 'DD_BANK',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.accountTransfer.form.outBankAccountCode',
            prop: 'outBankAccountCode',
            element: 'base-select',
            attrs: {
              data: 'DD_ORGAN_BANK_ACCOUNT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.accountTransfer.form.inOrganCode',
            prop: 'inOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.accountTransfer.form.inBankCode',
            prop: 'inBankCode',
            element: 'base-select',
            attrs: {
              data: 'DD_BANK',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.accountTransfer.form.inBankAccountCode',
            prop: 'inBankAccountCode',
            element: 'base-select',
            attrs: {
              data: 'DD_ORGAN_BANK_ACCOUNT',
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
          cancelAudit: '/api/fund/accountTransfer/cancelAudit',
          search: '/api/fund/accountTransfer/list',
          doDelete: '/api/fund/accountTransfer/remove'
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
                name: 'accountTransferAdd',
                params: {
                  type: 'add',
                  back: 'accountTransfer'
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
                name: 'accountTransferUpdate',
                params: {
                  type: 'update',
                  id: currentRow.accountTransferNo,
                  back: 'accountTransfer'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fund/accountTransfer/validatedApi',
                data: row.accountTransferNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.accountTransferNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'accountTransferView',
                params: {
                  type: 'view',
                  id: currentRow.accountTransferNo,
                  back: 'accountTransfer'
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
                  value: currentRow.accountTransferNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.accountTransferNo // 变量值
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
                uk: currentRow.accountTransferNo,
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
                uk: currentRow.accountTransferNo // 变量值
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
                billNum: currentRow.accountTransferNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.accountTransferNo
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
              label: 'fund.accountTransfer.list.accountTransferNo',
              prop: 'accountTransferNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 转账日期
            {
              label: 'fund.accountTransfer.list.accountTransferDate',
              prop: 'accountTransferDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 转出机构
            {
              label: 'fund.accountTransfer.list.outOrganName',
              prop: 'outOrganName',
              width: 100,
              align: 'left',
              sortable: 'custom'
            },
            // 转出银行
            {
              label: 'fund.accountTransfer.list.outBankName',
              prop: 'outBankName',
              width: 100,
              align: 'left',
              sortable: 'custom'
            },
            // 转出帐号
            {
              label: 'fund.accountTransfer.list.outBankAccountNo',
              prop: 'outBankAccountNo',
              width: 150,
              align: 'left',
              sortable: 'custom'
            },
            // 转账金额
            {
              label: 'fund.accountTransfer.list.accountTransferAmount',
              prop: 'accountTransferAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'fund.accountTransfer.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 转入机构
            {
              label: 'fund.accountTransfer.list.inOrganName',
              prop: 'inOrganName',
              width: 100,
              align: 'left',
              sortable: 'custom'
            },
            // 转入银行
            {
              label: 'fund.accountTransfer.list.inBankName',
              prop: 'inBankName',
              width: 100,
              align: 'left',
              sortable: 'custom'
            },
            // 转入帐号
            {
              label: 'fund.accountTransfer.list.inBankAccountNo',
              prop: 'inBankAccountNo',
              width: 150,
              align: 'left',
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

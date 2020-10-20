<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if='true||$route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)'>
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'lcApply',
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
            applyNo: '',
            applyDateStart: '',
            applyDateEnd: '',
            contractNo: '',
            customerNo: '',
            lcType: '',
            confirmFlag: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'applyDate.desc, applyNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'lc.lcApply.form.applyDate',
            props: ['applyDateStart', 'applyDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'lc.lcApply.form.applyNo',
            prop: 'applyNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcApply.form.contractNo',
            prop: 'contractNo',
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
            label: 'lc.lcApply.form.customerNo',
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
            label: 'lc.lcApply.form.lcType',
            prop: 'lcType',
            element: 'base-select',
            list: this.$t('datadict.letterCreditType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcApply.form.confirmFlag',
            prop: 'confirmFlag',
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
          cancelAudit: '/api/lc/apply/cancelAudit',
          search: '/api/lc/apply/list',
          doDelete: '/api/lc/apply/remove'
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
                name: 'lcApplyAdd',
                params: {
                  type: 'add',
                  back: 'lcApply'
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
                url: '/api/lc/apply/validatedApi',
                data: row.applyNo
              }
            },
            routeInfo(currentRow) {
              return {
                name: 'lcApplyUpdate',
                params: {
                  type: 'update',
                  id: currentRow.applyNo,
                  back: 'lcApply'
                }
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.applyNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'lcApplyView',
                params: {
                  type: 'view',
                  id: currentRow.applyNo,
                  back: 'lcApply'
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
                  value: currentRow.applyNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.applyNo // 变量值
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
                uk: currentRow.applyNo,
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
                uk: currentRow.applyNo // 变量值
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
                billNum: currentRow.applyNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.applyNo
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
          // 开信用证确认
          {
            msg: this.$t('lc.lcApply.msg.lcConfirm'),
            name: 'next',
            permitName: ['lcConfirm'],
            type: 'route',
            i18n: 'lc.lcApply.btn.lcConfirm',
            validate(currentRow) {
              return currentRow.auditStatus === '3' && currentRow.confirmFlag === '0'
            },
            routeInfo(currentRow) {
              return {
                name: 'lcConfirmAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.applyNo,
                  preBillType: 'LC_APPLY',
                  back: 'lcApply'
                }
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
              label: 'lc.lcApply.list.applyNo',
              prop: 'applyNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 申请日期
            {
              label: 'lc.lcApply.list.applyDate',
              prop: 'applyDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 供应商
            {
              label: 'lc.lcApply.list.customerName',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 合同号
            {
              label: 'lc.lcApply.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 申请金额
            {
              label: 'lc.lcApply.list.letterCreditAmount',
              prop: 'letterCreditAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'lc.lcApply.list.currency',
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
              label: 'lc.lcApply.list.lcType',
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
              label: 'lc.lcApply.list.usanceDays',
              prop: 'usanceDays',
              format: {
                func: 'num'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 确认Flag
            {
              label: 'lc.lcApply.list.confirmFlag',
              prop: 'confirmFlag',
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

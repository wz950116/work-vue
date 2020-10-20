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
  name: 'lcNegotiate',
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
            negotiateNo: '',
            letterCreditNo: '',
            negotiateDateStart: '',
            negotiateDateEnd: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'negotiateDate.desc, negotiateNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'lc.lcNegotiate.form.negotiateDate',
            props: ['negotiateDateStart', 'negotiateDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'lc.lcNegotiate.form.negotiateNo',
            prop: 'negotiateNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcNegotiate.form.letterCreditNo',
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
          cancelAudit: '/api/lc/negotiate/cancelAudit',
          search: '/api/lc/negotiate/list',
          doDelete: '/api/lc/negotiate/remove'
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
                name: 'lcNegotiateAdd',
                params: {
                  type: 'add',
                  back: 'lcNegotiate'
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
                url: '/api/lc/negotiate/validatedApi',
                data: row.negotiateNo
              }
            },
            routeInfo(currentRow) {
              return {
                name: 'lcNegotiateUpdate',
                params: {
                  type: 'update',
                  id: currentRow.negotiateNo,
                  back: 'lcNegotiate'
                }
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.negotiateNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'lcNegotiateView',
                params: {
                  type: 'view',
                  id: currentRow.negotiateNo,
                  back: 'lcNegotiate'
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
                  value: currentRow.negotiateNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.negotiateNo // 变量值
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
                uk: currentRow.negotiateNo,
                moduleCode: this.moduleCode
              }
            }
          },
          // 审批历史
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.negotiateNo // 变量值
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
                billNum: currentRow.negotiateNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.negotiateNo
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
            // 议付单号
            {
              prop: 'negotiateNo',
              label: 'lc.lcNegotiate.list.negotiateNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 信用证号
            {
              prop: 'letterCreditNo',
              label: 'lc.lcNegotiate.list.letterCreditNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 议付日期
            {
              prop: 'negotiateDate',
              label: 'lc.lcNegotiate.list.negotiateDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 信用证金额
            {
              prop: 'letterCreditAmount',
              label: 'lc.lcNegotiate.list.letterCreditAmount',
              width: 120,
              align: 'right',
              sortable: 'custom',
              format: {
                func: 'money'
              }
            },
            // 议付行
            {
              prop: 'negoBank',
              label: 'lc.lcNegotiate.list.negoBank',
              width: 120,
              align: 'left',
              sortable: 'custom'
            },
            // 议付利息
            {
              prop: 'negotiateInterest',
              label: 'lc.lcNegotiate.list.negotiateInterest',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 议付手续费
            {
              prop: 'negotiateServiceFee',
              label: 'lc.lcNegotiate.list.negotiateServiceFee',
              format: {
                func: 'money'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 实付议付金额
            {
              prop: 'negotiateAmount',
              label: 'lc.lcNegotiate.list.negotiateAmount',
              format: {
                func: 'money'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'lc.lcNegotiate.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 账号编码
            {
              label: 'lc.lcNegotiate.list.bankAccountCode',
              prop: 'bankAccountCode',
              width: 100,
              align: 'left',
              sortable: 'custom'
            },
            // 银行名称
            {
              label: 'lc.lcNegotiate.list.bankName',
              prop: 'bankName',
              width: 120,
              align: 'left',
              sortable: 'custom'
            },
            // 备注
            {
              label: 'lc.lcNegotiate.list.remark',
              prop: 'remark',
              width: 120,
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

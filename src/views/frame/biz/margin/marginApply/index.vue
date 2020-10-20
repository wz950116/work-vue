<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>
<script>
export default {
  name: 'marginApply',
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
            applyNo: '',
            applyDateStart: '',
            applyDateEnd: '',
            customerNo: '',
            applyType: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            confirmStatus: ''
          },
          defaultSortString: 'applyDate.desc,applyNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'margin.marginApply.form.applyDate',
            props: ['applyDateStart', 'applyDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'margin.marginApply.form.applyNo',
            prop: 'applyNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'margin.marginApply.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '12',
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
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
            label: 'margin.marginApply.form.applyType',
            prop: 'applyType',
            element: 'base-select',
            list: this.$t('datadict.marginApplyType'),
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
          },
          {
            label: 'margin.marginApply.form.confirmStatus',
            prop: 'confirmStatus',
            element: 'base-select',
            list: this.$t('datadict.confirmStatus'),
            attrs: {
              disabled: false,
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          cancelAudit: '/api/margin/marginApply/cancelAudit',
          search: '/api/margin/marginApply/list',
          export: '/api/margin/marginApply/export',
          doDelete: '/api/margin/marginApply/remove'
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
          {
            name: 'add',
            type: 'route',
            $refs: this.$refs,
            routeInfo() {
              return {
                name: 'marginApplyAdd',
                params: {
                  type: 'add',
                  back: 'marginApply'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'marginApplyUpdate',
                params: {
                  type: 'update',
                  id: currentRow.applyNo,
                  back: 'marginApply'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/margin/marginApply/validatedApi',
                data: row.applyNo
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
                name: 'marginApplyView',
                params: {
                  type: 'view',
                  id: currentRow.applyNo,
                  back: 'marginApply'
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
                  value: this.title + ' 单据号: ' + currentRow.applyNo // 变量值
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
                uk: currentRow.applyNo,
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
              label: 'margin.marginApply.list.applyNo',
              prop: 'applyNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 申请日期
            {
              label: 'margin.marginApply.list.applyDate',
              prop: 'applyDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 客户
            {
              label: 'margin.marginApply.list.customerNo',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 申请类型
            {
              label: 'margin.marginApply.list.applyType',
              prop: 'applyType',
              format: {
                dict: this.$t('datadict.marginApplyType')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 申请金额
            {
              label: 'margin.marginApply.list.applyAmount',
              prop: 'applyAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'margin.marginApply.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 最迟付款日期
            {
              label: 'margin.marginApply.list.latestPaymentDate',
              prop: 'latestPaymentDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 120,
              align: 'center',
              sortable: 'custom'
            },
            // 确认状态
            {
              label: 'margin.marginApply.list.confirmStatus',
              prop: 'confirmStatus',
              format: {
                dict: this.$t('datadict.confirmStatus')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 确认金额
            {
              label: 'margin.marginApply.list.confirmAmount',
              prop: 'confirmAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
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
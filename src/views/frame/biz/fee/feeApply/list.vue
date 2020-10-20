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
  name: 'feeApply',
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
            customerNo: '',
            applyType: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            confirmStatus: ''
          },
          defaultSortString: 'applyDate.desc, applyNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'fee.feeApplyInfo.form.applyDate',
            props: ['applyDateStart', 'applyDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.feeApplyInfo.form.applyNo',
            prop: 'applyNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.feeApplyInfo.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
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
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.feeApplyInfo.form.applyType',
            prop: 'applyType',
            element: 'base-select',
            list: this.$t('datadict.fundApplyType'),
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
            label: 'fee.feeApplyInfo.form.confirmStatus',
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
          cancelAudit: '/api/fee/feeApply/cancelAudit',
          search: '/api/fee/feeApply/page',
          doDelete: '/api/fee/feeApply/remove'
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
                name: 'feeApplyAdd',
                params: {
                  type: 'add',
                  back: 'feeApply'
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
                name: 'feeApplyUpdate',
                params: {
                  type: 'update',
                  id: currentRow.applyNo,
                  back: 'feeApply'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fee/feeApply/validated',
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
                name: 'feeApplyView',
                params: {
                  type: 'view',
                  id: currentRow.applyNo,
                  back: 'feeApply'
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
                applyNo: currentRow.applyNo
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
              label: 'fee.feeApplyInfo.list.applyNo',
              prop: 'applyNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 申请日期
            {
              label: 'fee.feeApplyInfo.list.applyDate',
              prop: 'applyDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 结算单位
            {
              label: 'fee.feeApplyInfo.list.customerNo',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 申请类型
            {
              label: 'fee.feeApplyInfo.list.applyType',
              prop: 'applyType',
              format: {
                dict: this.$t('datadict.feeApplyType')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 申请金额
            {
              label: 'fee.feeApplyInfo.list.applyAmount',
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
              label: 'fee.feeApplyInfo.list.currency',
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
              label: 'fee.feeApplyInfo.list.latestPaymentDate',
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
              label: 'fee.feeApplyInfo.list.confirmStatus',
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
              label: 'fee.feeApplyInfo.list.confirmAmount',
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

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
  name: 'fundReceive',
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
            receiveNo: '',
            receiveDateStart: '',
            receiveDateEnd: '',
            customerNo: '',
            receiveType: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            claimStatus: ''
          },
          defaultSortString: 'receiveDate.desc, receiveNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'fund.fundReceive.form.receiveDate',
            props: ['receiveDateStart', 'receiveDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fund.fundReceive.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.fundReceive.form.customerNo',
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
            label: 'fund.fundReceive.form.receiveType',
            prop: 'receiveType',
            element: 'base-select',
            list: this.$t('datadict.settlementType'),
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
            label: 'fund.fundReceive.form.claimStatus',
            prop: 'claimStatus',
            element: 'base-select',
            list: this.$t('datadict.claimStatus'),
            attrs: {
              disabled: false,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          cancelAudit: '/api/fund/receive/cancelAudit',
          search: '/api/fund/receive/list',
          doDelete: '/api/fund/receive/remove'
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
                name: 'fundReceiveAdd',
                params: {
                  type: 'add',
                  back: 'fundReceive'
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
                name: 'fundReceiveUpdate',
                params: {
                  type: 'update',
                  id: currentRow.receiveNo,
                  back: 'fundReceive'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fund/receive/validatedApi',
                data: row.receiveNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.receiveNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'fundReceiveView',
                params: {
                  type: 'view',
                  id: currentRow.receiveNo,
                  back: 'fundReceive'
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
                  value: currentRow.receiveNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.receiveNo // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          // 撤回审核
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.receiveNo,
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
                uk: currentRow.receiveNo // 变量值
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
                billNum: currentRow.receiveNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.receiveNo
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
          // 收款认领
          {
            msg: this.$t('fund.fundReceive.msg.fundClaim'),
            name: 'next',
            permitName: ['fundClaim'],
            type: 'route',
            i18n: 'fund.fundReceive.btn.fundClaim',
            validate(currentRow) {
              return currentRow.auditStatus === '3' && currentRow.claimStatus !== '2'
            },
            routeInfo(currentRow) {
              return {
                name: 'fundClaimAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.receiveNo,
                  preBillType: 'FUND_RECEIVE',
                  back: 'fundReceive'
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
              prop: 'receiveNo',
              label: 'fund.fundReceive.list.receiveNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 收款日期
            {
              prop: 'receiveDate',
              label: 'fund.fundReceive.list.receiveDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 客户
            {
              prop: 'customerName',
              label: 'fund.fundReceive.list.customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 收款方式
            {
              label: 'fund.fundReceive.list.receiveType',
              prop: 'receiveType',
              format: {
                dict: this.$t('datadict.settlementType')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 收款金额
            {
              prop: 'receiveAmount',
              label: 'fund.fundReceive.list.receiveAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'fund.fundReceive.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 认领状态
            {
              label: 'fund.fundReceive.list.claimStatus',
              prop: 'claimStatus',
              format: {
                dict: this.$t('datadict.claimStatus')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 认领金额
            {
              prop: 'claimAmount',
              label: 'fund.fundReceive.list.claimAmount',
              format: {
                func: 'money'
              },
              width: 120,
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

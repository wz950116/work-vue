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
  name: 'fundApply',
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
            label: 'fund.fundApply.form.applyDate',
            props: ['applyDateStart', 'applyDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fund.fundApply.form.applyNo',
            prop: 'applyNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.fundApply.form.customerNo',
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
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.fundApply.form.applyType',
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
            label: 'fund.fundApply.form.confirmStatus',
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
          cancelAudit: '/api/fund/apply/cancelAudit',
          search: '/api/fund/apply/list',
          doDelete: '/api/fund/apply/remove'
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
                name: 'fundApplyAdd',
                params: {
                  type: 'add',
                  back: 'fundApply'
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
                name: 'fundApplyUpdate',
                params: {
                  type: 'update',
                  id: currentRow.applyNo,
                  back: 'fundApply'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fund/apply/validatedApi',
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
                name: 'fundApplyView',
                params: {
                  type: 'view',
                  id: currentRow.applyNo,
                  back: 'fundApply'
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
          {
            name: 'more',
            i18n: 'biz.btn.generateBill',
            list: [
              // 付款确认
              {
                msg: this.$t('fund.fundApply.msg.fundConfirm'),
                name: 'next',
                permitName: ['fundConfirm'],
                type: 'route',
                i18n: 'fund.fundApply.btn.fundConfirm',
                validate(currentRow) {
                  return currentRow.confirmStatus !== '2' && currentRow.auditStatus === '3'
                },
                routeInfo(currentRow) {
                  return {
                    name: 'fundConfirmAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.applyNo,
                      preBillType: 'FUND_APPLY',
                      back: 'fundApply'
                    }
                  }
                }
              },
              // 预付款转货款
              {
                msg: this.$t('fund.fundApply.msg.advanceApplyTransfer'),
                name: 'next',
                permitName: ['advanceApplyTransfer'],
                type: 'route',
                i18n: 'fund.fundApply.btn.advanceApplyTransfer',
                validate(currentRow) {
                  return currentRow.applyType === 'A' && currentRow.auditStatus === '3' && currentRow.confirmStatus !== '0' && currentRow.useStatus !== '2'
                },
                routeInfo(currentRow) {
                  return {
                    name: 'advanceApplyTransferAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.applyNo,
                      preBillType: 'FUND_APPLY',
                      back: 'fundApply'
                    }
                  }
                }
              }
            ]
          }

          // 收款认领（退预付款）
          // {
          //   msg: this.$t('fund.fundApply.msg.fundClaim'),
          //   name: 'next',
          //   permitName: ['fundClaim'],
          //   type: 'route',
          //   i18n: 'fund.fundApply.btn.fundClaim',
          //   validate(currentRow) {
          //     return (
          //       currentRow.applyType === 'A' &&
          //       currentRow.auditStatus === '3' &&
          //       currentRow.confirmStatus !== '0' &&
          //       currentRow.useStatus !== '2'
          //     )
          //   },
          //   routeInfo(currentRow) {
          //     return {
          //       name: 'fundClaimAdd',
          //       params: {
          //         type: 'add',
          //         preBillNo: currentRow.applyNo,
          //         preBillType: 'FUND_APPLY',
          //         back: 'fundApply'
          //       }
          //     }
          //   }
          // }
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
              label: 'fund.fundApply.list.applyNo',
              prop: 'applyNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 申请日期
            {
              label: 'fund.fundApply.list.applyDate',
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
              label: 'fund.fundApply.list.customerName',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 申请类型
            {
              label: 'fund.fundApply.list.applyType',
              prop: 'applyType',
              format: {
                dict: this.$t('datadict.fundApplyType')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 申请金额
            {
              label: 'fund.fundApply.list.applyAmount',
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
              label: 'fund.fundApply.list.currency',
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
              label: 'fund.fundApply.list.latestPaymentDate',
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
              label: 'fund.fundApply.list.confirmStatus',
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
              label: 'fund.fundApply.list.confirmAmount',
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

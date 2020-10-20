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
  name: 'fundClaim',
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
            claimNo: '',
            claimDateStart: '',
            claimDateEnd: '',
            customerNo: '',
            claimType: '',
            receiveNo: '',
            receiveType: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'claimDate.desc, claimNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'fund.fundClaim.form.claimDate',
            props: ['claimDateStart', 'claimDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fund.fundClaim.form.claimNo',
            prop: 'claimNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.fundClaim.form.customerNo',
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
            label: 'fund.fundClaim.form.claimType',
            prop: 'claimType',
            element: 'base-select',
            list: this.$t('datadict.fundClaimType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.fundClaim.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.fundClaim.form.receiveType',
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
          }
        ]
      },

      mainData: {
        api: {
          cancelAudit: '/api/fund/claim/cancelAudit',
          search: '/api/fund/claim/list',
          doDelete: '/api/fund/claim/remove'
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
                name: 'fundClaimAdd',
                params: {
                  type: 'add',
                  back: 'fundClaim'
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
                name: 'fundClaimUpdate',
                params: {
                  type: 'update',
                  id: currentRow.claimNo,
                  back: 'fundClaim'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/fund/claim/validatedApi',
                data: row.claimNo
              }
            }
          },
          // 删除
          {
            name: 'remove',
            getParam(param) {
              return param.claimNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'fundClaimView',
                params: {
                  type: 'view',
                  id: currentRow.claimNo,
                  back: 'fundClaim'
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
                  value: currentRow.claimNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + ' 单据号: ' + currentRow.claimNo // 变量值
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
                uk: currentRow.claimNo,
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
                uk: currentRow.claimNo // 变量值
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
                billNum: currentRow.claimNo
              }
            }
          },
          // 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                billNo: currentRow.claimNo
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
              // 预收款转货款
              {
                msg: this.$t('fund.fundClaim.msg.advanceClaimTransfer'),
                name: 'next',
                permitName: ['advanceClaimTransfer'],
                type: 'route',
                i18n: 'fund.fundClaim.btn.advanceClaimTransfer',
                validate(currentRow) {
                  return currentRow.claimType === 'A' && currentRow.auditStatus === '3' && currentRow.useStatus !== '2'
                },
                routeInfo(currentRow) {
                  return {
                    name: 'advanceClaimTransferAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.claimNo,
                      preBillType: 'FUND_CLAIM',
                      back: 'fundClaim'
                    }
                  }
                }
              },
              // 付款申请(退预收款)
              {
                msg: this.$t('fund.fundClaim.msg.fundApply'),
                name: 'next',
                permitName: ['fundApply'],
                type: 'route',
                i18n: 'fund.fundClaim.btn.fundApply',
                validate(currentRow) {
                  return currentRow.claimType === 'A' && currentRow.auditStatus === '3' && currentRow.useStatus !== '2'
                },
                routeInfo(currentRow) {
                  return {
                    name: 'fundApplyAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.claimNo,
                      preBillType: 'FUND_CLAIM',
                      back: 'fundClaim'
                    }
                  }
                }
              }
            ]
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
              label: 'fund.fundClaim.list.claimNo',
              prop: 'claimNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 认领日期
            {
              label: 'fund.fundClaim.list.claimDate',
              prop: 'claimDate',
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
              label: 'fund.fundClaim.list.customerName',
              prop: 'customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 认领类型
            {
              label: 'fund.fundClaim.list.claimType',
              prop: 'claimType',
              format: {
                dict: this.$t('datadict.fundClaimType')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 收款单号
            {
              label: 'fund.fundClaim.list.receiveNo',
              prop: 'receiveNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 收款方式
            {
              label: 'fund.fundClaim.list.receiveType',
              prop: 'receiveType',
              format: {
                dict: this.$t('datadict.settlementType')
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 认领金额
            {
              label: 'fund.fundClaim.list.claimAmount',
              prop: 'claimAmount',
              format: {
                func: 'money'
              },
              width: 150,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'fund.fundClaim.list.currency',
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

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
  name: 'advanceClaimTransferCheck',
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
          defaultSortString: 'claimDate.asc, claimNo.asc'
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
          search: '/api/fund/claimAdvTran/listCheck'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
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
                  preBillType: 'ADVANCE_CLAIM_TRANSFER_CHECK',
                  back: 'advanceClaimTransferCheck'
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
            // 使用状态
            {
              label: 'fund.fundClaim.list.useStatus',
              prop: 'useStatus',
              format: {
                dict: this.$t('datadict.useStatus')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 已使用金额
            {
              label: 'fund.fundClaim.list.usedAmount',
              prop: 'usedAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 未使用金额
            {
              label: 'fund.fundClaim.list.canUsedAmount',
              prop: 'canUsedAmount',
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

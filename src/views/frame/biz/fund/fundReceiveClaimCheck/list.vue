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
  name: 'fundReceiveClaimCheck',
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
            claimStatus: '',
            typeCodeList: ['1', '2', '12']
          },
          defaultSortString: 'receiveDate.asc, receiveNo.asc'
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
            list: this.$t('datadict.claimStatusCheck'),
            attrs: {
              disabled: false,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/fund/receive/claimCheck'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
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
                  preBillType: 'FUND_RECEIVE_CLAIM_CHECK',
                  back: 'fundReceiveClaimCheck'
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
            // 未认领金额
            {
              prop: 'unclaimedAmount',
              label: 'fund.fundReceive.list.unclaimAmount',
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

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
  name: 'signAcceptanceAcceptCheck',
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
            signNo: '',
            acceptanceNo: '',
            acceptanceDateStart: '',
            acceptanceDateEnd: '',
            customerNo: '',
            dueDateStart: '',
            dueDateEnd: '',
            acceptanceBank: '',
            useFlag: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'acceptanceDate.asc, signNo.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'acceptance.acceptanceSign.form.acceptanceDate',
            props: ['acceptanceDateStart', 'acceptanceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'acceptance.acceptanceSign.form.signNo',
            prop: 'signNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceSign.form.acceptanceNo',
            prop: 'acceptanceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceSign.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'acceptance.acceptanceSign.form.dueDate',
            props: ['dueDateStart', 'dueDateEnd'],
            attrs: {
              pickStart: 'dateStartBeforeLv2',
              pickEnd: 'dateEndBeforeLv2',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: []
          },
          {
            label: 'acceptance.acceptanceSign.form.acceptanceBank',
            prop: 'acceptanceBank',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceSign.form.useFlag',
            prop: 'useFlag',
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
          search: '/api/acceptance/check/signAcceptanceAcceptCheck'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          // 导出
          {
            name: 'export'
          },
          // 刷新
          {
            name: 'refresh'
          },
          // 生成下游单据
          {
            name: 'more',
            i18n: 'biz.btn.generateBill',
            list: [
              // 承兑汇票承兑
              {
                msg: this.$t('acceptance.acceptanceSign.msg.acceptanceAccept'),
                name: 'next',
                permitName: ['acceptanceAccept'],
                type: 'route',
                i18n: 'acceptance.acceptanceSign.btn.acceptanceAccept',
                validate(currentRow) {
                  return currentRow.auditStatus === '3' && currentRow.acceptFlag === '0'
                },
                routeInfo(currentRow) {
                  return {
                    name: 'acceptanceAcceptAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.signNo,
                      preBillType: 'ACCEPTANCE_SIGN',
                      back: 'signAcceptanceAcceptCheck'
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
              prop: 'signNo',
              label: 'acceptance.acceptanceSign.list.signNo',
              width: 200,
              align: 'left'
            },
            // 票据号
            {
              prop: 'acceptanceNo',
              label: 'acceptance.acceptanceSign.list.acceptanceNo',
              width: 200,
              align: 'left'
            },
            // 出票日期
            {
              prop: 'acceptanceDate',
              label: 'acceptance.acceptanceSign.list.acceptanceDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center'
            },
            // 供应商
            {
              prop: 'customerName',
              label: 'acceptance.acceptanceSign.list.customerName',
              width: 300,
              align: 'left'
            },
            // 票面金额
            {
              prop: 'acceptanceAmount',
              label: 'acceptance.acceptanceSign.list.acceptanceAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 币种
            {
              prop: 'currency',
              label: 'acceptance.acceptanceSign.list.currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center'
            },
            // 到期日
            {
              prop: 'dueDate',
              label: 'acceptance.acceptanceSign.list.dueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center'
            },
            // 承兑银行
            {
              prop: 'acceptanceBank',
              label: 'acceptance.acceptanceSign.list.acceptanceBank',
              width: 150,
              align: 'left'
            },
            // 签发保证金
            {
              prop: 'signSecurityDeposit',
              label: 'acceptance.acceptanceSign.list.signSecurityDeposit',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 签发手续费
            {
              prop: 'signServiceFee',
              label: 'acceptance.acceptanceSign.list.signServiceFee',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right'
            },
            // 是否使用
            {
              label: 'acceptance.acceptanceSign.list.useFlag',
              prop: 'useFlag',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            // 业务机构
            {
              prop: 'bizOrganName',
              width: 100,
              align: 'center',
              label: 'biz.lbl.bizOrganName'
            },
            // 业务部门
            {
              prop: 'bizDeptName',
              width: 100,
              align: 'center',
              label: 'biz.lbl.bizDeptName'
            },
            // 业务员
            {
              prop: 'bizEmployeeName',
              width: 100,
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            // 制单人
            {
              prop: 'optEmployeeName',
              width: 100,
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

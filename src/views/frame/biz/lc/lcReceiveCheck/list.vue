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
  name: 'lcReceiveCheck',
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
            letterCreditNo: '',
            issueDateStart: '',
            issueDateEnd: '',
            customerNo: '',
            contractNo: '',
            lcType: '',
            dueDateStart: '',
            dueDateEnd: '',
            letterCreditStatus: 'NONE',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            auditStatus: '3'
          },
          defaultSortString: 'issueDate.desc, receiveNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'lc.lcReceive.form.issueDate',
            props: ['issueDateStart', 'issueDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'lc.lcReceive.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcReceive.form.letterCreditNo',
            prop: 'letterCreditNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcReceive.form.customerNo',
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
            label: 'lc.lcReceive.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcReceive.form.lcType',
            prop: 'lcType',
            element: 'base-select',
            list: this.$t('datadict.letterCreditType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'lc.lcReceive.form.dueDate',
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
          search: '/api/lc/receive/listCheck'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'more',
            i18n: 'biz.btn.generateBill',
            list: [
              // 信用证贴现
              {
                name: 'next',
                permitName: ['lcDiscount'],
                type: 'route',
                i18n: 'lc.lcReceive.btn.lcDiscount',
                routeInfo(currentRow) {
                  return {
                    name: 'lcDiscountAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.receiveNo,
                      preBillType: 'LC_RECEIVE',
                      back: 'lcReceiveCheck'
                    }
                  }
                }
              },
              // 信用证议付
              {
                name: 'next',
                permitName: ['lcNegotiate'],
                type: 'route',
                i18n: 'lc.lcReceive.btn.lcNegotiate',
                routeInfo(currentRow) {
                  return {
                    name: 'lcNegotiateAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.receiveNo,
                      preBillType: 'LC_RECEIVE',
                      back: 'lcReceiveCheck'
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
              prop: 'receiveNo',
              label: 'lc.lcReceive.list.receiveNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 信用证号
            {
              prop: 'letterCreditNo',
              label: 'lc.lcReceive.list.letterCreditNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 信用证日期
            {
              prop: 'issueDate',
              label: 'lc.lcReceive.list.issueDate',
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
              label: 'lc.lcReceive.list.customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 合同号
            {
              prop: 'contractNo',
              label: 'lc.lcReceive.list.contractNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 信用证金额
            {
              prop: 'letterCreditAmount',
              label: 'lc.lcReceive.list.letterCreditAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'lc.lcReceive.list.currency',
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
              label: 'lc.lcReceive.list.lcType',
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
              label: 'lc.lcReceive.list.usanceDays',
              prop: 'usanceDays',
              format: {
                func: 'weight'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 到期日
            {
              prop: 'dueDate',
              label: 'lc.lcReceive.list.dueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 是否使用
            {
              label: 'lc.lcReceive.list.useFlag',
              prop: 'useFlag',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 信用证状态
            {
              label: 'lc.lcReceive.list.letterCreditStatus',
              prop: 'letterCreditStatus',
              format: {
                dict: this.$t('datadict.letterCreditStatus')
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

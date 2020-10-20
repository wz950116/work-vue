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
  name: 'acceptanceReceiveCheck',
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
            acceptanceNo: '',
            acceptanceDateStart: '',
            acceptanceDateEnd: '',
            customerNo: '',
            dueDateStart: '',
            dueDateEnd: '',
            acceptanceBank: '',
            useFlag: '',
            acceptanceStatus: 'NONE',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: '',
            auditStatus: '3'
          },
          defaultSortString: 'acceptanceDate.desc, receiveNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'acceptance.acceptanceReceive.form.acceptanceDate',
            props: ['acceptanceDateStart', 'acceptanceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'acceptance.acceptanceReceive.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceReceive.form.acceptanceNo',
            prop: 'acceptanceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceReceive.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
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
            label: 'acceptance.acceptanceReceive.form.dueDate',
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
            label: 'acceptance.acceptanceReceive.form.acceptanceBank',
            prop: 'acceptanceBank',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.acceptanceReceive.form.useFlag',
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
          search: '/api/acceptance/check/receiveAcceptanceUseCheck'
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
              // 承兑汇票贴现
              {
                name: 'next',
                permitName: ['acceptanceDiscount'],
                type: 'route',
                i18n: 'acceptance.acceptanceReceive.btn.acceptanceDiscount',
                routeInfo(currentRow) {
                  return {
                    name: 'acceptanceDiscountAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.receiveNo,
                      preBillType: 'ACCEPTANCE_RECEIVE',
                      back: 'acceptanceReceiveCheck'
                    }
                  }
                }
              },
              // 承兑汇票承兑
              {
                name: 'next',
                permitName: ['acceptanceAccept'],
                type: 'route',
                i18n: 'acceptance.acceptanceReceive.btn.acceptanceAccept',
                routeInfo(currentRow) {
                  return {
                    name: 'acceptanceAcceptAdd',
                    params: {
                      type: 'add',
                      preBillNo: currentRow.receiveNo,
                      preBillType: 'ACCEPTANCE_RECEIVE',
                      back: 'acceptanceReceiveCheck'
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
              label: 'acceptance.acceptanceReceive.list.receiveNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 票据号
            {
              prop: 'acceptanceNo',
              label: 'acceptance.acceptanceReceive.list.acceptanceNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 出票日期
            {
              prop: 'acceptanceDate',
              label: 'acceptance.acceptanceReceive.list.acceptanceDate',
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
              label: 'acceptance.acceptanceReceive.list.customerName',
              width: 300,
              align: 'left',
              sortable: 'custom'
            },
            // 票面金额
            {
              prop: 'acceptanceAmount',
              label: 'acceptance.acceptanceReceive.list.acceptanceAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              prop: 'currency',
              label: 'acceptance.acceptanceReceive.list.currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 到期日
            {
              prop: 'dueDate',
              label: 'acceptance.acceptanceReceive.list.dueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 承兑银行
            {
              prop: 'acceptanceBank',
              label: 'acceptance.acceptanceReceive.list.acceptanceBank',
              width: 150,
              align: 'left',
              sortable: 'custom'
            },
            // 是否使用
            {
              label: 'acceptance.acceptanceReceive.list.useFlag',
              prop: 'useFlag',
              width: 80,
              align: 'center',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            // 承兑汇票状态
            {
              label: 'acceptance.acceptanceReceive.list.acceptanceStatus',
              prop: 'acceptanceStatus',
              width: 100,
              align: 'center',
              sortable: 'custom',
              format: {
                dict: this.$t('datadict.acceptanceStatus')
              }
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

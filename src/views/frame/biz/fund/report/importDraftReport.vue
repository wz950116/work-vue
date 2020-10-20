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
  name: 'importDraftReport',
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
            confirmNo: '',
            draftDateStart: '',
            draftDateEnd: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            optEmployeeCode: ''
          },
          defaultSortString: 'draftDate.desc, confirmNo.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'fund.fundConfirm.form.draftDate',
            props: ['draftDateStart', 'draftDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fund.fundConfirm.form.confirmNo',
            prop: 'confirmNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fund.fundConfirm.form.currency',
            prop: 'currency',
            element: 'base-select',
            list: this.$t('datadict.currency'),
            attrs: {
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
          search: '/api/fund/report/listImportDraft'
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
              prop: 'confirmNo',
              label: 'fund.fundConfirm.list.confirmNo',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 批次号
            {
              prop: 'lotNos',
              label: 'fund.fundConfirm.list.lotNos',
              width: 200,
              align: 'left',
              sortable: 'custom'
            },
            // 押汇日期
            {
              prop: 'draftDate',
              label: 'fund.fundConfirm.list.draftDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 押汇天数
            {
              prop: 'draftDays',
              label: 'fund.fundConfirm.list.draftDays',
              format: {
                func: 'num'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // 到期日
            {
              prop: 'draftDueDate',
              label: 'fund.fundConfirm.list.draftDueDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              },
              width: 100,
              align: 'center',
              sortable: 'custom'
            },
            // 付款金额
            {
              prop: 'paymentAmount',
              label: 'fund.fundConfirm.list.paymentAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 押汇比例
            {
              prop: 'draftRate',
              label: 'fund.fundConfirm.list.draftRate',
              format: {
                func: 'percent'
              },
              width: 80,
              align: 'right',
              sortable: 'custom'
            },
            // 押汇金额
            {
              prop: 'draftAmount',
              label: 'fund.fundConfirm.list.draftAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 即期购汇
            {
              prop: 'sightDraftAmount',
              label: 'fund.fundConfirm.list.sightDraftAmount',
              format: {
                func: 'money'
              },
              width: 120,
              align: 'right',
              sortable: 'custom'
            },
            // 币种
            {
              label: 'fund.fundConfirm.list.currency',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              },
              width: 80,
              align: 'center',
              sortable: 'custom'
            },
            // 汇率
            {
              prop: 'exchangeRate',
              label: 'fund.fundConfirm.list.exchangeRate',
              format: {
                func: 'exchangeRate'
              },
              width: 100,
              align: 'right',
              sortable: 'custom'
            },
            // labor
            {
              prop: 'laborRate',
              label: 'fund.fundConfirm.list.laborRate',
              format: {
                func: 'percent'
              },
              width: 80,
              align: 'right',
              sortable: 'custom'
            },
            // 上浮
            {
              prop: 'goUpRate',
              label: 'fund.fundConfirm.list.goUpRate',
              format: {
                func: 'percent'
              },
              width: 80,
              align: 'right',
              sortable: 'custom'
            },
            // 利率
            {
              prop: 'interestRate',
              label: 'fund.fundConfirm.list.interestRate',
              format: {
                func: 'percent'
              },
              width: 80,
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

<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>
<script>
export default {
  data() {
    return {
      dialog: {
        moreShowFlg: false,
        titleName: this.$t('fund.fundApply.popup.list'),
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
              clearable: true
            }
          },
          {
            label: 'fund.fundApply.form.applyType',
            prop: 'applyType',
            element: 'base-select',
            list: this.$t('datadict.fundApplyType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
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
              clearable: true
            }
          },
          {
            label: 'fund.fundApply.form.confirmStatus',
            prop: 'confirmStatus',
            element: 'base-select',
            list: this.$t('datadict.confirmStatus'),
            attrs: {
              clearable: true
            }
          }
        ],
        mainData: {
          api: {
            search: '/api/fund/apply/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'applyDate.asc, applyNo.asc'
              })
              return newListQuery
            }
          },
          initSearch: true,
          table: {
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
                width: 220,
                align: 'left'
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
                align: 'center'
              },
              // 申请类型
              {
                label: 'fund.fundApply.list.applyType',
                prop: 'applyType',
                format: {
                  dict: this.$t('datadict.fundApplyType')
                },
                width: 100,
                align: 'center'
              },
              // 客户
              {
                label: 'fund.fundApply.list.customerName',
                prop: 'customerName',
                width: 300,
                align: 'left'
              },
              // 申请金额
              {
                label: 'fund.fundApply.list.applyAmount',
                prop: 'applyAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right'
              },
              // 币种
              {
                label: 'fund.fundApply.list.currency',
                prop: 'currency',
                format: {
                  dict: this.$t('datadict.currency')
                },
                width: 80,
                align: 'center'
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
                align: 'center'
              },
              // 确认状态
              {
                label: 'fund.fundApply.list.confirmStatus',
                prop: 'confirmStatus',
                format: {
                  dict: this.$t('datadict.confirmStatus')
                },
                width: 100,
                align: 'center'
              },
              // 确认金额
              {
                label: 'fund.fundApply.list.confirmAmount',
                prop: 'confirmAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right'
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
          }
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        },
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  methods: {
    // 关闭回调
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

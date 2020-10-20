<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('lc.lcConfirm.popup.list'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'lc.lcConfirm.form.confirmNo',
            prop: 'confirmNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcConfirm.form.letterCreditNo',
            prop: 'letterCreditNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'lc.lcConfirm.form.issueDate',
            props: ['issueDateStart', 'issueDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'lc.lcConfirm.form.customerNo',
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
            label: 'lc.lcConfirm.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcConfirm.form.lcType',
            prop: 'lcType',
            element: 'base-select',
            list: this.$t('datadict.letterCreditType'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'lc.lcConfirm.form.currency',
            prop: 'currency',
            element: 'base-select',
            list: this.$t('datadict.currency'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'lc.lcConfirm.form.dueDate',
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
          },
          // {
          //   prop: 'useFlag',
          //   default: '0',
          //   isShow: false
          // },
          {
            prop: 'useStatusNe',
            default: '',
            attrs: {},
            isShow: false
          },
          {
            prop: 'auditStatus',
            default: '3',
            isShow: false
          }
        ],
        mainData: {
          api: {
            search: '/api/lc/confirm/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'issueDate.asc, confirmNo.asc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              // 单据号
              {
                prop: 'confirmNo',
                label: 'lc.lcConfirm.list.confirmNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 信用证号
              {
                prop: 'letterCreditNo',
                label: 'lc.lcConfirm.list.letterCreditNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 信用证日期
              {
                prop: 'issueDate',
                label: 'lc.lcConfirm.list.issueDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 申请单号
              // {
              //   prop: 'applyNo',
              //   label: 'lc.lcConfirm.list.applyNo',
              //   width: 200,
              //   align: 'left',
              //   sortable: 'custom'
              // },
              // 客户
              {
                prop: 'customerName',
                label: 'lc.lcConfirm.list.customerName',
                width: 300,
                align: 'left',
                sortable: 'custom'
              },
              // 合同号
              {
                prop: 'contractNo',
                label: 'lc.lcConfirm.list.contractNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 信用证金额
              {
                prop: 'letterCreditAmount',
                label: 'lc.lcConfirm.list.letterCreditAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 已使用金额
              {
                prop: 'usedAmount',
                label: 'lc.lcConfirm.list.usedAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 币种
              {
                label: 'lc.lcConfirm.list.currency',
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
                label: 'lc.lcConfirm.list.lcType',
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
                label: 'lc.lcConfirm.list.usanceDays',
                prop: 'usanceDays',
                format: {
                  func: 'num'
                },
                width: 100,
                align: 'right',
                sortable: 'custom'
              },
              // 到期日
              {
                prop: 'dueDate',
                label: 'lc.lcConfirm.list.dueDate',
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
                label: 'lc.lcConfirm.list.useFlag',
                prop: 'useFlag',
                format: {
                  dict: this.$t('datadict.yesNo')
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
  props: {
    // 列表是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否进行初始化查询
    initSearch: {
      type: Boolean,
      default: false
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    },
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {},
  methods: {
    // 列表是否初始化查询
    getInitSearch() {
      if (typeof this.param.initSearch === 'boolean') {
        return this.param.initSearch
      }
      if (typeof this.initChooseParam.initSearch === 'boolean') {
        return this.initChooseParam.initSearch
      }
      return this.initSearch
    },
    // 列表是否支持多选
    getMultiple() {
      if (typeof this.param.multiple === 'boolean') {
        return this.param.multiple
      }
      if (typeof this.initChooseParam.multiple === 'boolean') {
        return this.initChooseParam.multiple
      }
      return this.multiple
    },
    // 关闭回调
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

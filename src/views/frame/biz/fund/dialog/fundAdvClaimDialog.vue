<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('fund.fundClaim.popup.advClaimList'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            type: 'date',
            label: 'fund.fundClaim.form.claimDate',
            props: ['claimDateStart', 'claimDateEnd'],
            attrs: {
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
            label: 'fund.fundClaim.form.receiveNo',
            prop: 'receiveNo',
            element: 'input-validate',
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
            prop: 'claimType',
            default: 'A',
            isShow: false
          },
          {
            prop: 'useStatusNe',
            default: '2',
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
            search: '/api/fund/claim/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'claimDate.asc, claimNo.asc'
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
                width: 200,
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
                width: 120,
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
                width: 120,
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
              // 使用状态
              {
                label: 'fund.fundClaim.list.useStatus',
                prop: 'useStatus',
                format: {
                  dict: this.$t('datadict.useStatus')
                },
                width: 100,
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
      default: true
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

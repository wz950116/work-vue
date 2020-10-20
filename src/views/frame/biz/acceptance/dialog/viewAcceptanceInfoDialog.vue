<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('acceptance.viewAcceptanceInfo.popup.list'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'acceptance.viewAcceptanceInfo.form.infoNo',
            prop: 'infoNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'acceptance.viewAcceptanceInfo.form.acceptanceDate',
            props: ['acceptanceDateStart', 'acceptanceDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'acceptance.viewAcceptanceInfo.form.acceptanceDirection',
            prop: 'acceptanceDirection',
            element: 'base-select',
            list: this.$t('datadict.acceptanceDirection'),
            // default: 'SIGN',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.viewAcceptanceInfo.form.acceptanceNo',
            prop: 'acceptanceNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'acceptance.viewAcceptanceInfo.form.customerNo',
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
            type: 'date',
            label: 'acceptance.viewAcceptanceInfo.form.dueDate',
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
            label: 'acceptance.viewAcceptanceInfo.form.acceptanceBank',
            prop: 'acceptanceBank',
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
            prop: 'useFlag',
            default: '0',
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
            search: '/api/acceptance/viewAcceptanceInfo/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'acceptanceDate.asc, infoNo.asc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            sortable: 'custom',
            showCheckbox: this.getMultiple(),
            cols: [
              // 单据号
              {
                prop: 'infoNo',
                label: 'acceptance.viewAcceptanceInfo.list.infoNo',
                width: 200,
                align: 'left'
              },
              // 汇票方向
              {
                prop: 'acceptanceDirection',
                label: 'acceptance.viewAcceptanceInfo.list.acceptanceDirection',
                width: 100,
                align: 'center',
                format: {
                  dict: this.$t('datadict.acceptanceDirection')
                }
              },
              // 票据号
              {
                prop: 'acceptanceNo',
                label: 'acceptance.viewAcceptanceInfo.list.acceptanceNo',
                width: 200,
                align: 'left'
              },
              // 出票日期
              {
                prop: 'acceptanceDate',
                label: 'acceptance.viewAcceptanceInfo.list.acceptanceDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                },
                width: 100,
                align: 'center'
              },
              // 客户
              {
                prop: 'customerName',
                label: 'acceptance.viewAcceptanceInfo.list.customerName',
                width: 300,
                align: 'left'
              },
              // 票面金额
              {
                prop: 'acceptanceAmount',
                label: 'acceptance.viewAcceptanceInfo.list.acceptanceAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right'
              },
              // 币种
              {
                prop: 'currency',
                label: 'acceptance.viewAcceptanceInfo.list.currency',
                format: {
                  dict: this.$t('datadict.currency')
                },
                width: 80,
                align: 'center'
              },
              // 到期日
              {
                prop: 'dueDate',
                label: 'acceptance.viewAcceptanceInfo.list.dueDate',
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
                label: 'acceptance.viewAcceptanceInfo.list.acceptanceBank',
                width: 100,
                align: 'left'
              },
              // 是否使用
              {
                label: 'acceptance.viewAcceptanceInfo.list.useFlag',
                prop: 'useFlag',
                width: 80,
                align: 'center',
                format: {
                  dict: this.$t('datadict.yesNo')
                }
              },
              // 承兑汇票状态
              {
                label: 'acceptance.viewAcceptanceInfo.list.acceptanceStatus',
                prop: 'acceptanceStatus',
                width: 100,
                align: 'center',
                format: {
                  dict: this.$t('datadict.acceptanceStatus')
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

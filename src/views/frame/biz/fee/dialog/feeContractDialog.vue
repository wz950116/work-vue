<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('fee.feeContract.popup.list'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            type: 'date',
            label: 'fee.feeContract.form.signDate',
            props: ['signDateStart', 'signDateEnd'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.feeContract.form.feeContractNo',
            prop: 'feeContractNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.feeContract.form.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              disabled: true,
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
            },
            isShow: false
          },
          {
            label: 'fee.feeContract.form.documentNo',
            prop: 'documentNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.feeContract.form.feeContractType',
            prop: 'feeContractType',
            element: 'base-select',
            list: this.$t('datadict.feeTypeFee'),
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
        ],
        mainData: {
          api: {
            search: '/api/fee/feeContract/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'signDate.desc, feeContractNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
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
              // 合同号
              {
                label: 'fee.feeContract.list.feeContractNo',
                prop: 'feeContractNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 签订日期
              {
                label: 'fee.feeContract.list.signDate',
                prop: 'signDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 服务商
              {
                label: 'fee.feeContract.list.customerName',
                prop: 'customerName',
                width: 300,
                align: 'left',
                sortable: 'custom'
              },
              // 合同文档号
              {
                label: 'fee.feeContract.list.documentNo',
                prop: 'documentNo',
                width: 200,
                align: 'left',
                sortable: 'custom'
              },
              // 合同类型
              {
                label: 'fee.feeContract.list.feeContractType',
                prop: 'feeContractType',
                format: {
                  dict: this.$t('datadict.feeTypeFee')
                },
                width: 100,
                align: 'center',
                sortable: 'custom'
              },
              // 合同金额
              {
                label: 'fee.feeContract.list.contractAmount',
                prop: 'contractAmount',
                format: {
                  func: 'money'
                },
                width: 120,
                align: 'right',
                sortable: 'custom'
              },
              // 币种
              {
                label: 'fee.feeContract.list.currency',
                prop: 'currency',
                format: {
                  dict: this.$t('datadict.currency')
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

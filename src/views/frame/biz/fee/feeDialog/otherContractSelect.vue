<template>
  <qm-dialog-table ref='qmDialogTable' :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('fee.otherContract.popup.title'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            type: 'date',
            label: 'fee.otherContract.form.signDate',
            props: ['signDateStart', 'signDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'fee.otherContract.form.otherContractNo',
            prop: 'otherContractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'fee.otherContract.form.otherContractDocNo',
            prop: 'otherContractDocNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'fee.otherContract.form.serviceProviderName',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'fee.otherContract.form.otherContractType',
            prop: 'otherContractType',
            element: 'base-select',
            list: this.$t('datadict.otherContractType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              filterable: true,
              data: 'FUNC_ORG',
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
          }
        ],

        mainData: {
          api: {
            search: '/api/fee/otherContract/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'signDate.desc,otherContractNo.desc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          defaultSortString: 'id.desc',
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              {
                label: 'fee.otherContract.list.otherContractNo',
                width: '180',
                align: 'left',
                sortable: 'custom',
                prop: 'otherContractNo'
              },
              {
                label: 'fee.otherContract.list.otherContractDocNo',
                width: '180',
                align: 'left',
                sortable: 'custom',
                prop: 'otherContractDocNo'
              },
              {
                label: 'fee.otherContract.list.otherContractName',
                width: '180',
                align: 'left',
                sortable: 'custom',
                prop: 'otherContractName'
              },
              {
                label: 'fee.otherContract.list.serviceProviderName',
                width: '180',
                align: 'left',
                sortable: 'custom',
                prop: 'customerName'
              },
              {
                label: 'fee.otherContract.list.otherContractType',
                prop: 'otherContractType',
                width: '90',
                align: 'center',
                sortable: 'custom',
                format: {
                  dict: this.$t('datadict.otherContractType')
                }
              },
              {
                label: 'fee.otherContract.list.otherContractAmount',
                prop: 'otherContractAmount',
                width: '120',
                align: 'right',
                sortable: 'custom',
                format: {
                  func: 'thousands',
                  dict: 2
                }
              },
              {
                label: 'fee.otherContract.list.currency',
                width: '90',
                align: 'center',
                sortable: 'custom',
                prop: 'currency',
                list: this.$t('datadict.currency'),
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'fee.otherContract.list.signDate',
                width: '90',
                align: 'center',
                sortable: 'custom',
                prop: 'signDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                prop: 'bizOrganName',
                width: '120',
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizOrganName'
              },
              {
                prop: 'bizDeptName',
                width: '120',
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizDeptName'
              },
              {
                prop: 'bizEmployeeName',
                width: '90',
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.bizEmployeeName'
              },
              {
                prop: 'optEmployeeName',
                width: '90',
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.optName'
              },
              {
                prop: 'customerNo',
                isShow: false
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
    multiple: {
      type: Boolean,
      default: false
    },
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
  methods: {
    getInitSearch() {
      if (typeof this.param.initSearch === 'boolean') {
        return this.param.initSearch
      }
      if (typeof this.initChooseParam.initSearch === 'boolean') {
        return this.initChooseParam.initSearch
      }
      return this.initSearch
    },
    getMultiple() {
      if (typeof this.param.multiple === 'boolean') {
        return this.param.multiple
      }
      if (typeof this.initChooseParam.multiple === 'boolean') {
        return this.initChooseParam.multiple
      }
      return this.multiple
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('fee.feeInfo.popup.detailList'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'fee.feeInfo.detail.transactionFlag',
            prop: 'transactionFlag',
            element: 'base-select',
            attrs: {
              data: 'yesNo',
              params: {}
            },
            isShow: false
          },
          {
            prop: 'auditStatus',
            default: '3',
            isShow: false
          },
          {
            label: 'fee.feeInfo.detail.feeDetailNo',
            prop: 'feeDetailNo',
            element: 'input-validate'
          },
          {
            label: 'fee.feeInfo.detail.feeName',
            prop: 'feeNameCode',
            element: 'base-select',
            attrs: {
              data: 'DD_FEE_TYPE',
              params: {},
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'fee.feeInfo.detail.customerNo',
            prop: 'customerNo',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
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
          }
        ],
        mainData: {
          api: {
            search: '/api/fee/feeDetailInfo/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'id.desc'
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
              // 单据类型
              {
                label: 'fee.feeInfo.detail.typeCode',
                prop: 'typeCode',
                width: 200,
                format: {
                  dict: this.$t('datadict.feeSource')
                }
              },
              // 费用明细单据号
              {
                label: 'fee.feeInfo.detail.feeDetailNo',
                prop: 'feeDetailNo',
                width: 150,
                align: 'left'
              },
              // 结算商名称
              {
                label: 'fee.feeInfo.detail.customerNo',
                prop: 'customerName',
                width: 200,
                align: 'left'
              },
              // 费用名称
              {
                label: 'fee.feeInfo.detail.feeName',
                prop: 'feeName',
                width: 150,
                align: 'left'
              },
              // 费用方向
              {
                label: 'fee.feeInfo.detail.feeDirection',
                prop: 'feeDirection',
                format: {
                  dict: this.$t('datadict.feeDirection')
                },
                width: 100,
                align: 'center'
              },
              // 费用数量
              {
                label: 'fee.feeInfo.detail.feeQuantity',
                prop: 'feeQuantity',
                format: {
                  func: 'weight'
                },
                width: 100,
                align: 'right'
              },
              // 数量单位
              {
                label: 'fee.feeInfo.detail.quantityUnit',
                prop: 'quantityUnit',
                width: 100,
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                }
              },
              // 不含税价格
              {
                label: 'fee.feeInfo.detail.excludeTaxPrice',
                prop: 'excludeTaxPrice',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right'
              },
              // 不含税金额
              {
                label: 'fee.feeInfo.detail.excludeTaxAmount',
                prop: 'excludeTaxAmount',
                format: {
                  func: 'money'
                },
                width: 100,
                align: 'right'
              },
              // 税率
              {
                label: 'fee.feeInfo.detail.taxRate',
                prop: 'taxRate',
                format: {
                  func: 'taxrate'
                },
                width: 100,
                align: 'right'
              },
              // 税额
              {
                label: 'fee.feeInfo.detail.taxAmount',
                prop: 'taxAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right'
              },
              // 含税价格
              {
                label: 'fee.feeInfo.detail.includeTaxPrice',
                prop: 'includeTaxPrice',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right'
              },
              // 含税金额
              {
                label: 'fee.feeInfo.detail.includeTaxAmount',
                prop: 'includeTaxAmount',
                format: {
                  func: 'money'
                },
                width: 150,
                align: 'right'
              },
              // 币种
              {
                label: 'fee.feeInfo.detail.currency',
                prop: 'currency',
                width: 100,
                align: 'center',
                format: {
                  dict: this.$t('datadict.currency')
                }
              },
              //商品名称
              {
                label: 'fee.feeInfo.list.productName',
                prop: 'productName',
                width: 80,
                align: 'center'
              },
              ...this.$store.state.user.mainGoodColsTxt,
              // 备注
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  maxlength: 100
                },
                'min-width': 200
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

<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('fee.feeSettle.popup.feeSettleFeeDetail'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            prop: 'auditStatus',
            default: '3',
            isShow: false
          },
          {
            label: 'fee.feeSettle.feeSettleFeeDetailDto.settleFeeDetailNo',
            prop: 'settleFeeDetailNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },

          {
            label: 'fee.feeSettle.feeSettleFeeDetailDto.customerNo',
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
          // 费用名称
          {
            label: 'fee.feeSettle.feeSettleFeeDetailDto.feeName',
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
          // 费用方向
          {
            label: 'fee.feeSettle.feeSettleFeeDetailDto.feeDirection',
            prop: 'feeDirection',
            element: 'base-select',
            list: this.$t('datadict.feeDirection'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          // 币种
          {
            label: 'fee.feeSettle.feeSettleFeeDetailDto.currency',
            prop: 'currency',
            element: 'base-select',
            list: this.$t('datadict.currency'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
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
          }
        ],
        mainData: {
          api: {
            search: '/api/fee/feeSettleFeeDetail/query'
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
              // 费用结算单据号
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.settleNo',
                prop: 'settleNo',
                width: 150,
                align: 'left'
              },
              // 费用结算费用明细单据号
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.settleFeeDetailNo',
                prop: 'settleFeeDetailNo',
                width: 150,
                align: 'left'
              },
              // 结算商
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.customerNo',
                prop: 'customerName',
                width: 200
              },
              // 费用名称
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.feeName',
                prop: 'feeName',
                width: 100
              },
              // 费用方向
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.feeDirection',
                prop: 'feeDirection',
                width: 100,
                align: 'center',
                format: {
                  dict: this.$t('datadict.feeDirection')
                }
              },
              // 费用数量
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.feeQuantity',
                prop: 'feeQuantity',
                width: 150,
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              // 数量单位
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.quantityUnit',
                prop: 'quantityUnit',
                width: 100,
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                }
              },
              // 不含税价格
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.excludeTaxPrice',
                prop: 'excludeTaxPrice',
                width: 150,
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              // 不含税金额
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.excludeTaxAmount',
                prop: 'excludeTaxAmount',
                width: 150,
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              // 税率
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.taxRate',
                prop: 'taxRate',
                width: 100,
                align: 'right',
                format: {
                  func: 'taxrate'
                }
              },
              // 税额
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.taxAmount',
                prop: 'taxAmount',
                width: 150,
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              // 含税价格
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.includeTaxPrice',
                prop: 'includeTaxPrice',
                align: 'right',
                width: 150,
                format: {
                  func: 'money'
                }
              },
              // 含税金额
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.includeTaxAmount',
                prop: 'includeTaxAmount',
                align: 'right',
                width: 150,
                format: {
                  func: 'money'
                }
              },
              // 币种
              {
                label: 'fee.feeSettle.feeSettleFeeDetailDto.currency',
                prop: 'currency',
                align: 'center',
                width: 100,
                format: {
                  dict: this.$t('datadict.currency')
                }
              },

              // 备注
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  maxlength: 100,
                  clearable: true
                },
                'min-width': 200
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

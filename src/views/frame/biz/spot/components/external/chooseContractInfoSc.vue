<!--选择销售合同(单选)-->
<template>
  <qm-dialog-array-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-array-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('spot.contractLot.popup.chooseContractInfoSc'),
        moreShowFlg: false,
        initType: 'param',
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'spot.contractLot.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'spot.contractLot.form.tradeType',
            prop: 'tradeType',
            element: 'base-select',
            list: this.$t('datadict.tradeType'),
            default: '1',
            attrs: {
              clearable: false
            }
          },
          {
            label: 'spot.contractLot.form.contractType',
            prop: 'contractType',
            element: 'base-select',
            list: this.$t('datadict.contractType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.deliveryMarketCode',
            prop: 'deliveryMarketCode',
            element: 'base-select',
            attrs: {
              data: 'DD_SPOT_MARKET',
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'spot.contractLot.form.signDate',
            props: ['signDateFrom', 'signDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'spot.contractLot.form.bizEmployeeCode',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.auditStatus',
            prop: 'auditStatus',
            default: '3',
            isShow: false
          },
          {
            label: 'spot.contractLot.form.tradeType',
            prop: 'tradeTypeList',
            element: 'base-select',
            list: this.$t('datadict.tradeType'),
            attrs: {
              clearable: true,
              multiple: true
            },
            isShow: false,
            default: []
          }
        ],
        mainData: {
          api: {
            search: '/api/contract/scInfo/list'
          },
          apiData: {
            search(param) {
              return Object.assign(param, { defaultSortString: 'docMakeDt.desc' })
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            id: '',
            mergeProp: 'productDetailList',
            cols: [
              {
                label: 'spot.contractLot.form.contractNo',
                width: '180',
                prop: 'contractNo'
              },
              {
                label: 'spot.contractLot.form.tradeType',
                width: '90',
                prop: 'tradeType',
                align: 'center',
                format: {
                  dict: this.$t('datadict.tradeType')
                }
              },
              {
                label: 'spot.contractLot.form.contractType',
                width: '80',
                prop: 'contractType',
                align: 'center',
                format: {
                  dict: this.$t('datadict.contractType')
                }
              },
              {
                label: 'spot.contractLot.form.headlineNameList',
                width: '210',
                prop: 'headlineNames'
              },
              {
                label: 'spot.contractLot.form.customerNameList',
                width: '210',
                prop: 'customerNames'
              },
              {
                label: 'spot.contractLot.form.signDate',
                width: '90',
                prop: 'signDate',
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.contractLot.form.contractLifeStart',
                width: '90',
                prop: 'contractLifeStart',
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.contractLot.form.contractLifeEnd',
                width: '90',
                prop: 'contractLifeEnd',
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.contractLot.form.deliveryMarketName',
                width: '180',
                prop: 'deliveryMarketName'
              },
              {
                label: 'spot.contractLot.form.currency',
                width: '80',
                prop: 'currency',
                align: 'center',
                format: {
                  dict: this.$t('datadict.currency')
                }
              },
              {
                label: 'spot.contractLot.form.productName',
                width: '180',
                prop: 'productName',
                isSon: true
              },
              ...this.$store.state.user.mainGoodColsTxtSon,
              {
                label: 'spot.contractLot.form.productQuantity',
                width: '120',
                prop: 'productQuantity',
                align: 'right',
                format: {
                  func: 'weight'
                },
                isSon: true
              },
              {
                label: 'spot.contractLot.form.productUnitCode',
                width: '90',
                prop: 'productUnitCode',
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                },
                isSon: true
              },
              {
                label: 'spot.contractLot.form.measurementQuantity',
                width: '120',
                prop: 'measurementQuantity',
                align: 'right',
                format: {
                  func: 'weight'
                },
                isSon: true
              },
              {
                label: 'spot.contractLot.form.measurementUnitCode',
                width: '90',
                prop: 'measurementUnitCode',
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                isSon: true
              },
              {
                label: 'spot.contractLot.form.bizEmployeeName',
                width: '90',
                prop: 'bizEmployeeName'
              },
              {
                label: 'spot.contractLot.form.optEmployeeName',
                width: '90',
                prop: 'optEmployeeName'
              },
              {
                label: 'spot.contractLot.form.docMakeDt',
                prop: 'docMakeDt',
                width: '150',
                align: 'center'
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
    // 是否进行初始化查询
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
  beforeMount() {},
  mounted() {},
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
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

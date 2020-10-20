<!--选择采购批次(多选)-->
<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('spot.contractLot.popup.chooseLotProductPl'),
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
            label: 'spot.contractLot.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.supplierCode',
            prop: 'supplierCode',
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
            label: 'spot.contractLot.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.tradeType',
            prop: 'tradeType',
            element: 'base-select',
            list: this.$t('datadict.tradeType'),
            attrs: {
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
            label: 'spot.contractLot.form.hasRmnFlg',
            prop: 'hasRmnFlg',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
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
            search: '/api/contract/plProductDetail/listChooseStorage'
          },
          apiData: {
            search(param) {
              return Object.assign(param, { defaultSortString: 'docMakeDt.desc' })
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            id: '',
            showCheckbox: true,
            cols: [
              {
                label: 'spot.contractLot.form.contractNo',
                width: '180',
                prop: 'contractNo'
              },
              {
                label: 'spot.contractLot.form.lotNo',
                width: '180',
                prop: 'lotNo'
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
                label: 'spot.contractLot.form.headlineNameList',
                width: '210',
                prop: 'headlineNames'
              },
              {
                label: 'spot.contractLot.form.supplierNameList',
                width: '210',
                prop: 'supplierNames'
              },
              {
                label: 'spot.contractLot.form.productName',
                width: '180',
                prop: 'productName'
              },
              ...this.$store.state.user.mainGoodColsTxt,
              ...this.$store.state.user.reserveGoodColsTxt,
              {
                label: 'spot.contractLot.form.pricingType',
                prop: 'pricingType',
                align: 'center',
                format: {
                  dict: this.$t('datadict.pricingType')
                }
              },
              {
                label: 'spot.contractLot.form.estimatedPrice',
                width: '120',
                prop: 'estimatedPrice',
                align: 'right',
                format: {
                  func: 'money'
                }
              },
              {
                label: 'spot.contractLot.form.productQuantity',
                width: '120',
                prop: 'productQuantity',
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.contractLot.form.rmnPrdQty',
                width: '120',
                prop: 'rmnPrdQty',
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.contractLot.form.productUnitCode',
                width: '90',
                prop: 'productUnitCode',
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                }
              },
              {
                label: 'spot.contractLot.form.measurementQuantity',
                width: '120',
                prop: 'measurementQuantity',
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.contractLot.form.rmnMemQty',
                width: '120',
                prop: 'rmnMemQty',
                align: 'right',
                format: {
                  func: 'weight'
                }
              },
              {
                label: 'spot.contractLot.form.measurementUnitCode',
                width: '90',
                prop: 'measurementUnitCode',
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                }
              },
              {
                label: 'spot.contractLot.form.originalAmount',
                prop: 'originalAmount',
                align: 'right',
                width: '120',
                format: {
                  func: 'money'
                }
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
                label: 'spot.contractLot.form.lotLifeStart',
                width: '90',
                prop: 'lotLifeStart',
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
              },
              {
                label: 'spot.contractLot.form.lotLifeEnd',
                width: '90',
                prop: 'lotLifeEnd',
                align: 'center',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                }
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
  mounted() {
    if (this.$props.initChooseParam.tradeTypeList) {
      if (Array.isArray(this.$props.initChooseParam.tradeTypeList.value)) {
        if (this.$props.initChooseParam.tradeTypeList.value.length > 0) {
          const formData = this.dialog.formData
          let tradeTypeDef = null
          for (let i = 0; i < formData.length; i++) {
            if (formData[i].prop === 'tradeType') {
              tradeTypeDef = formData[i]
              break
            }
          }
          const tradeTypeDict = this.$t('datadict.tradeType')
          tradeTypeDef.list = []
          for (let i = 0; i < tradeTypeDict.length; i++) {
            if (this.$props.initChooseParam.tradeTypeList.value.includes(tradeTypeDict[i].value)) {
              tradeTypeDef.list.push(tradeTypeDict[i])
            }
          }
          if (this.$props.initChooseParam.tradeTypeList.value.length === 1) {
            tradeTypeDef.attrs.disabled = true
            this.$refs.qmDialogTable.listQuery.data.tradeType = this.$props.initChooseParam.tradeTypeList.value[0]
          }
        }
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
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

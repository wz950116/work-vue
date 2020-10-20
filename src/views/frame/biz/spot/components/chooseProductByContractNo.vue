<!--查询对应合同的商品明细(多选)-->
<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('spot.contractLot.popup.chooseProductDtl'),
        moreShowFlg: false,
        formData: [
          {
            label: 'spot.contractLot.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              disabled: true
            }
          }
        ],
        mainData: {
          api: {
            search: this.getApi()
          },
          apiData: {
            search: this.getApiData
          },
          initSearch: this.getInitSearch(),
          table: {
            id: '',
            showCheckbox: true,
            cols: [
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
                width: '90',
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

  methods: {
    getApi() {
      switch (this.$parent.$parent.param.billType) {
        case 'pc':
        case 'pcc':
        case 'pl':
        case 'plc':
        case 'dpc':
        case 'dpcc':
        case 'dpl':
        case 'dplc':
        case 'epc':
        case 'epcc':
        case 'epl':
        case 'eplc':
          return '/api/contract/pcProductDetail/listByContractNo'
        case 'sc':
        case 'scc':
        case 'sl':
        case 'slc':
        case 'dsc':
        case 'dscc':
        case 'dsl':
        case 'dslc':
        case 'esc':
        case 'escc':
        case 'esl':
        case 'eslc':
          return '/api/contract/scProductDetail/listByContractNo'
      }
    },
    getApiData(getParam) {
      return {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: getParam.data.contractNo
      }
    },
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

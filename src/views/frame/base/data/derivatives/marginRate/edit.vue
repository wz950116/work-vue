<template>
  <qm-dialog ref='qmDialog' :dialog='dialog' @closeDialog='hanldeCloseDialog' @initCallback='handleInitCallback'></qm-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/data/ddMarginRate/get',
          save: '/api/data/ddMarginRate/save',
          update: '/api/data/ddMarginRate/update'
        },
        apiData: {
          view(params) {
            return params.id
          },
          save(params) {
            return params.id
          },
          update(params) {
            return params.id
          }
        },
        formData: [
          {
            type: 'date',
            label: 'dataHq.marginRate.saveDate',
            prop: 'saveDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.marginRate.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.marginRate.futuresVarietiesCode',
            prop: 'futuresVarietiesCode',
            element: 'base-select',
            attrs: {
              data: 'FUTURES_VARIETIES',
              clearable: true,
              params: {
                usingFlag: '1'
              }
            },
            event: {
              change: this.productChange
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.marginRate.contractCode',
            prop: 'contractCode',
            element: 'base-select',
            attrs: {
              data: 'FUTURES_CONTRACT',
              clearable: true,
              params: {
                futuresVarietiesCode: 'noData',
                usingFlag: '1'
              }
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.marginRate.hedgeFlag',
            prop: 'hedgeFlag',
            element: 'base-select',
            list: this.$t('datadict.futureHedgeType'),
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'dataHq.marginRate.longMarginRatioByMoney',
            prop: 'longMarginRatioByMoney',
            element: 'input-formatter',
            event: this.priceChange,
            default: 0,
            attrs: {
              min: 0,
              max: 1,
              type: 'money',
              precision: 2
            }
          },
          {
            width: 120,
            label: 'dataHq.marginRate.longMarginRatioByVolume',
            prop: 'longMarginRatioByVolume',
            element: 'input-formatter',
            event: this.priceChange,
            default: 0,
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            width: 120,
            label: 'dataHq.marginRate.shortMarginRatioByMoney',
            prop: 'shortMarginRatioByMoney',
            element: 'input-formatter',
            event: this.priceChange,
            default: 0,
            attrs: {
              min: 0,
              max: 1,
              type: 'thousands',
              precision: 2
            }
          },
          {
            width: 120,
            label: 'dataHq.marginRate.shortMarginRatioByVolume',
            prop: 'shortMarginRatioByVolume',
            element: 'input-formatter',
            event: this.priceChange,
            default: 0,
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view']
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            event: 'save',
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
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    hanldeCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    productChange(value) {
      this.$set(this.dialog.formData[3].attrs.params, 'futuresVarietiesCode', value)
    },
    handleInitCallback(val) {
      this.$set(this.dialog.formData[3].attrs.params, 'futuresVarietiesCode', val.futuresVarietiesCode)
    }
  }
}
</script>

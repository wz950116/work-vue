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
          view: '/api/dvt/externalTrade/get',
          save: '/api/dvt/externalTrade/save',
          update: '/api/dvt/externalTrade/update'
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
            label: 'derivative.externalTrade.tradingDay',
            prop: 'tradingDay',
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
            label: 'derivative.externalTrade.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              params: {
                derivativeCategory: '2',
                derivativeType: '1'
              },
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
            label: 'derivative.externalTrade.futuresContractCode',
            prop: 'futuresContractCode',
            element: 'base-select',
            attrs: {
              data: 'FUTURES_CONTRACT',
              clearable: true,
              params: {
                futuresVarietiesType: '2'
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
            label: 'derivative.externalTrade.tradeId',
            prop: 'tradeId',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: this.getBillNoRequired()
            },
            validate: [
              {
                required: !this.getBillNoRequired(),
                trigger: 'blur'
              }
            ]
          },
          {
            prop: 'direction',
            align: 'center',
            width: '120',
            element: 'base-select',
            label: 'derivative.externalTrade.direction',
            list: this.$t('datadict.futuresDirection'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            width: 120,
            label: 'derivative.externalTrade.price',
            prop: 'price',
            element: 'input-formatter',
            default: 0,
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            width: 120,
            label: 'derivative.externalTrade.volume',
            prop: 'volume',
            element: 'input-formatter',
            default: 0,
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 0
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            width: 120,
            label: 'derivative.externalTrade.commission',
            prop: 'commission',
            element: 'input-formatter',
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
            label: 'derivative.externalTrade.adjustFee',
            prop: 'adjustFee',
            element: 'input-formatter',
            default: 0,
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            type: 'date',
            label: 'derivative.externalTrade.expireDate',
            prop: 'expireDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'derivative.externalTrade.remark',
            prop: 'remark',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'derivative.externalTrade.preliminaryFlag',
            prop: 'preliminaryFlag',
            element: 'el-checkbox',
            default: '0',
            attrs: {
              trueLabel: '1',
              falseLabel: '0'
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
    getBillNoRequired() {
      if (this.opType === 'add') {
        const seqMode = this.$route.meta.seqMode
        if (seqMode && seqMode === '0') {
          return true
        }
        return false
      } else {
        return true
      }
    },
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

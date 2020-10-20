<template>
  <qm-dialog ref='qmDialog' :dialog='dialog' @closeDialog='hanldeCloseDialog' @initCallback='handleInitCallback'></qm-dialog>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'

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
          view: '/api/derivative/dvtExtFuturesAccount/get',
          update: '/api/derivative/dvtExtFuturesAccount/update'
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
            label: 'derivative.externalTradeAccount.brokerName',
            prop: 'brokerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              disabled: true
            }
          },
          {
            label: 'derivative.externalTradeAccount.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true,
              disabled: true
            }
          },
          {
            type: 'date',
            label: 'derivative.externalTradeAccount.tradingDay',
            prop: 'tradingDay',
            attrs: {
              disabled: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.preBalance',
            prop: 'preBalance',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.inFund',
            prop: 'inFund',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.outFund',
            prop: 'outFund',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.closeProfit',
            prop: 'closeProfit',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.positionProfit',
            prop: 'positionProfit',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.commission',
            prop: 'commission',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.posiMargin',
            prop: 'posiMargin',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.available',
            prop: 'available',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            width: 120,
            label: 'derivative.externalTradeAccount.balance',
            prop: 'balance',
            element: 'input-formatter',
            default: 0,
            attrs: {
              type: 'thousands',
              precision: 4
            }
          },
          {
            label: 'derivative.externalTradeAccount.currencyName',
            prop: 'currencyCode',
            element: 'base-select',
            attrs: {
              data: 'CURRENCY',
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
            label: 'derivative.externalTradeAccount.preliminaryFlag',
            prop: 'preliminaryFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
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
            label: 'derivative.externalTradeAccount.remark',
            prop: 'remark',
            element: 'input-validate',
            attrs: {
              clearable: true,
              cols: 2
            },
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
            },
            extraEvent: this.checkProfit
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

    },
    handleInitCallback(val) {

    },
    checkProfit() {
      if ((!this.$refs.qmDialog.formData.closeProfit || this.$refs.qmDialog.formData.closeProfit === 0) &&
        (!this.$refs.qmDialog.formData.positionProfit || this.$refs.qmDialog.formData.positionProfit === 0)) {
        this.$notify(
          notifyInfo({
            msg: this.$t('derivative.externalTradeAccount.msg.profitIsEmpty')
          })
        )
        return false
      }
      return true
    }
  }
}
</script>

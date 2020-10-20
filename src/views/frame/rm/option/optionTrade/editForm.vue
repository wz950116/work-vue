<template>
  <qm-dialog ref="qmDialog" :dialog="dialog" @closeDialog="handleCloseDialog" @initCallback='initCallback'></qm-dialog>
</template>

<script>
import request from '@/utils/frame/base/request'
import { dateFormate } from '@/utils/frame/base/index'

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
          view: '/api/derivative/dvtOptionTrade/get',
          save: '/api/derivative/dvtOptionTrade/save',
          update: '/api/derivative/dvtOptionTrade/update'
        },
        apiData: {
          view(param) {
            return param.id
          }
        },
        formData: [
          {
            label: 'option.trade.form.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true,
              params: {
                derivativeType: '2'
              }
            }
          },
          {
            width: 120,
            label: 'option.trade.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'CUST_INFO',
              clearable: true,
              params: {
                typeCode: '12',
                usingFlag: '1',
                auditStatus: '3'
              }
            }
          },
          {
            label: 'option.trade.form.optionContract',
            prop: 'optionContract',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'OPTION_CONTRACT'
            },
            event: {
              change: this.contractChange
            }
          },
          {
            label: 'option.trade.form.currencyCode',
            prop: 'currencyCode',
            element: 'base-select',
            attrs: {
              data: 'CURRENCY',
              disabled: true
            }
          },
          {
            label: 'option.trade.form.direction',
            prop: 'direction',
            element: 'base-select',
            list: this.$t('datadict.optionDirection'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'option.trade.form.callPut',
            prop: 'callPut',
            element: 'base-select',
            list: this.$t('datadict.callPut'),
            attrs: {
              disabled: true
            }
          },
          {
            type: 'date',
            label: 'option.trade.form.endDate',
            prop: 'endDate',
            attrs: {
              disabled: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'option.trade.form.optionOffset',
            prop: 'optionOffset',
            element: 'base-select',
            list: this.$t('datadict.optionOffset'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'option.trade.form.strikePrice',
            prop: 'strikePrice',
            element: 'input-formatter',
            attrs: {
              disabled: true,
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            label: 'option.trade.form.price',
            prop: 'price',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            label: 'option.trade.form.volume',
            prop: 'volume',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 0
            }
          },
          {
            label: 'option.trade.form.commission',
            prop: 'commission',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            label: 'option.trade.form.premium',
            prop: 'premium',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            label: 'option.trade.form.underlyingPrice',
            prop: 'underlyingPrice',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            type: 'date',
            label: 'option.trade.form.tradingDay',
            prop: 'tradingDay',
            default: dateFormate(new Date(), 'yyyyMMdd'),
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'option.trade.form.counterparty',
            prop: 'counterparty',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              clearable: true,
              params: {
                typeCode: '4',
                usingFlag: '1',
                auditStatus: '3'
              }
            }
          },
          {
            label: 'option.trade.form.tradeId',
            prop: 'tradeId',
            element: 'input-validate',
            attrs: {
              disabled: this.getBillNoRequired(),
              clearable: true
            },
            validate: [
              {
                required: !this.getBillNoRequired(),
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'option.trade.form.preliminaryFlag',
            prop: 'preliminaryFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true
            }
          }
        ],
        bottomButtons: [
          {
            iconName: '线性-返回',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view']
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
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
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  mounted() {},
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
    initCallback(data) {
      if (data.underlyingType === '1') {
        this.dialog.formData[5].attrs.data = 'DD_PRODUCT'
      } else {
        this.dialog.formData[5].attrs.data = 'FUTURES_CONTRACT'
      }
    },
    contractChange(value) {
      request({
        url: '/api/data/ddOptionContract/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: value
        }
      }).then(response => {
        const form = this.$refs.qmDialog.$refs.refForm.model
        const data = response.data
        form.currencyCode = data.currencyCode
        form.callPut = data.callPut
        form.endDate = data.endDate
        form.strikePrice = data.strikePrice
      })
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

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
          view: '/api/data/ddOptionContract/get',
          save: '/api/data/ddOptionContract/save',
          update: '/api/data/ddOptionContract/update'
        },
        apiData: {
          view(param) {
            return param.optionContractCode
          }
        },
        formData: [
          {
            label: 'dataHq.optionContract.form.optionVarietiesCode',
            prop: 'optionVarietiesCode',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'OPTION_VARIETIES',
              clearable: true
            },
            event: {
              change: this.varietiesChange
            }
          },
          {
            label: 'dataHq.optionContract.form.exchangeCode',
            prop: 'exchangeCode',
            element: 'base-select',
            attrs: {
              data: 'EXCHANGE',
              disabled: true
            }
          },
          {
            label: 'dataHq.optionContract.form.optionContractCode',
            prop: 'optionContractCode',
            element: 'input-validate',
            required: true,
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.optionContract.form.optionContractName',
            prop: 'optionContractName',
            element: 'input-validate',
            required: true,
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.optionVarieties.form.underlyingType',
            prop: 'underlyingType',
            element: 'base-select',
            list: this.$t('datadict.underlyingType'),
            attrs: {
              disabled: true
            }
          },
          {
            label: 'dataHq.optionContract.form.underlyingProduct',
            prop: 'underlyingProduct',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'dataHq.optionContract.form.strikePrice',
            prop: 'strikePrice',
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
            label: 'dataHq.optionContract.form.callPut',
            prop: 'callPut',
            element: 'base-select',
            list: this.$t('datadict.callPut'),
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
            label: 'dataHq.optionContract.form.combinationType',
            prop: 'combinationType',
            element: 'base-select',
            list: this.$t('datadict.combinationType'),
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'dataHq.optionContract.form.endDate',
            prop: 'endDate',
            default: dateFormate(new Date(), 'yyyyMMdd'),
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'dataHq.optionContract.form.contractMultiplier',
            prop: 'contractMultiplier',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2,
              disabled: true
            }
          },
          {
            label: 'dataHq.optionContract.form.currencyCode',
            prop: 'currencyCode',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'CURRENCY',
              clearable: true
            }
          },
          {
            label: 'dataHq.optionContract.form.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
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
  mounted() { },
  methods: {
    initCallback(data) {
      if (data.underlyingType === '1') {
        this.dialog.formData[5].attrs.data = 'DD_PRODUCT'
      } else {
        this.dialog.formData[5].attrs.data = 'FUTURES_CONTRACT'
      }
    },
    varietiesChange(value) {
      request({
        url: '/api/data/ddOptionVarieties/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: value
        }
      }).then(response => {
        const form = this.$refs.qmDialog.$refs.refForm.model
        const data = response.data
        form.exchangeCode = data.exchangeCode
        form.underlyingType = data.underlyingType
        form.contractMultiplier = data.contractMultiplier
        form.currencyCode = data.currencyCode
        form.underlyingProduct = ''
        if (data.underlyingType === '1') {
          this.dialog.formData[5].attrs.data = 'DD_PRODUCT'
        } else {
          this.dialog.formData[5].attrs.data = 'FUTURES_CONTRACT'
        }
      })
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

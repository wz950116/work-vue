<template>
  <qm-dialog :dialog="dialog" @closeDialog="hanldeCloseDialog"></qm-dialog>
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
        titleName: this.$t('dataHq.exchangeRate.form.conversionTitle'),
        api: {
          view: '/api/data/exchangeRate/get',
          save: '/api/data/exchangeRate/saveConversion',
          update: '/api/data/exchangeRate/saveConversion'
        },
        apiData: {
          view(param) {
            return param.id
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.id
          }
        },
        formData: [
          {
            label: 'dataHq.exchangeRate.form.sourceCurrency',
            prop: 'sourceCurrency',
            element: 'currency',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            component: () =>
              import('@/views/frame/base/data/components/Currency'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.exchangeRate.form.targetCurrency',
            prop: 'targetCurrency',
            element: 'currency',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            component: () =>
              import('@/views/frame/base/data/components/Currency'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.exchangeRate.form.decimalDigit',
            prop: 'decimalDigit',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
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
            label: 'dataHq.exchangeRate.form.conversionMode',
            prop: 'conversionMode',
            element: 'base-select',
            list: this.$t('datadict.conversionMode'),
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
            isShow: ['add', 'update']
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
  methods: {
    hanldeCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

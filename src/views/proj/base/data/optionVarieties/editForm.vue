<template>
  <qm-dialog :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog>
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
          view: '/api/data/ddOptionVarieties/get',
          save: '/api/data/ddOptionVarieties/save',
          update: '/api/data/ddOptionVarieties/update'
        },
        apiData: {
          view(param) {
            return param.optionVarietiesCode
          }
        },
        formData: [
          {
            label: 'dataHq.optionVarieties.form.underlyingType',
            prop: 'underlyingType',
            element: 'base-select',
            list: this.$t('datadict.underlyingType'),
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
            label: 'dataHq.optionVarieties.form.optionVarietiesType',
            prop: 'optionVarietiesType',
            element: 'base-select',
            list: this.$t('datadict.optionVarietiesType'),
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
            label: 'dataHq.optionVarieties.form.optionVarietiesName',
            prop: 'optionVarietiesName',
            element: 'input-validate',
            required: true
          },
          {
            label: 'dataHq.optionVarieties.form.optionVarietiesCode',
            prop: 'optionVarietiesCode',
            element: 'input-validate',
            required: true
          },
          {
            label: 'dataHq.optionVarieties.form.exchangeCode',
            prop: 'exchangeCode',
            element: 'base-select',
            attrs: {
              data: 'EXCHANGE',
              clearable: true,
              params: {
                usingFlag: '1'
              }
            }
          },
          {
            label: 'dataHq.optionVarieties.form.contractMultiplier',
            prop: 'contractMultiplier',
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
            label: 'dataHq.optionVarieties.form.currencyCode',
            prop: 'currencyCode',
            element: 'base-select',
            default: 'CNY',
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
            label: 'dataHq.optionVarieties.form.usingFlag',
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
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

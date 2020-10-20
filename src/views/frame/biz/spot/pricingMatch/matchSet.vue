<template>
  <qm-dialog :dialog='dialog' @closeDialog='hanldeCloseDialog'></qm-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'param',
        titleName: this.$t('spot.pricingMatch.popup.matchPoint'),
        api: {
          view: '',
          update: '/api/pricingMatchPoint/save'
        },
        apiData: {
          view(param) {
            return param
          },
          update(param) {
            return param
          }
        },
        formData: [
          {
            label: 'spot.pricingMatch.form.contractCode',
            prop: 'contractNo',
            element: 'input-validate',
            validate: [
              {
                required: false,
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'spot.pricingMatch.form.purchaseOrSale',
            prop: 'purchaseOrSale',
            element: 'base-select',
            list: this.$t('datadict.purchaseOrSale'),
            validate: [
              {
                required: false,
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'spot.pricingMatch.form.matchPoint',
            prop: 'matchPoint',
            element: 'base-select',
            list: this.$t('datadict.pricingMatchPoint'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {}
          }
        ],
        bottomButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update', 'set']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            isShow: ['add', 'update', 'set'],
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
  mounted() {
    if (this.param.purchaseOrSale === 'P') {
      this.dialog.formData[2].list = this.$t('datadict.pricingMatchPointP')
    } else {
      this.dialog.formData[2].list = this.$t('datadict.pricingMatchPointS')
    }
  },
  methods: {
    hanldeCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

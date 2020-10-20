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
          view: '/api/data/ddPrefixAddress/get',
          save: '/api/data/ddPrefixAddress/save',
          update: '/api/data/ddPrefixAddress/update'
        },
        apiData: {
          view(param) {
            return param.areaCode
          }
        },
        formData: [
          {
            label: 'dataHq.prefixAddress.brokerCode',
            prop: 'brokerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '4'
              },
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          }, {
            label: 'data.product.form.usingFlag',
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
          },
          {
            label: 'dataHq.prefixAddress.transactionAddress',
            prop: 'transactionAddress',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'dataHq.prefixAddress.marketAddress',
            prop: 'marketAddress',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              cols: 2
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

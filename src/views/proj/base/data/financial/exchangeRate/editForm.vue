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
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/data/exchangeRate/get',
          save: '/api/data/exchangeRate/save',
          update: '/api/data/exchangeRate/update'
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
            label: 'dataHq.exchangeRate.form.exchangeRateCode',
            prop: 'exchangeRateCode',
            element: 'el-input',
            validate: [{
              required: true,
              trigger: 'change'
            }],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.exchangeRate.form.exchangeRateName',
            prop: 'exchangeRateName',
            element: 'el-input',
            validate: [{
              required: true,
              trigger: 'change'
            }],
            attrs: {
              clearable: true
            }
          }, {
            label: 'data.pricingBase.form.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              clearable: true
            }
          }],
        bottomButtons: [{
          iconName: '线性-返回',
          name: 'biz.btn.close',
          event: 'close',
          isShow: ['view']
        }, {
          iconName: '线性-取消',
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['add', 'update']
        }, {
          name: 'biz.btn.save',
          iconName: '线性-保存',
          event: 'save',
          isShow: ['add', 'update']
        }]
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

<template>
  <qm-dialog :dialog="dialog" @closeDialog="hanldeCloseDialog" :initFun='initFun'></qm-dialog>
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
          view: '/api/data/interestRate/get',
          save: '/api/data/interestRate/save',
          update: '/api/data/interestRate/update'
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
            label: 'dataHq.interestRate.currencyName',
            prop: 'currencyCode',
            element: 'currency',
            component: () => import('@/views/frame/base/data/components/Currency'),
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'dataHq.interestRate.theDate',
            prop: 'theDate',
            element: 'el-input',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          }, {
            label: 'dataHq.interestRate.interestRate',
            prop: 'interestRate',
            element: 'input-formatter',
            attrs: {
              clearable: true,
              type: 'percent'
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
    },

    initFun(formData) {
      formData.interestRate = formData.interestRate * 100 + ''
    }
  }
}
</script>

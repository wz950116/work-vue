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
          view: '/api/dd/pricing/base/get',
          save: '/api/dd/pricing/base/save',
          update: '/api/dd/pricing/base/update'
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
        formData: [{
          label: 'data.pricingBase.form.pricingName',
          prop: 'pricingName',
          element: 'input-validate',
          validate: [{
            required: true,
            trigger: 'blur'
          }],
          attrs: {
            clearable: true
          }
        }, {
          label: 'data.pricingBase.form.usingFlag',
          prop: 'usingFlag',
          element: 'base-select',
          default: '1',
          list: this.$t('datadict.usingFlag'),
          validate: [{
            required: true,
            trigger: 'change'
          }],
          attrs: {
            clearable: true
          }
        }, {
          label: 'data.pricingBase.form.pricingFormula',
          prop: 'pricingFormula',
          element: 'el-input',
          validate: [{
            required: true,
            trigger: 'change'
          }],
          attrs: {
            cols: 2,
            clearable: true
          }
        }, {
          label: 'data.pricingBase.form.remark',
          prop: 'remark',
          element: 'el-input',
          attrs: {
            cols: 2,
            clearable: true
          }
        }],
        bottomButtons: [{
          iconName: '线性-关闭',
          name: 'biz.btn.close',
          event: 'close',
          isShow: ['view'],
          attrs: {
            type: 'primary'
          }
        }, {
          iconName: '线性-取消',
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['add', 'update']
        }, {
          name: 'biz.btn.save',
          iconName: '线性-保存',
          event: 'save',
          showLoading: true,
          isShow: ['add', 'update'],
          attrs: {
            type: 'primary'
          }
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
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
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
          view: '/api/dd/unit/get',
          save: '/api/dd/unit/save',
          update: '/api/dd/unit/update'
        },
        apiData: {
          view(param) {
            return param.unitCode
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.unitCode
          }
        },
        formData: [
          {
            label: 'data.unit.form.unitName',
            prop: 'unitName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.unit.form.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.unit.form.remark',
            prop: 'remark',
            element: 'el-input',
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
            showLoading: true,
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
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    attachment() { },
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

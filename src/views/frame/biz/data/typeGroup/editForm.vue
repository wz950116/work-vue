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
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/rm/ddTypeGroup/get',
          save: '/api/rm/ddTypeGroup/save',
          update: '/api/rm/ddTypeGroup/update'
        },
        apiData: {
          view(param) {
            return param.groupCode
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.groupCode
          }
        },
        formData: [
          {
            label: 'dataHq.typeGroup.form.groupName',
            prop: 'groupName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: this.opType !== 'add',
              clearable: true
            }
          },
          {
            label: 'dataHq.typeGroup.form.groupCode',
            prop: 'groupCode',
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
            label: 'dataHq.typeGroup.form.usingFlag',
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
            label: 'dataHq.typeGroup.form.remark',
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
      type: Object,
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
    hanldeCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

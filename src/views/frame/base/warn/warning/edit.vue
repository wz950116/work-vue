<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'tenantManageAdd',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/warn/warning/get',
          save: '/api/warn/warning/insert',
          update: '/api/warn/warning/update'
        },
        apiData: {
          view(param) {
            return param.warningCode
          }
        },
        formData: [
          {
            label: 'data.warning.warningName',
            prop: 'warningName',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.warning.warningType',
            prop: 'warningType',
            element: 'base-select',
            attrs: {
              datadict: 'warningType',
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.warning.sourceCode',
            prop: 'sourceCode',
            element: 'base-select',
            attrs: {
              data: 'WARN_SOURCE',
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.warning.triggerType',
            prop: 'triggerType',
            element: 'base-select',
            list: this.$t('datadict.triggerType'),
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.warning.triggerTime',
            prop: 'triggerTime',
            element: 'el-time-picker',
            attrs: {
              clearable: true,
              pickerOptions: {
                start: '00:00',
                step: '01:00'
              },
              valueFormat: 'HHmmss'
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            prop: 'recordFlag',
            width: '100',
            label: 'data.warning.recordFlag',
            list: this.$t('datadict.yesNo'),
            default: '0',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            type: 'radio',
            list: this.$t('datadict.usingFlag'),
            default: '0',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'biz.lbl.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              cols: 4,
              clearable: true
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            event: 'save',
            showLoading: true,
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
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

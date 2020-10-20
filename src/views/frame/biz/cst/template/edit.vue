<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'dictEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/cust/custTemplate/get',
          save: '/api/cust/custTemplate/save',
          update: '/api/cust/custTemplate/update'
        },
        apiData: {
          view(param) {
            return param
          }
        },
        formData: [
          {
            label: 'cst.template.form.templateCode',
            prop: 'templateCode',
            element: 'input-validate',
            validate: [
              {
                required: !this.autoFlag(),
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: this.autoFlag(),
              clearable: true
            }
          },
          {
            label: 'cst.template.form.templateName',
            prop: 'templateName',
            element: 'input-validate',
            attrs: {
              clearable: true,
              maxlength: 80
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'cst.template.form.templateType',
            prop: 'templateType',
            element: 'base-select',
            list: this.$t('datadict.templateType'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'cst.template.form.maxPoint',
            prop: 'maxPoint',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              max: 999999,
              min: 0,
              precision: 0
            }
          },
          {
            label: 'cst.template.form.usingFlag',
            prop: 'usingFlag',
            type: 'radio',
            list: this.$t('datadict.usingFlag'),
            default: '1',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'cst.template.form.remark',
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
  created() {},
  methods: {
    // 是否自动采番
    autoFlag() {
      if ((this.$route.params.type || this.$route.params.opType) === 'add') {
        const seqMode = this.$route.meta.seqMode
        if (seqMode && seqMode === '0') {
          return true
        }
        return false
      } else {
        return true
      }
    },
    isReadonlyAll() {
      return false
    },
    getDisabled() {
      if (this.opType === 'add') {
        return false
      } else {
        return true
      }
    },
    attachment() {},
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

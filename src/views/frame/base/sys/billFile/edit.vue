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
        styleType: 'medium',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/sys/fileType/get',
          save: '/api/sys/fileType/save',
          update: '/api/sys/fileType/update'
        },
        apiData: {
          view(param) {
            return param.fileType
          },
          save(param) {
            return param.fileType
          },
          update(param) {
            return param.fileType
          }
        },
        formData: [
          {
            label: 'sys.fileType.typeName',
            prop: 'typeName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              cols: 2,
              clearable: true,
              maxlength: 200
            }
          },
          {
            prop: 'fileType',
            isShow: false
          },
          {
            label: 'biz.lbl.moduleCode',
            prop: 'moduleCode',
            default: this.getDefaultModuleCode(),
            element: 'base-select',
            attrs: {
              data: 'MENU_MODULE',
              disabled: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'sys.fileType.required',
            prop: 'required',
            type: 'radio',
            list: this.$t('datadict.yesNo'),
            default: '1',
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
            label: 'invoice.foreignInvoiceMake.form.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              cols: 2,
              clearable: true,
              maxlength: 500
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
    getDefaultModuleCode() {
      if (this.opType === 'add') {
        return this.param.moduleCode
      } else {
        return ''
      }
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

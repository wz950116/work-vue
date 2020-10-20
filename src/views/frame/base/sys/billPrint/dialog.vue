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
        initType: 'param',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/sys/sysBillPrint/get',
          save: '/api/sys/sysBillPrint/save',
          update: '/api/sys/sysBillPrint/update'
        },
        formData: [
          {
            label: 'sys.billPrint.form.printName',
            prop: 'printName',
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
            label: 'biz.lbl.moduleCode',
            prop: 'moduleCode',
            default: this.getDefaultModuleCode(),
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            element: 'base-select',
            attrs: {
              data: 'MENU_MODULE',
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'sys.billPrint.form.printDefault',
            prop: 'printDefault',
            type: 'radio',
            list: this.$t('datadict.yesNo'),
            default: '1'
          },
          {
            label: 'sys.billPrint.form.printJsppath',
            prop: 'printJsppath',
            element: 'el-input',
            attrs: {
              cols: 2
            }
          },
          {
            label: 'biz.lbl.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              cols: 2
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

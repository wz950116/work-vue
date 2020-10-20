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
          view: '/api/bpm/businessDefine/get',
          save: '/api/bpm/businessDefine/save',
          update: '/api/bpm/businessDefine/save'
        },
        apiData: {
          id: this.param.id,
          view() {
            return {
              id: this.id,
              modeType: ''
            }
          }
        },
        formData: [
          {
            prop: 'id',
            default: this.getDefaultId(),
            isShow: false
          },
          {
            prop: 'modeType',
            default: this.getModeType(),
            isShow: false
          },
          {
            prop: 'businessType',
            default: this.getDefaultBusinessType(),
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
            label: 'sys.bpmSet.form.processDefineKey',
            prop: 'processDefineKey',
            element: 'input-validate',
            default: this.getDefaultProcessKey(),
            isShow: []
          },
          {
            label: 'sys.bpmSet.form.businessName',
            prop: 'businessName',
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
            label: 'sys.bpmSet.form.bpmType',
            prop: 'bpmType',
            element: 'base-select',
            list: this.$t('datadict.bpmType'),
            validate: [
              {
                required: true
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.bpmSet.form.businessDesp',
            prop: 'businessDesp',
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
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    getModeType() {
      return this.opType
    },
    getDefaultProcessKey() {
      return this.param.processDefineKey
    },
    getDefaultModuleCode() {
      return this.param.moduleCode
    },
    getDefaultBusinessType() {
      return this.param.businessType
    },
    getDefaultId() {
      return this.param.id
    }
  }
}
</script>

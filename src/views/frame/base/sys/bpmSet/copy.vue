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
          view: '/api/bpm/businessDefine/get',
          save: '/api/bpm/processInstance/copyAudit',
          update: '/api/bpm/processInstance/copyAudit'
        },
        formData: [
          {
            label: 'sys.bpmSet.form.businessType',
            prop: 'businessType',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            isShow: [],
            default: '1',
            attrs: {
              disabled: true
            }
          },
          {
            label: 'sys.bpmSet.form.oldModuleCode',
            prop: 'oldModuleCode',
            element: 'tree-bill-menu',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: true
            }
          },
          {
            label: 'sys.bpmSet.form.moduleCode',
            prop: 'moduleCode',
            element: 'tree-bill-menu',
            component: () => import('@/views/frame/base/sys/bpmSet/components/TreeBillMenu.vue'),
            attrs: {
              usingFlag: '',
              clickParent: false,
              multiple: false
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
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
            label: 'sys.bpmSet.form.businessDesp',
            prop: 'businessDesp',
            element: 'el-input'
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update', 'copy']
          },
          {
            name: 'biz.btn.save',
            event: 'save',
            showLoading: true,
            isShow: ['add', 'update', 'copy'],
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
      default: 'copy'
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
    }
  }
}
</script>

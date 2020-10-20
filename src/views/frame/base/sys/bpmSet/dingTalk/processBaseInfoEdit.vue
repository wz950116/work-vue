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
          view: '/api/dingtalk/bpmProcessBaseInfo/get',
          save: '/api/dingtalk/bpmProcessBaseInfo/save',
          update: '/api/dingtalk/bpmProcessBaseInfo/update'
        },
        apiData: {
          view(param) {
            return param.id
          }
        },
        formData: [
          {
            prop: 'id',
            default: this.getId(),
            isShow: false
          },
          {
            prop: 'docKey',
            label: 'sys.bpmSet.form.moduleCode',
            element: 'input-validate',
            default: this.getDocKey(),
            isShow: false
          },
          {
            prop: 'processId',
            label: 'sys.bpmSet.form.processId',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              cols: 2,
              clearable: true
            }
          },
          {
            prop: 'processName',
            label: 'sys.bpmSet.form.processName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              cols: 2,
              clearable: true
            }
          },
          {
            prop: 'priority',
            label: 'sys.bpmSet.form.priority',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 99999999,
              type: 'num',
              clearable: true
            }
          },
          {
            prop: 'groupName',
            label: 'sys.bpmSet.form.groupName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            prop: 'processDescription',
            label: 'sys.bpmSet.form.processDescription',
            element: 'input-validate',
            attrs: {
              cols: 2,
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
  mounted() { },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeAndRefreshHandler', params)
    },
    getId() {
      return this.param.id
    },
    getDocKey() {
      return this.param.docKey
    }
  }
}
</script>

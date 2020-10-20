<template>
  <qm-dialog ref='qmDialog' :dialog='dialog' @closeDialog='hanldeCloseDialog'>
  </qm-dialog>
</template>

<script>
import { encriptPwd } from '@/utils/frame/base/encript.js'
import request from '@/utils/frame/base/request'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      name: 'projectEdit',
      dialogVisibleSp: false,
      isShow: true,
      moduleCode: '0056',
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/dd/project/get',
          save: '/api/dd/project/save',
          update: '/api/dd/project/update'
        },
        apiData: {
          view(params) {
            return params.id || params.uk
          },
          save(params) {
            return params.id
          },
          update(params) {
            return params.id
          }
        },
        formData: [
          {
            label: 'dataHq.projectFile.projectFileName',
            prop: 'projectName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'dataHq.projectFile.projectFileCode',
            prop: 'projectCode',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'dataHq.projectFile.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'dataHq.projectFile.remark',
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
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view']
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            event: 'save',
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
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    submit() {
      this.$refs.qmDialog.$refs.refForm.validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('biz.msg.confirmSubmitAudit'),
            this.$t('biz.msg.tip'),
            {
              type: 'warning',
              closeOnClickModal: false,
              confirmButtonText: this.$t('biz.btn.confirm'),
              cancelButtonText: this.$t('biz.btn.cancel')
            }
          )
            .then(() => {
              // 加密的处理
              if (this.dialog.formData instanceof Array) {
                this.dialog.formData.forEach(v => {
                  if (v.attrs && v.attrs.encript) {
                    this.$refs.qmDialog.formData[v.prop] = encriptPwd(
                      this.$refs.qmDialog.formData[v.prop]
                    )
                  }
                })
              }
              const nextUserObj = {
                bpmVariableParamList: [],
                id: this.$refs.qmDialog.formData.id
              }
              request({
                url: this.dialog.api.submit,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.submit'),
                  data: nextUserObj
                }
              })
                .then(response => {
                  this.$notify(
                    notifySuccess({ msg: this.$t('biz.msg.submitSuccess') })
                  )
                  this.$emit('closeHandler', true)
                })
                .catch(() => {})
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    // 关闭弹窗回调
    closeSubmitHandler(isSubmit, params) {
      this.dialogVisibleSp = false
      this.loading = true
      if (isSubmit) {
        const nextUserObj = {
          bpmVariableParamList: [],
          id: this.$refs.qmDialog.formData.id
        }
        request({
          url: this.dialog.api.submit,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.submit'),
            data: nextUserObj
          }
        })
          .then(response => {
            this.$notify(
              notifySuccess({ msg: this.$t('biz.msg.submitSuccess') })
            )
            this.$emit('closeHandler', true)
          })
          .catch(() => {})
      } else {
        this.loading = false
        this.$emit('closeHandler', true)
      }
    },
    hanldeCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>

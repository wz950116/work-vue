<template>
  <qm-dialog ref='qmDialog' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import { encriptPwd } from '@/utils/frame/base/encript.js'
import { leftList } from '@/api/frame/base/finance'
import { getRandom, aesEncrypt } from '@/utils/frame/base/crypto'

export default {
  name: 'userEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/finance/account/get',
          save: '/api/finance/account/save',
          update: '/api/finance/account/update'
        },
        formData: [
          {
            type: 'radio',
            label: '总账凭证接口',
            prop: 'interfance',
            list: [],
            attrs: {
              clearable: true,
              cols: 4
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            default: []
          },
          {
            label: '账套名称',
            prop: 'name',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 3
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'url',
            prop: 'url',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 3
            }
          },
          {
            type: 'radio',
            label: '是否主账套',
            prop: 'isMaster',
            list: [
              {
                label: '是',
                value: 1
              },
              {
                label: '否',
                value: 0
              }
            ],
            attrs: {
              clearable: true,
              cols: 3
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            default: []
          },
          {
            type: 'radio',
            label: '状态',
            prop: 'state',
            list: [
              {
                label: '启用',
                value: '1'
              },
              {
                label: '停用',
                value: '0'
              }
            ],
            attrs: {
              clearable: true,
              cols: 3
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            default: []
          },
          {
            label: '备注',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 3
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
            event: this.save,
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
  created() {
    leftList().then(data => {
      this.dialog.formData[0].list = data.data.map(v => {
        return {
          label: v.name,
          value: v.id
        }
      })
    })
  },
  methods: {
    // 保存通用事件
    save() {
      this.$refs.qmDialog.$refs.refForm.validate(valid => {
        if (valid) {
          this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              if (this.opType === 'add') {
                // 加密的处理
                const random = getRandom(8)
                this.$refs.qmDialog.formData['random'] = random
                this.$refs.qmDialog.formData['passwordO'] = aesEncrypt(this.$refs.qmDialog.formData['password'], random)
                this.$refs.qmDialog.formData['password'] = encriptPwd(this.$refs.qmDialog.formData['password'])
              }
              request({
                url: this.$refs.qmDialog.dialog.type === 'add' ? this.$refs.qmDialog.dialog.api.save : this.$refs.qmDialog.dialog.api.update,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.$refs.qmDialog.formData
                }
              })
                .then(response => {
                  this.$notify(notifySuccess({ msg: this.$t('biz.msg.saveSuccess') }))
                  this.$emit('closeHandler', true, true)
                })
                .catch(() => {})
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    getDisabled() {
      return !this.opType === 'add'
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>

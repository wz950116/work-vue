<template>
  <qm-dialog :dialog='dialog' ref='qmDialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
import { notifySuccess } from '@/utils/frame/base/notifyParams'

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
          view: '',
          save: '',
          update: ''
        },
        apiData: {
          view(param) {
            return param.id
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.id
          }
        },
        formData: [
          {
            label: 'platform.component.form.assistant',
            prop: 'assistant',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              clearable: true
            }
          },
          {
            label: 'platform.component.form.assistMsg',
            prop: 'assistMsg',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 2
            }
          }
        ],
        bottomButtons: [
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['assist', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: this.toSendAssistAudit,
            isShow: ['assist', 'update'],
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
      default: 'assist'
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
    // 发送协助审核
    toSendAssistAudit(ids, assistMsg) {
      var assistListInfoObj = []
      const item = {
        taskId: this.param.id, // 任务ID
        account: this.$refs.qmDialog.formData.assistant, // 协助人账号
        accountName: this.$refs.qmDialog.$children[1].$el[0].value, // 协助人名称
        assistMsg: this.$refs.qmDialog.formData.assistMsg // 协助信息
      }
      assistListInfoObj.push(item)

      request({
        url: '/api/bpm/backlog/sendAssistAudit',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.auditHelp'),
          data: assistListInfoObj
        }
      })
        .then(response => {
          if (response.data) {
            this.$notify(
              notifySuccess({
                msg: this.$t('biz.msg.sendAssistAuditSuccess')
              })
            )
            const data = { closeParent: true }
            this.handleCloseDialog(data)
          }
        })
        .catch(() => { })
    }
  }
}
</script>

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
            label: 'platform.component.form.transfer',
            prop: 'transfer',
            element: 'base-select',
            attrs: {
              data: 'BPM_TASK_USER',
              params: {
                taskId: this.param.id // 任务代码
              }
            }
          },
          {
            label: 'platform.component.form.transferMsg',
            prop: 'transferMsg',
            element: 'el-input',
            attrs: {
              clearable: true,
              type: 'textarea',
              cols: 2
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['assist', 'update']
          },
          {
            name: 'biz.btn.save',
            event: this.toSendTransferAudit,
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
    toSendTransferAudit(ids, assistMsg) {
      const item = {
        taskId: this.param.id, // 任务ID
        uk: this.param.uk, // 任务ID
        assignee: this.$refs.qmDialog.formData.transfer,
        transferMsg: this.$refs.qmDialog.formData.transferMsg
      }

      request({
        url: '/api/bpm/task/transferTask',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.transferAudit'),
          data: item
        }
      })
        .then(response => {
          if (response.data) {
            this.$notify(
              notifySuccess({
                msg: this.$t('biz.msg.sendTransferAuditSuccess')
              })
            )
            this.$nextTick(() => {
              const data = { closeParent: true }
              this.handleCloseDialog(data)
            })
            this.$store.dispatch('delVisitedViews', this.$route).then(() => {
              this.$router.push({
                name: 'todo',
                params: {
                  refresh: true
                }
              })
            })
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<template>
  <qm-dialog :dialog='dialog' ref='qmDialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { notifySuccess } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      auditOption: '', // 审核意见
      taskId: '', // 任务ID
      moduleCode: '', // 模块代码
      businessPrimaryId: '', // 业务主键ID

      dialog: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        styleType: 'mini',
        initType: 'param',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          getNodeInfo: '/api/bpm/backlog/getNodeInfo'
        },
        apiData: {
          getNodeInfo(param) {
            return param
          }
        },
        // 若只存在一个主信息则formData的值可接受Array
        formData: [
          {
            label: 'platform.component.form.time',
            prop: 'startTime',
            element: 'input-validate',
            attrs: {
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'platform.component.form.bill',
            prop: 'moduleName',
            element: 'input-validate',
            attrs: {
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'platform.component.form.businessName',
            prop: 'businessName',
            element: 'input-validate',
            attrs: {
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'platform.component.form.submitter',
            prop: 'submitter',
            element: 'input-validate',
            attrs: {
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'platform.component.form.assistMsg',
            prop: 'assistMsg',
            element: 'el-input',
            isShow: ['assist'],
            attrs: {
              cols: 4,
              disabled: true
            }
          },
          {
            label: 'platform.component.form.opinion',
            prop: 'opinion',
            element: 'el-input',
            attrs: {
              cols: 4,
              type: 'textarea',
              clearable: true
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['audit', 'assist']
          },
          {
            name: 'biz.btn.refuse',
            event: this.doRefuse,
            isShow: ['audit', 'assist']
          },
          {
            name: 'biz.btn.assist',
            event: this.doAssist,
            isShow: ['audit']
          },
          {
            name: 'biz.btn.transferAudit',
            event: this.doTransferAudit,
            isShow: ['audit']
          },
          {
            name: 'biz.btn.agree',
            event: this.doAgree,
            showLoading: true,
            isShow: ['audit', 'assist'],
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
      default: 'audit'
    },
    opMode: {
      type: String,
      default: 'dialog'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
    // 主信息展示赋值结束
    this.taskId = this.param.id // 设置全局任务ID
  },
  methods: {
    // 显示选择下一层用户任务信息对话框
    async showNextUserTaskNodeInfoDialog() {
      await request({
        url: '/api/bpm/task/listNextUserTaskNodeInfo',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            taskId: this.taskId
          }
        }
      })
        .then(async response => {
          const data = response.data
          if (data.some(i => i.takeMode === '1')) {
            Vue.component('view-form-dialog', () => import('@/views/frame/base/bpm/components/approveConformDialog.vue'))
            this.dialog.param = Object.assign({}, this.dialog.param, this.$refs.qmDialog.formData)
            this.$refs.qmDialog.dialogSelectVisible = true
            // 将弹窗插入body防止被遮盖
            $(document).ready(() => {
              $(this.$refs.qmDialog.$refs.viewFormDialog.$el).appendTo('body')
              $('body > .dialog-wrapper:last > .mask')
                .css('z-index', 9999)
                .siblings('.dialog-container')
                .css({
                  'z-index': 10000
                })
              $('body > .el-message-box__wrapper')
                .css('z-index', 20000)
                .siblings('.v-modal')
                .css('z-index', 19999)
            })
          } else {
            await this.tocompleteGeneralAudit(1) // 调用完成一般审核操作
          }
          this.$refs.qmDialog.loading = false
        })
        .catch(() => {
          this.$refs.qmDialog.loading = false
        })
    },
    // 完成协助审核操作
    toCompleteAssistAudit(agreeFlgType) {
      request({
        url: '/api/bpm/backlog/assistAuditCompletionBacklog',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.auditHelp'),
          data: {
            assistId: this.param.assistId, // 协助审核ID
            agreeFlg: agreeFlgType, // 协助意见
            auditOption: this.$refs.qmDialog.formData.opinion, // 是否同意
            auditType: 1 // 审核类型  0 一般审核 1 协助审核
          }
        }
      })
        .then(response => {
          if (response.data) {
            this.$notify(
              notifySuccess({
                msg: this.$t('biz.msg.completeAssistAuditSuccess')
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
    },
    // 完成一般审核操作
    async tocompleteGeneralAudit(auditResultType) {
      await request({
        url: '/api/bpm/backlog/businessCompletionBacklog',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.sendOut'),
          data: {
            taskId: this.taskId, // 任务ID
            auditOption: this.$refs.qmDialog.formData.opinion, // 审核意见
            auditResult: auditResultType, // 审核结果
            auditType: 0 // 审核类型  0 一般审核 1 协助审核
          }
        }
      })
        .then(response => {
          if (response.data) {
            this.$notify(
              notifySuccess({
                msg: this.$t('biz.msg.completeGeneralAuditSuccess')
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
        .catch(() => {
          this.$refs.qmDialog.loading = false
        })
    },
    // 审核同意操作
    doAgree() {
      if (this.opType === 'assist') {
        this.toCompleteAssistAudit(1) // 调用完成协助审核
      } else {
        this.$refs.qmDialog.loading = true
        this.showNextUserTaskNodeInfoDialog()
      }
    },
    // 审核协助操作
    doAssist() {
      Vue.component('view-form-dialog', () => import('@/views/frame/base/bpm/components/assistConformDialog.vue'))
      this.$refs.qmDialog.param = this.$refs.qmDialog.formData
      this.$refs.qmDialog.opMode = 'dialog'
      this.$refs.qmDialog.dialogSelectVisible = true
      // 将弹窗插入body防止被遮盖
      $(document).ready(() => {
        $(this.$refs.qmDialog.$refs.viewFormDialog.$el).appendTo('body')
        $('body > .dialog-wrapper:last > .mask')
          .css('z-index', 1999)
          .siblings('.dialog-container')
          .css({
            'z-index': 2000,
            width: '60%'
          })
      })
    },
    // 转交审核操作
    doTransferAudit() {
      Vue.component('view-form-dialog', () => import('@/views/frame/base/bpm/components/transferAuditDialog.vue'))
      this.$refs.qmDialog.param = this.$refs.qmDialog.formData
      this.$refs.qmDialog.opMode = 'dialog'
      this.$refs.qmDialog.dialogSelectVisible = true
      // 将弹窗插入body防止被遮盖
      $(document).ready(() => {
        $(this.$refs.qmDialog.$refs.viewFormDialog.$el).appendTo('body')
        $('body > .dialog-wrapper:last > .mask')
          .css('z-index', 1999)
          .siblings('.dialog-container')
          .css({
            'z-index': 2000
          })
      })
    },

    // 审核拒绝操作
    doRefuse() {
      if (this.opType === 'assist') {
        this.toCompleteAssistAudit(0) // 调用完成协助审核
      } else {
        this.$refs.qmDialog.loading = true
        this.tocompleteGeneralAudit(0) // 调用完成一般审核操作，拒绝时直接提交，不选人
      }
    },
    // 关闭审核弹窗
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>


<template>
  <qm-edit v-if="showTemplate" :edit='edit' ref='qmEdit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      showTemplate: false,
      processId: '', // 流程实例Id
      taskId: '', // 任务ID
      edit: {
        type: this.param.opType || this.opType,
        mode: 'dialog',
        param: this.param,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: ''
        },
        apiData: {
          view(param) {
            return param.id
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['add', 'view', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        tables: []
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
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
  created() {
    this.loadWarning()
  },
  methods: {
    async loadWarning() {
      await request({
        url: '/api/warn/cond/listGroupCodesByWarningCode',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.param.warningCode
        }
      }).then(response => {
        this.paramList = response.data

        if (this.paramList && this.paramList.length > 0) {
          let i = 0
          this.paramList.forEach(groupCode => {
            i++

            this.edit.tables.push({
              isShow: ['view', 'update', 'add'],
              name: 'thresholdTab' + i,
              label: '预警条件分组' + i,
              extraParam: { groupCode: groupCode, sourceCode: this.param.sourceCode, warningCode: this.param.warningCode },
              component: () => import('./tab/thresholdTab.vue')
            })
          })
        } else {
          this.$notify(
            notifyError({
              msg: '请先在设置预警条件'
            })
          )
        }
        this.showTemplate = true
      })
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    // 关闭弹窗回调
    dialogHandler(params) {
      this.dialogVisible = false
    }
  }
}
</script>

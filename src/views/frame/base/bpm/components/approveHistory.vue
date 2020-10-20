<template>
  <qm-edit :edit='edit' ref='qmEdit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      processId: '', // 流程实例Id
      taskId: '', // 任务ID
      edit: {
        type: this.param.opType || this.opType,
        mode: this.opMode,
        param: this.param,
        initType: 'param',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '',
          getNodeInfo: '/api/bpm/backlog/getNodeInfo'
        },
        apiData: {
          view(param) {
            return param.id
          },
          getNodeInfo(param) {
            return param
          }
        },
        topButtons: [
          {
            iconName: '线性-取消',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view', 'update', 'assist', 'audit', 'history'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        tabs: [
          {
            isShow: ['view', 'update', 'history'],
            name: 'tabApproveTrackHistory',
            label: 'platform.component.tab.tabApproveTrackHistory',
            component: () => import('./tabApproveTrackHistory.vue')
          },
          {
            isShow: ['assist', 'audit'],
            name: 'tabApproveTrackHistoryAudit',
            label: 'platform.component.tab.tabApproveTrackHistory',
            component: () => import('./tabApproveTrackHistoryAudit.vue')
          },
          {
            isShow: ['audit', 'assist', 'history'],
            name: 'tabAssistantTrackHistory',
            label: 'platform.component.tab.tabAssistantTrackHistory',
            component: () => import('./tabAssistantTrackHistory.vue')
          },
          {
            isShow: ['view', 'update', 'assist', 'audit', 'history'],
            name: 'tabBillHistory',
            label: 'platform.component.tab.tabBillHistory',
            component: () => import('./tabBillHistory.vue')
          },
          {
            isShow: ['view', 'update', 'history'],
            name: 'bpmImg',
            label: 'platform.component.tab.bpmImg',
            component: () => import('./tabBpmImg.vue')
          },
          {
            isShow: ['assist', 'audit'],
            name: 'bpmImgAudit',
            label: 'platform.component.tab.bpmImg',
            component: () => import('./tabBpmImgForAudit.vue')
          }
        ]
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
  created() {},
  methods: {
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

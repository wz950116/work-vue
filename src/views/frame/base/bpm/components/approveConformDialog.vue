<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='miniColumnsDialog'>
      <!-- 头部 -->
      <title-contain :titleName="$t('office.handle.children.selectAuditor')" @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <div class='dialog-content' style='overflow:auto;'>
        <el-form :model="formData" label-position="left" ref='validateForm'>
          <div v-for="(item,index) in initData" :key="index">
            <div>
              <el-row :gutter="0" v-if="item.takeMode === '1'">
                <el-col :span="24">
                  <el-form-item :label="item.name" prop='state'>
                    <el-select v-model="item.account" filterable :placeholder="$t('biz.placeholder.choose')">
                      <el-option v-for="val in item.list" :key="val.id" :label="val.firstName" :value="val.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button size='mini' @click="$emit('closeHandler')">{{ $t('biz.btn.cancel') }}</el-button>
        <el-button size='mini' type='primary' @click="confirmAdoptClick">{{ $t('biz.btn.confirm') }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      formData: {},
      initData: []
    }
  },
  props: {
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.loadListNextUserTaskNodeInfo(this.param.id)
  },
  methods: {
    // 获取下一级审批信息
    loadListNextUserTaskNodeInfo(taskId) {
      request({
        url: '/api/bpm/task/listNextUserTaskNodeInfo',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            taskId
          }
        }
      })
        .then(response => {
          response.data.forEach((i, index) => {
            this.toGetListApproveUserListByGroup(i, taskId)
          })
        })
        .catch(() => {})
    },
    // 获取员工信息
    toGetListApproveUserListByGroup(functionInfo, taskId) {
      let apiData = { memberOfGroup: functionInfo.candidateGroup, taskId: taskId }
      if (this.param.bpmParms) {
        apiData = Object.assign({}, apiData, this.param.bpmParms)
      }

      request({
        url: '/api/bpm/user/listUser',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: { memberOfGroup: functionInfo.candidateGroup }
        }
      })
        .then(response => {
          functionInfo.list = response.data
          this.initData.push(functionInfo)
        })
        .catch(() => {})
    },
    // 确认
    confirmAdoptClick() {
      let selectFlg = true

      // 一般审核赋值
      const completeGeneralAuditObj = {
        taskId: this.param.id, // 任务ID
        auditOption: this.param.opinion, // 审核意见
        auditResult: 1, // 审核结果
        auditType: 0, // 审核类型  0 一般审核 1 协助审核
        bpmVariableParamList: [] // 下一环节审批人变量值
      }
      this.initData.forEach((i, index) => {
        var str = i.assigneeFormVar
        var strOne = str.split('#{')[1]
        var strTwo = strOne.match(/(\S*)}/)[1]
        const item = {
          name: strTwo, // 变量名称
          value: i.account // 变量值
        }
        if (i.account === undefined) {
          this.$notify(
            notifyInfo({
              msg: this.$t('office.msg.noRowSelectedAuditUser')
            })
          )
          selectFlg = false
        }
        completeGeneralAuditObj.bpmVariableParamList.push(item)
      })

      if (selectFlg) {
        request({
          url: '/api/bpm/backlog/businessCompletionBacklog',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.sendOut'),
            data: completeGeneralAuditObj
          }
        })
          .then(response => {
            this.$nextTick(() => {
              const data = { closeParent: true }
              this.$emit('closeHandler', data)
            })
            this.$store.dispatch('delVisitedViews', this.$route).then(() => {
              this.$router.push({
                name: 'todo',
                params: {
                  refresh: true
                }
              })
            })
          })
          .catch(() => {})
      }
    }
  }
}
</script>

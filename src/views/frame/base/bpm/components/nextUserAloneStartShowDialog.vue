<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='miniColumnsDialog'>
      <!-- 头部 -->
      <title-contain :titleName='dlgTitle' @TitleFun="$emit('closeHandler', false)" />

      <!-- 内容 -->
      <div class='dialog-content' style='padding:20px 10px;overflow:auto;'>
        <el-form :model="formData" label-position="left" ref='validateForm'>
          <div v-for="(item, index) in initData" :key="index">
            <div>
              <!-- 任务领取模式 0 执行人领取 1 提交人指定 -->
              <el-row :gutter="0" v-if="item.takeMode === '1'">
                <el-col :span="24">
                  <el-form-item :label="item.name" prop='state'>
                    <el-select v-model="item.account" filterable :placeholder="$t('biz.placeholder.choose')">
                      <el-option v-for="val in item.list" :key="val.value" :label="val.firstName" :value="val.id">
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
        <el-button @click="$emit('closeHandler', false)" size='mini'>{{ $t('biz.btn.cancel') }}</el-button>
        <el-button :disabled='loadingUserList' type='primary' @click="confirm" v-db-click size='mini'>{{ $t('biz.btn.confirm') }}</el-button>
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
      loadingUserList: true, // 是否显示选择审批人下拉框
      dlgTitle: '',
      formData: {}, // 审批人下拉框
      initData: [], // 审批人
      bpmVariableParamList: [], // 下一环节审批人变量值
      defParams: {} // 获取下一级审批信息参数
    }
  },
  props: {
    // 流程定义key
    moduleCode: {
      type: String
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },

  watch: {
    moduleCode(newValue) {
      if (newValue) this.getApproveDefineByModuleCode()
    }
  },
  mounted() {
    if (this.moduleCode === undefined) {
      this.$notify(
        notifyInfo({
          msg: this.$t('office.msg.noModuleCode')
        })
      )
    }
    this.dlgTitle = this.$t('office.handle.children.confirmSubmitAudit')
    this.getApproveDefineByModuleCode()
  },
  methods: {
    // 获取流程定义信息
    async getApproveDefineByModuleCode() {
      const loading = this.$loading({
        target: this.$refs.nextUser,
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading'
      })
      await request({
        url: '/api/bpm/businessDefine/getApproveDefineByModuleCode',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view'),
          data: this.moduleCode
        }
      })
        .then(response => {
          if (response.data && response.data.enableFlg === '1') {
            this.loadListFirstUserTaskNodeInfo(response.data.id)
          } else {
            this.$notify(
              notifyInfo({
                msg: this.$t('office.msg.noProcessEnable')
              })
            )
            this.$emit('closeHandler', false)
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    // 获取下一级审批信息
    async loadListFirstUserTaskNodeInfo(bpmProcessDefinitionId) {
      this.defParams.bpmProcessDefinitionId = bpmProcessDefinitionId
      if (this.param) {
        let query = []
        query.push(this.param.uk)
        query.push(this.param.todotext)
        if (this.param.bpmParms) {
          query = query.concat(this.param.bpmParms)
        }
        let initValueMap = {}
        query.forEach(item => {
          initValueMap[item.name] = item.value
        })
        this.defParams.initValueMap = initValueMap
      }
      await request({
        url: '/api/bpm/task/listFirstUserTaskNodeInfoByBpmDef',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.defParams
        }
      })
        .then(response => {
          const promiseArr = []
          response.data.forEach((i, index) => {
            if (i.takeMode === '1') {
              promiseArr.push(this.toGetListApproveUserListByGroup(i))
            }
          })
          Promise.all(promiseArr).then(res => {
            if (this.initData.length > 0) {
              this.dlgTitle = this.$t('office.handle.children.selectAuditor')
            }
            this.loadingUserList = false
          })
        })
        .catch(() => {})
    },
    // 获取员工信息
    toGetListApproveUserListByGroup(functionInfo) {
      let apiData = { memberOfGroup: functionInfo.candidateGroup }
      if (this.param.bpmParms) {
        apiData = Object.assign({}, apiData, this.param.bpmParms)
      }

      return request({
        url: '/api/bpm/user/listUser',
        method: 'post',
        data: {
          data: apiData,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          functionInfo.list = response.data
          if (functionInfo.list[0]) {
            functionInfo.id = functionInfo.list[0].id
          }
          this.initData.push(functionInfo)
        })
        .catch(() => {})
    },
    // 确认
    confirm() {
      let selectFlg = true
      this.initData.forEach((i, index) => {
        if (i.takeMode === '1') {
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
          this.bpmVariableParamList.push(item)
        }
      })

      if (selectFlg) {
        this.$emit('closeHandler', true, this.bpmVariableParamList)
      }
    }
  }
}
</script>

<style scoped>
.dialog-title {
  user-select: none;
}
</style>

<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" @click="cancel" v-if="type==='view'" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" @click="cancel" v-if="['add', 'update', 'assist', 'audit'].includes(type)" style='margin-right:6px;'>
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" @click="save" v-if="['add', 'update'].includes(type)" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" @click="audit" v-if="['assist', 'audit'].includes(type)" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-审核"></svg-icon>{{$t('biz.btn.audit')}}
      </el-button>
      <el-button v-db-click size="mini" @click="auditHistory" v-if="['update', 'view', 'assist', 'audit'].includes(type)" style='margin-right:6px;'>
        <svg-icon icon-class="线性-审核历史"></svg-icon>{{$t('biz.btn.auditHistory')}}
      </el-button>
      <el-button v-db-click size="mini" @click="attachment" v-if="type!=='add'" style='margin-right:6px;'>
        <svg-icon icon-class="线性-附件"></svg-icon>{{$t('biz.btn.uploadAttachment')}}
      </el-button>
    </el-row>
    <!-- 内容 -->
    <header :style="{'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.basicInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="refForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.changeNo')" prop='changeNo'>
              <input-validate v-model="formData.changeNo" :disabled='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.organCode')" prop='organCode'>
              <base-select v-model="formData.organCode" :attrs="{data: 'TREE_ORGAN',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.deptCode')" prop='deptCode'>
              <base-select v-model="formData.deptCode" :attrs="{data: 'TREE_DEPT'}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.strategyName')" prop='strategyName'>
              <input-validate v-model="formData.strategyName" :clearable='true' :disabled='matchFlag'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.strategyCode')" prop='strategyCode'>
              <input-validate v-model="formData.strategyCode" :disabled='matchFlag'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.projectCode')" prop='projectCode'>
              <base-select v-model="formData.projectCode" :attrs="{data: 'PROJECT',clearable: true,params:{auditStatus:'3', usingFlag:'1'},disabled:matchFlag}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.strategyNature')" prop='strategyNature'>
              <el-select v-model="formData.strategyNature" :disabled="true" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.strategyNature')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.purpose')" prop='purpose'>
              <base-select v-model="formData.purpose" :attrs="{data: 'DD_TYPE',clearable: true,disabled:matchFlag}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.applicant')" prop='applicant'>
              <base-select v-model="formData.applicant" :attrs="{data: 'TREE_STAFF',clearable: true,disabled:matchFlag}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.executor')" prop='executor'>
              <base-select v-model="formData.executor" :attrs="{data: 'TREE_STAFF',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.maxFund')" prop='maxFund'>
              <input-formatter v-model="formData.maxFund" :min="0" :max='999999999999' :precision="2" type='thousands' :disabled='matchFlag'></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.limitLoss')" prop='limitLoss'>
              <input-formatter v-model="formData.limitLoss" :min="0" :max='999999999999' :precision="2" type='thousands' :disabled='matchFlag'></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.expectProfit')" prop='expectProfit'>
              <input-formatter v-model="formData.expectProfit" :min="0" :max='999999999999' :precision="2" type='thousands' :disabled='matchFlag'></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.riskProfitRatio')" prop='riskProfitRatio'>
              <input-formatter v-model="formData.riskProfitRatio" :min="0" :max='999999999999' :precision="2" type='thousands' :disabled="true"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.expectReturnRatio')" prop='expectReturnRatio'>
              <input-formatter v-model="formData.expectReturnRatio" :min="0" :max='999999999999' :precision="2" type='thousands' :disabled="true"></input-formatter>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='matchFlag' />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.startDate')" prop='startDate'>
              <el-date-picker v-model="formData.startDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='matchFlag' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.endDate')" prop='endDate'>
              <el-date-picker v-model="formData.endDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='matchFlag' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.strgLevel')" prop='strgLevel'>
              <el-select v-model="formData.strgLevel" :placeholder="$t('biz.placeholder.choose')" :disabled='matchFlag'>
                <el-option v-for="item in $t('datadict.spotStrgLevel')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.hedgingMode')" prop='hedgingMode'>
              <el-select v-model="formData.hedgingMode" :placeholder="$t('biz.placeholder.choose')" :disabled='matchFlag'>
                <el-option v-for="item in $t('datadict.hedgingMode')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.changeReason')" prop='changeReason'>
              <input-validate v-model="formData.changeReason"></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('strategy.strategyManagement.form.changeRemark')" prop='remark'>
              <el-input type="textarea" v-model="formData.remark" resize='none'>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.strategyManagement.form.tradingInformation')" name="hedgingPortfolio">
          <hedgingPortfolio :type='type' ref="productTab" :changeNo='this.$route.params.uk' :flag='this.flagF' :matchFlag='matchFlag'></hedgingPortfolio>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="bottomName" type="border-card">
        <el-tab-pane :label="$t('strategy.plan.tab.changeHistory')" name="changeHistory">
          <changeHistory :strategyCode="this.formData.strategyCode"></changeHistory>
        </el-tab-pane>
      </el-tabs>
    </main>
    <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='param' :opType="type" :opMode='"route"'></view-form-edit>
    <attachment v-if="attachmentVisible" :extraParam="extraParam" :opType="type" @closeHandler='attachmentClose'></attachment>
    <approve-history ref='approveHistory' v-if='approveHistoryVisible' @closeHandler='dialogHandlerHistory' :param='dialogParam' :opType="type"></approve-history>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import hedgingPortfolio from '@/views/frame/rm/strategy/strategyChangeManagement/spotUnilateral/hedgingPortfolio'
import TreeOrgBaseDept from '@/views/frame/base/organ/components/TreeOrgBaseDept'
import attachment from '@/components/frame/qm/Attachment/index.vue'
import changeHistory from '@/views/frame/rm/strategy/strategyChangeManagement/components/changeHistory'
import Vue from 'vue'
export default {
  components: {
    hedgingPortfolio,
    attachment,
    TreeOrgBaseDept,
    changeHistory
  },
  data() {
    return {
      approveHistoryVisible: false,
      matchFlag: false,
      attachmentVisible: false,
      extraParam: {},
      flagF: this.$route.params.flag || this.flagFF,
      dialogLv2Visible: false,
      param: this.$route.params,
      dialogParam: {},
      mainInfoVisible: true,
      type: this.$route.params.type || this.$route.params.opType,
      activeName: 'hedgingPortfolio',
      bottomName: 'changeHistory',
      formData: {
        organCode: '',
        strategyNature: this.$route.params.strategyType
      },
      rules: {
        organCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        deptCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        strategyName: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        strategyCode: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        projectCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        makeDate: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        strgLevel: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        hedgingMode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        changeReason: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    // 校验规则提示添加
    $('.edit-page-style .el-col .is-required .el-form-item__content').attr(
      'data-content',
      this.$t('biz.placeholder.require')
    )

    // 渲染表格数据
    this.getEditData()
    // 获取策略信息是否已匹配 true 为是 false 为未匹配
    this.getMatchFlag()
  },
  watch: {
    'formData.limitLoss'(newId) {
      if (newId && this.formData.expectProfit) {
        this.formData.riskProfitRatio = this.formData.expectProfit / newId
      }
    },
    'formData.expectProfit'(newId) {
      if (newId && this.formData.limitLoss) {
        this.formData.riskProfitRatio = newId / this.formData.limitLoss
      }
      if (newId && this.formData.maxFund) {
        this.formData.expectReturnRatio = newId / this.formData.maxFund
      }
    },
    'formData.maxFund'(newId) {
      if (newId && this.formData.expectProfit) {
        this.formData.expectReturnRatio = this.formData.expectProfit / newId
      }
    }
  },
  props: ['flagFF'],
  methods: {
    // 获取策略信息是否已匹配 true 为是 false 为未匹配
    getMatchFlag() {
      if (this.type === 'add') {
        request({
          url: '/api/strg/strategy/getMatchFlag',
          method: 'post',
          data: {
            data: this.$route.params.uk,
            funcModule: '策略管理',
            funcOperation: '获取策略信息是否已匹配'
          }
        })
          .then(response => {
            this.matchFlag = response.data
          })
          .catch(() => { })
      }
      if (this.type === 'update') {
        request({
          url: '/api/strg/strategy/getMatchFlag',
          method: 'post',
          data: {
            data: this.$route.params.row.strategyCode,
            funcModule: '策略管理',
            funcOperation: '获取策略信息是否已匹配'
          }
        })
          .then(response => {
            this.matchFlag = response.data
          })
          .catch(() => { })
      }
    },
    attachmentClose() {
      this.attachmentVisible = false
    },
    // 附件
    attachment(buttonInfo) {
      this.extraParam.billType = 'STRATEGY_CHANGE'
      this.extraParam.billNo = this.formData.changeNo
      this.attachmentVisible = true
      // 将弹窗插入body防止被遮盖
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el)
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    changeAll(val) {
      if (val) {
        this.formData.organCode = val.orgCode
      }
    },
    // 获取初始化数据
    getEditData() {
      if (this.flagF === '1') {
        request({
          url: '/api/strg/strategy/get',
          method: 'post',
          data: {
            data: this.$route.params.uk,
            funcModule: '策略管理',
            funcOperation: '获取单个'
          }
        })
          .then(response => {
            this.formData = response.data
          })
          .catch(() => { })
      }
      if (this.flagF === '0') {
        request({
          url: '/api/strg/strgStrategyChg/get',
          method: 'post',
          data: {
            data: this.$route.params.uk,
            funcModule: '策略变更',
            funcOperation: '获取单个'
          }
        })
          .then(response => {
            this.formData = response.data
          })
          .catch(() => { })
      }
    },
    cancel() {
      // 关闭编辑页返回主页面的回调...
      if (this.type === 'audit') {
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: 'todo'
          })
        })
        return
      }
      if (this.flagF === '1') {
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: 'strategyManagement'
          })
        })
      } else {
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          if (this.type === 'audit') {
            this.$router.push({
              name: 'todo'
            })
          } else {
            this.$router.push({
              name: 'strategyChange'
            })
          }
        })
      }
    },
    save() {
      this.$refs['refForm'].validate(valid => {
        if (valid) {
          this.formData.strDetailTradeList = this.$refs.productTab.tableData
          if (
            !this.formData.strDetailTradeList ||
            this.formData.strDetailTradeList.length === 0
          ) {
            Notification(
              notifyInfo({
                msg: '交易信息数据不能为空'
              })
            )
            return
          }

          var errMsg = '交易信息：'
          this.formData.strDetailTradeList.forEach(element => {
            if (!element.productCode && !errMsg.includes('品名不能为空')) {
              errMsg = errMsg + '品名不能为空;'
            }
            if (!element.maxPostion && !errMsg.includes('最大开仓量不能为空')) {
              errMsg = errMsg + '最大开仓量不能为空;'
            }
            if (!element.direction && !errMsg.includes('方向不能为空')) {
              errMsg = errMsg + '方向不能为空;'
            }
            if (!element.currencyCode && !errMsg.includes('币种不能为空')) {
              errMsg = errMsg + '币种不能为空;'
            }
          })
          if (errMsg !== '交易信息：') {
            Notification(
              notifyInfo({
                msg: errMsg
              })
            )
            return
          }
          if (this.flagF === '0') {
            request({
              url: '/api/strg/strgStrategyChg/update',
              method: 'post',
              data: {
                data: this.formData,
                funcModule: '策略变更',
                funcOperation: '更新'
              }
            })
              .then(() => {
                Notification(
                  notifySuccess({
                    msg: this.$t('biz.msg.updateSuccess')
                  })
                )
                this.$store
                  .dispatch('delVisitedViews', this.$route)
                  .then(() => {
                    this.$router.push({
                      name: 'strategyChange'
                    })
                  })
              })
              .catch(() => { })
          }
          if (this.flagF === '1') {
            request({
              url: '/api/strg/strgStrategyChg/save',
              method: 'post',
              data: {
                data: this.formData,
                funcModule: '策略变更',
                funcOperation: '新增'
              }
            })
              .then(() => {
                Notification(
                  notifySuccess({
                    msg: this.$t('biz.msg.updateSuccess')
                  })
                )
                this.$store
                  .dispatch('delVisitedViews', this.$route)
                  .then(() => {
                    this.$router.push({
                      name: 'strategyChange'
                    })
                  })
              })
              .catch(() => { })
          }
        } else {
          return false
        }
      })
    },
    // 审批
    audit() {
      Vue.component('view-form-edit', () =>
        import('@/views/frame/base/bpm/components/approveDialog.vue')
      )
      this.dialogLv2Visible = true
      // 将弹窗插入body防止被遮盖
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el).appendTo('body')
        $('body > .dialog-wrapper > .mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    // 审批历史
    auditHistory() {
            this.dialogParam = Object.assign({}, this.param, {
        moduleCode: this.$route.meta.bpmModule
      })
      Vue.component('approveHistory', () =>
        import('@/views/frame/base/bpm/components/approveHistory.vue')
      )
      this.approveHistoryVisible = true
      // 将弹窗插入body防止被遮盖
      $(document).ready(() => {
        $(this.$refs.approveHistory.$el)
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    // 二级弹窗关闭回调
    dialogHandler(param) {
      this.dialogLv2Visible = false
      if (param) {
        this.$nextTick(() => {
          this.$emit('closeLv2Dialog', param)
        })
      }
    },
    dialogHandlerHistory() {
      this.approveHistoryVisible = false
    }
  }
}
</script>

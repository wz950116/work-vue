<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="close" v-if="['view', 'changeView'].includes(type)">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="cancel" v-if="['add', 'update','change','changeUpdate', 'assist', 'audit'].includes(type)">
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="save" v-if="['add', 'update','change','changeUpdate'].includes(type)">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="audit" v-if="['assist', 'audit'].includes(type)">
        <svg-icon icon-class="线性-审核"></svg-icon>{{$t('biz.btn.audit')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="auditHistory" v-if="['assist', 'audit','view', 'changeView'].includes(type)">
        <svg-icon icon-class="线性-全选"></svg-icon>{{$t('biz.btn.auditHistory')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="attachment" v-if="['update', 'changeUpdate','view', 'changeView'].includes(type)">
        <svg-icon icon-class="线性-附件"></svg-icon>{{$t('biz.btn.uploadAttachment')}}
      </el-button>
      <el-button v-db-click style='margin-right:6px;' size="mini" @click="strategyDialogOpen" :v-if='!matchFlag'>
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.chooseStrategy')}}
      </el-button>
    </el-row>
    <!-- 内容 -->
    <header :style="{'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.mainInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="validateForm">
        <el-row :gutter="20">
          <el-col :span="6" v-if="changeVisible">
            <el-form-item :label="$t('strategy.plan.form.changeNo')" prop='changeNo'>
              <input-validate v-model="formData.changeNo" :disabled='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.strategy')" prop='strategyName'>
              <el-input v-model="formData.strategyName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.strategyCode')">
              <input-validate v-model="formData.strategyCode" :disabled='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.strategyNature')" prop='strategyNature'>
              <el-select v-model="formData.strategyNature" :disabled="true" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.strategyNature')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.purpose')" prop='purpose'>
              <base-select v-model="formData.purpose" :disabled='true' :attrs="{data: 'DD_TYPE', disabled:true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.planCode')" prop='planCode'>
              <input-validate v-model="formData.planCode" :disabled='disabledFlag || type!= "add"'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.planName')" prop='planName'>
              <input-validate v-model="formData.planName" :disabled="matchFlag" :clearable='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.startDate')" prop='startDate'>
              <el-date-picker v-model="formData.startDate" :disabled="matchFlag" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.endDate')" prop='endDate'>
              <el-date-picker v-model="formData.endDate" :disabled="matchFlag" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.deptCode')" prop='deptCode'>
              <TreeOrgBaseDept v-model="formData.deptCode" :disabled="matchFlag"></TreeOrgBaseDept>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.applicant')" prop='applicant'>
              <base-select v-model="formData.applicant" @change="applicantChange" :clearable='true' :attrs="{data: 'TREE_STAFF', disabled: matchFlag}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.executor')" prop='executor'>
              <base-select v-model="formData.executor" :attrs="{data: 'TREE_STAFF',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.plan.form.stopPoint')" prop='stopPoint'>
              <input-formatter v-model="formData.stopPoint" :disabled="matchFlag" :min="0" :precision="2"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="changeVisible">
            <el-form-item :label="$t('strategy.plan.form.changeReason')" prop='changeReason'>
              <input-validate v-model="formData.changeReason"></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('strategy.plan.tab.remark')" prop='remark'>
              <el-input type="textarea" v-model="formData.remark" resize='none'>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.plan.tab.tradeInfo')" name="tradeInfo">
          <tradeInfo ref="hedgeDialog" :disabled="matchFlag" :strategyCode="formData.strategyCode" :strgEquation="formData.strgEquation" :maxShare="formData.maxShare" :strategyNature="formData.strategyNature"></tradeInfo>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-if="changeVisible" v-model="bottomName" type="border-card">
        <el-tab-pane :label="$t('strategy.plan.tab.changeHistory')" name="changeHistory">
          <changeHistory :planCode="this.formData.planCode"></changeHistory>
        </el-tab-pane>
      </el-tabs>
    </main>

    <strategyDialog v-if="strategyDialogVisible" :strgLevels="['1','3']" :planApplicant="formData.applicant" :strategyNature="formData.strategyNature" @close="dialogClose" @confirm="dialogConfirm"></strategyDialog>

    <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='param' :opType="type" :opMode='"route"'></view-form-edit>

    <attachment v-if="attachmentVisible" :extraParam="extraParam" :opType="type === 'update' || type === 'changeUpdate' ? 'update' : type" @closeHandler='attachmentClose'></attachment>

    <approve-history ref='approveHistory' v-if='approveHistoryVisible' @closeHandler='dialogHandlerHistory' :param='param' :opType="type === 'changeView' ? 'view' : type"></approve-history>

  </div>
</template>

<script>
import tradeInfo from '@/views/frame/rm/strategy/plan/futuresSingle/tradeInfo'
import strategyDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDialog'
import TreeOrgBaseDept from '@/views/frame/base/organ/components/TreeOrgBaseDept'
import { notifyError, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import Vue from 'vue'
import changeHistory from '@/views/frame/rm/strategy/planChange/components/changeHistory'
import attachment from '@/components/frame/qm/Attachment/index.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    tradeInfo,
    strategyDialog,
    changeHistory,
    TreeOrgBaseDept,
    attachment
  },
  props: {
    change: Boolean
  },
  data() {
    return {
      disabledFlag: false,
      mainInfoVisible: true,
      dialogLv2Visible: false,
      approveHistoryVisible: false,
      type: this.$route.params.type || this.$route.params.opType,
      param: this.$route.params,
      auditCloseFlag: this.$route.params.auditCloseFlag,
      stopDisplay: false,
      activeName: 'tradeInfo',
      bottomName: 'changeHistory',
      businessCategory: 'STRATEGY_MANAGE',
      strategyDialogVisible: false,
      modeVisible: false,
      changeVisible: false,
      closeUrl: 'planManage',
      attachmentVisible: false,
      extraParam: {},
      matchFlag: false,
      formData: {
        strategyCode: '',
        strategyNature: this.$route.params.planType,
        purpose: '',
        projectCode: '',
        planCode: '',
        planName: '',
        minHedgeRatio: 0,
        maxHedgeRatio: 0,
        startDate: '',
        endDate: '',
        deptCode: '',
        applicant: '',
        maxShare: 0,
        enterMode: '2',
        strgEquation: '',
        stopPoint: 0,
        minLimit: 0,
        maxLimit: 0
      },
      rules: {
        planName: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        planCode: [
          {
            required: false,
            trigger: 'blur'
          }
        ],
        strategyName: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        deptCode: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        applicant: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        changeReason: [
          {
            required: false,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userEmployeeCode'])
  },
  mounted() {
    this.formData.applicant = this.userEmployeeCode
    this.getDisabled()
    this.getRequired()
    // 校验规则提示添加
    $('.edit-page-style .el-col .is-required .el-form-item__content').attr('data-content', this.$t('biz.placeholder.require'))

    this.changeVisible = !!(this.change || this.type.includes('change'))
    this.rules['changeReason'][0].required = this.changeVisible
    this.closeUrl = this.change || this.type.includes('change') ? 'planChange' : 'planManage'
    // 渲染表格数据
    if (this.type !== 'add' && this.type !== 'copy') {
      this.getData()
    }
    if (this.type === 'copy') {
      this.type = 'add'
      this.getData()
    }

    if (this.changeVisible || this.type === 'change' || this.type === 'changeUpdate' || this.auditCloseFlag) {
      this.isMatch()
    }
    if (this.type === 'add' && this.$route.params.strategyCode) {
      this.initData(this.$route.params.strategyCode)
    }
  },
  methods: {
    initData(val) {
      request({
        url: '/api/strg/strategy/get',
        method: 'post',
        data: {
          data: val,
          funcModule: '策略管理',
          funcOperation: '获取单个'
        }
      }).then(response => {
        const data = response.data
        this.$set(this.formData, 'strategyName', data.strategyName)
        this.$set(this.formData, 'strategyCode', data.strategyCode)
        this.formData.projectCode = data.projectCode
        this.formData.purpose = data.purpose
        this.formData.maxShare = data.maxShare
        this.formData.strgEquation = data.strgEquation
        this.formData.strgLevel = data.strgLevel
        this.formData.activeFlag = data.activeFlag
        this.formData.strgMaxShare = data.maxShare
        this.formData.hedgingMode = data.hedgingMode
        this.formData.organCode = data.organCode
        this.formData.deptCode = data.deptCode
      }).catch(() => { })
    },
    applicantChange() {
      this.formData.strategyName = ''
      this.formData.strategyCode = ''
      this.formData.projectCode = ''
      this.formData.purpose = ''
      this.formData.maxShare = ''
      this.formData.strgEquation = ''
      this.formData.strgLevel = ''
      this.formData.activeFlag = ''
      this.formData.strgMaxShare = ''
      this.formData.hedgingMode = ''
      this.formData.organCode = ''
      this.formData.deptCode = ''
      this.$refs.hedgeDialog.clearData()
    },
    getDisabled() {
      if ((this.$route.params.type || this.$route.params.opType) === 'add') {
        const seqMode = this.$route.meta.seqMode
        // 自动则disabled
        if (seqMode && seqMode === '0') {
          this.disabledFlag = true
        }
      } else {
        this.disabledFlag = true
      }
    },
    getRequired() {
      const seqMode = this.$route.meta.seqMode
      // 手动则必输
      if (seqMode && seqMode === '1') {
        this.rules.planCode = [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    },
    isMatch() {
      request({
        url: '/api/strategy/strgPlan/isMatch',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.planCode
        }
      }).then(response => {
        this.matchFlag = response.data
      })
    },
    getData() {
      var url = ''
      if (this.changeVisible && this.type !== 'change') {
        url = '/api/strategy/strgPlanChg/get'
      } else {
        url = '/api/strategy/strgPlan/get'
      }
      request({
        url: url,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        if (this.type === 'add') {
          this.formData.planCode = ''
          this.formData.id = ''
          response.data.detailList.forEach(element => {
            element.id = ''
          })
        }
        $(document).ready(() => {
          this.$refs.hedgeDialog.setList(response.data.detailList)
        })

        if (this.type === 'change') {
          this.formData.id = null
          this.formData.tenantCode = null
        }
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: this.closeUrl
        })
      })
    },
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          // 关闭编辑页返回主页面的回调...
          this.$store.dispatch('delVisitedViews', this.$route).then(() => {
            this.$router.push({
              name: this.closeUrl
            })
          })
        })
        .catch(() => {})
    },
    checkSave() {
      for (var i = 0; i < this.formData.detailList.length; i++) {
        var data = this.formData.detailList[i]
        if (!data.contractCode) {
          this.$notify(
            notifyError({
              msg: this.$t('strategy.plan.msg.contractIsEmpty')
            })
          )
          return true
        }
        if (!data.direction) {
          this.$notify(
            notifyError({
              msg: this.$t('strategy.plan.msg.futuresDirectionIsEmpty')
            })
          )
          return true
        }
        if (!data.offsetFlag && data.itemClass === '2') {
          this.$notify(
            notifyError({
              msg: this.$t('strategy.plan.msg.offsetIsEmpty')
            })
          )
          return true
        }
        if (!data.maxPrice || !data.minPrice) {
          this.$notify(
            notifyError({
              msg: this.$t('strategy.plan.msg.maxPriceIsEmpty')
            })
          )
          return true
        }
        if (!data.minQuantity || !data.maxQuantity) {
          this.$notify(
            notifyError({
              msg: this.$t('strategy.plan.msg.quantityIsEmpty')
            })
          )
          return true
        }
      }
    },
    save() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          this.formData.detailList = this.$refs.hedgeDialog.getDetailList()
          if (!this.formData.detailList) {
            return
          }

          if (this.checkSave()) {
            return
          }

          this.$confirm(this.$t('biz.msg.confirmSaveAndSubmit'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              var url = ''
              if (this.type === 'add') {
                url = '/api/strategy/strgPlan/save'
              } else if (this.type === 'update') {
                url = '/api/strategy/strgPlan/update'
              } else if (this.type === 'change') {
                url = '/api/strategy/strgPlan/saveChange'
              } else if (this.type === 'changeUpdate') {
                url = '/api/strategy/strgPlanChg/update'
              }
              request({
                url: url,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.formData
                }
              }).then(response => {
                this.$notify(
                  notifySuccess({
                    msg: this.$t('biz.msg.saveSuccess')
                  })
                )
                // 关闭编辑页返回主页面的回调...
                this.$store.dispatch('delVisitedViews', this.$route).then(() => {
                  this.$router.push({
                    name: this.closeUrl,
                    query: {
                      refresh: true
                    }
                  })
                })
              })
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    // 附件
    attachment(buttonInfo) {
      if (this.type === 'changeUpdate') {
        this.extraParam.billType = 'PLAN_CHANGE'
        this.extraParam.billNo = this.formData.changeNo
      } else {
        this.extraParam.billType = 'PLAN'
        this.extraParam.billNo = this.formData.planCode
      }

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
    attachmentClose() {
      this.attachmentVisible = false
    },
    modeChange(value) {
      if (value === '2') {
        this.modeVisible = false
        this.stopPoint = ''
        this.minLimit = ''
        this.maxLimit = ''
      } else {
        this.modeVisible = true
      }
    },
    strategyDialogOpen() {
      if (!this.formData.applicant) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.plan.msg.applicantFirst')
          })
        )
        return
      }
      this.strategyDialogVisible = true
    },
    dialogClose() {
      this.strategyDialogVisible = false
    },
    dialogConfirm(val) {
      this.$set(this.formData, 'strategyName', val.strategyName)
      this.$set(this.formData, 'strategyCode', val.strategyCode)
      this.formData.projectCode = val.projectCode
      this.formData.purpose = val.purpose
      this.formData.maxShare = val.maxShare
      this.formData.strgEquation = val.strgEquation
      this.formData.strgLevel = val.strgLevel
      this.formData.activeFlag = val.activeFlag
      this.formData.strgMaxShare = val.maxShare
      this.formData.hedgingMode = val.hedgingMode
      this.formData.organCode = val.organCode
      this.formData.deptCode = val.deptCode
      this.$refs.hedgeDialog.clearData()

      this.strategyDialogVisible = false
    },
    // 审批
    audit() {
      Vue.component('view-form-edit', () => import('@/views/frame/base/bpm/components/approveDialog.vue'))
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
      Vue.component('approveHistory', () => import('@/views/frame/base/bpm/components/approveHistory.vue'))
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
    dialogHandlerHistory() {
      this.approveHistoryVisible = false
    },
    // 二级弹窗关闭回调
    dialogHandler(param) {
      this.dialogLv2Visible = false
      if (param) {
        this.$nextTick(() => {
          this.$emit('closeLv2Dialog', param)
        })
      }
    }
  }
}
</script>

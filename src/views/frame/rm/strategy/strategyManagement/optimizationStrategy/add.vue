<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" @click="cancel" v-if="type==='view'" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" @click="cancel" v-if="['add','update','assist','audit'].includes(type)" style='margin-right:6px;'>
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" @click="save" v-if="['add','update'].includes(type)" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" @click="audit" v-if="['assist','audit'].includes(type)" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-审核"></svg-icon>{{$t('biz.btn.audit')}}
      </el-button>
      <el-button v-db-click size="mini" @click="auditHistory" v-if="['update','view','assist','audit'].includes(type)" style='margin-right:6px;'>
        <svg-icon icon-class="线性-审核历史"></svg-icon>{{$t('biz.btn.auditHistory')}}
      </el-button>
      <el-button v-db-click size="mini" @click="attachment" v-if="type!=='add'" style='margin-right:6px;'>
        <svg-icon icon-class="线性-附件"></svg-icon>{{$t('biz.btn.uploadAttachment')}}
      </el-button>
    </el-row>
    <!-- 内容 -->
    <header :style="{'border-bottom-width': mainInfoVisible ?'1px' :'0'}">
      <div class='form-title'>{{$t('biz.title.basicInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="refForm">
        <el-row :gutter="20">

          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.parentStrategyCode')" prop='parentStrategyCode'>
              <base-select v-model="formData.parentStrategyCode" :attrs="{data:'STRATEGY',clearable: true,params:{auditStatus:'3'},disabled:true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.organCode')" prop='organCode'>
              <base-select v-model="formData.organCode" :attrs="{data:'TREE_ORGAN',clearable: true	,disabled:true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.deptCode')" prop='deptCode'>
              <TreeOrgBaseDept v-model="formData.deptCode" @handleNode='changeAll' :clearable='true'></TreeOrgBaseDept>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.strategyName')" prop='strategyName'>
              <input-validate v-model="formData.strategyName" :clearable='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.strategyCode')" prop='strategyCode'>
              <input-validate v-model="formData.strategyCode" :disabled='disabledFlag'></input-validate>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.projectCode')" prop='projectCode'>
              <base-select v-model="formData.projectCode" :attrs="{data:'PROJECT',clearable: true,params:{auditStatus:'3', usingFlag:'1'}}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="flag==='1'">
            <el-form-item :label="$t('strategy.plan.form.hedgeRatio')">
              <div style="width:48%;float:left">
                <input-formatter v-model="formData.minHedgeRatio" :min="0" :max="formData.maxHedgeRatio===null ? 9999999 : parseFloat(formData.maxHedgeRatio)" :precision="2" type='thousands'></input-formatter>
              </div>
              <div style="float:left">-</div>
              <div style="width:48%;float:left">
                <input-formatter v-model="formData.maxHedgeRatio" :min="formData.minHedgeRatio===null ? 0 : parseFloat(formData.minHedgeRatio)" :precision="2" type='thousands'></input-formatter>
              </div>
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
              <base-select v-model="formData.purpose" :attrs="{data:'DD_TYPE',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.applicant')" prop='applicant'>
              <base-select v-model="formData.applicant" :attrs="{data:'TREE_STAFF',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.executor')" prop='executor'>
              <base-select v-model="formData.executor" :attrs="{data: 'TREE_STAFF',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.maxFund')" prop='maxFund'>
              <input-formatter v-model="formData.maxFund" :min="0" :max='999999999999' :precision="2" type='thousands'></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.limitLoss')" prop='limitLoss'>
              <input-formatter v-model="formData.limitLoss" :min="0" :max='999999999999' :precision="2" type='thousands'></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.expectProfit')" prop='expectProfit'>
              <input-formatter v-model="formData.expectProfit" :min="0" :max='999999999999' :precision="2" type='thousands'></input-formatter>
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
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.startDate')" prop='startDate'>
              <el-date-picker v-model="formData.startDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.strategyManagement.form.endDate')" prop='endDate'>
              <el-date-picker v-model="formData.endDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-if="['3','5'].includes(flag)" :label="$t('strategy.strategyManagement.form.strgLevel')" prop='strgLevel'>
              <el-select v-model="formData.strgLevel" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.spotStrgLevel')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-if="['1','2','4','6'].includes(flag)" :label="$t('strategy.strategyManagement.form.strgLevel')" prop='strgLevel'>
              <el-select v-model="formData.strgLevel" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.strgLevel')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="flag!=='4' && flag!=='2'">
            <el-form-item :label="$t('strategy.strategyManagement.form.hedgingMode')" prop='hedgingMode'>
              <el-select v-model="formData.hedgingMode" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.hedgingMode')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('strategy.strategyManagement.form.remark')" prop='remark'>
              <el-input type="textarea" v-model="formData.remark" resize='none'>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.strategyManagement.form.futuresOptimization')" name="hedgingPortfolio">
          <hedgingPortfolio ref="productTab" :type='type' :parentStrategyCode='this.$route.params.parentStrategyCode' :strategyCode='this.$route.params.uk' :strategyNature='flag' :strategyNatureF='strategyNatureF' :parentFlag='this.$route.params.parentFlag'></hedgingPortfolio>
        </el-tab-pane>
      </el-tabs>
    </main>
    <attachment v-if="attachmentVisible" :extraParam="extraParam" :opType="type" @closeHandler='attachmentClose'></attachment>
    <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='param' :opType="type" :opMode='"route"'></view-form-edit>
    <approve-history ref='approveHistory' v-if='approveHistoryVisible' @closeHandler='dialogHandlerHistory' :param='dialogParam' :opType="type"></approve-history>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import hedgingPortfolio from '@/views/frame/rm/strategy/strategyManagement/optimizationStrategy/hedgingPortfolio'
import TreeOrgBaseDept from '@/views/frame/base/organ/components/TreeOrgBaseDept'
import attachment from '@/components/frame/qm/Attachment/index.vue'
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    hedgingPortfolio,
    attachment,
    TreeOrgBaseDept
  },
  data() {
    return {
      approveHistoryVisible: false,
      attachmentVisible: false,
      extraParam: {},
      flag: this.$route.params.strategyType || this.strategyNature,
      dialogLv2Visible: false,
      mainInfoVisible: true,
      disabledFlag: false,
      type: this.$route.params.type || this.$route.params.opType,
      param: this.$route.params,
      dialogParam: {},
      activeName: 'hedgingPortfolio',
      formData: {
        strategyNature: this.$route.params.strategyType,
        parentStrategyCode: this.$route.params.uk
      },

      strategyNatureF: this.$route.params.strategyTypeParent || this.strategyNatureParent,

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
            required: false,
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
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userOrganCode', 'userDeptCode', 'userEmployeeCode'])
  },
  mounted() {
    this.formData.organCode = this.userOrganCode
    this.formData.deptCode = this.userDeptCode
    this.formData.applicant = this.userEmployeeCode
    this.getDisabled()
    this.getRequired()
    // 校验规则提示添加
    $('.edit-page-style .el-col .is-required .el-form-item__content').attr('data-content', this.$t('biz.placeholder.require'))

    // 渲染表格数据
    if (this.type !== 'add') this.getEditData()
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
  props: ['strategyNature', 'strategyNatureParent'],
  methods: {
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
        this.rules.strategyCode = [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    },
    attachmentClose() {
      this.attachmentVisible = false
    },
    // 附件
    attachment(buttonInfo) {
      this.extraParam.billType = 'STRATEGY'
      this.extraParam.billNo = this.formData.strategyCode
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
      if (this.$route.params.uk) {
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
          .catch(() => {})
      }
    },
    cancel() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        if (this.type === 'audit') {
          this.$router.push({
            name: 'todo'
          })
        } else {
          this.$router.push({
            name: 'strategyManagement'
          })
        }
      })
    },
    save() {
      this.$refs['refForm'].validate(valid => {
        if (valid) {
          this.formData.strDetailPurchaseList = this.$refs.productTab.buyData
          this.formData.strDetailSellList = this.$refs.productTab.$refs.productDetailTable.sellData
          this.formData.isOptimizeFlag = '2'
          if ((!this.formData.strDetailSellList || this.formData.strDetailSellList.length === 0) && (!this.formData.strDetailPurchaseList || this.formData.strDetailPurchaseList.length === 0)) {
            Notification(
              notifyInfo({
                msg: '优化标的:明细数据不能为空;目的标的:明细数据不能为空'
              })
            )
            return
          }
          if (!this.formData.strDetailPurchaseList || this.formData.strDetailPurchaseList.length === 0) {
            Notification(
              notifyInfo({
                msg: '优化标的:明细数据不能为空'
              })
            )
            return
          }
          if (!this.formData.strDetailSellList || this.formData.strDetailSellList.length === 0) {
            Notification(
              notifyInfo({
                msg: '目的标的:明细数据不能为空'
              })
            )
            return
          }
          if (this.formData.strategyNature === '1' || this.formData.strategyNature === '6') {
            var errorMessage = '目的标的：'
            this.formData.strDetailSellList.forEach(element => {
              if (!element.itemClass && !errorMessage.includes('类型不能为空')) {
                errorMessage = errorMessage + '类型不能为空;'
              }
              if (!element.productCode && !errorMessage.includes('品名不能为空')) {
                errorMessage = errorMessage + '品名不能为空;'
              }
              if (element.itemClass === '2' && !element.maxHands && !errorMessage.includes('类型为期货时,最大开仓手数不能为空')) {
                errorMessage = errorMessage + '类型为期货时,最大开仓手数不能为空;'
              }
              if (element.itemClass === '1' && !element.maxPostion && !errorMessage.includes('类型为现货时,最大开仓量不能为空')) {
                errorMessage = errorMessage + '类型为现货时,最大开仓量不能为空;'
              }
              if (!element.currencyCode && !errorMessage.includes('币种不能为空')) {
                errorMessage = errorMessage + '币种不能为空;'
              }
            })
            if (errorMessage !== '目的标的：') {
              Notification(
                notifyInfo({
                  msg: errorMessage
                })
              )
              return
            }
          }
          if (this.formData.strategyNature === '2') {
            var errMsg2 = '目的标的：'
            this.formData.strDetailSellList.forEach(element => {
              if (!element.productCode && !errMsg2.includes('品名不能为空')) {
                errMsg2 = errMsg2 + '品名不能为空;'
              }
              if (!element.maxHands && !errMsg2.includes('最大开仓手数不能为空')) {
                errMsg2 = errMsg2 + '最大开仓手数不能为空;'
              }
              if (!element.currencyCode && !errMsg2.includes('币种不能为空')) {
                errMsg2 = errMsg2 + '币种不能为空;'
              }
            })
            if (errMsg2 !== '目的标的：') {
              Notification(
                notifyInfo({
                  msg: errMsg2
                })
              )
              return
            }
          }
          if (this.formData.strategyNature === '3') {
            var errMsg3 = '目的标的：'
            this.formData.strDetailSellList.forEach(element => {
              if (!element.productCode && !errMsg3.includes('品名不能为空')) {
                errMsg3 = errMsg3 + '品名不能为空;'
              }
              if (!element.maxPostion && !errMsg3.includes('最大开仓量不能为空')) {
                errMsg3 = errMsg3 + '最大开仓量不能为空;'
              }
              if (!element.currencyCode && !errMsg3.includes('币种不能为空')) {
                errMsg3 = errMsg3 + '币种不能为空;'
              }
            })
            if (errMsg3 !== '目的标的：') {
              Notification(
                notifyInfo({
                  msg: errMsg3
                })
              )
              return
            }
          }
          if (this.formData.strategyNature === '4') {
            var errMsg4 = '目的标的：'
            this.formData.strDetailSellList.forEach(element => {
              if (!element.productCode && !errMsg4.includes('品名不能为空')) {
                errMsg4 = errMsg4 + '品名不能为空;'
              }
              if (!element.direction && !errMsg4.includes('方向不能为空')) {
                errMsg4 = errMsg4 + '方向不能为空;'
              }
              if (!element.maxHands && !errMsg4.includes('最大开仓手数不能为空')) {
                errMsg4 = errMsg4 + '最大开仓手数不能为空;'
              }
              if (!element.currencyCode && !errMsg4.includes('币种不能为空')) {
                errMsg4 = errMsg4 + '币种不能为空;'
              }
            })
            if (errMsg4 !== '目的标的：') {
              Notification(
                notifyInfo({
                  msg: errMsg4
                })
              )
              return
            }
          }
          if (this.formData.strategyNature === '5') {
            var errMsg5 = '目的标的：'
            this.formData.strDetailSellList.forEach(element => {
              if (!element.productCode && !errMsg5.includes('品名不能为空')) {
                errMsg5 = errMsg5 + '品名不能为空;'
              }
              if (!element.maxPostion && !errMsg5.includes('最大开仓量不能为空')) {
                errMsg5 = errMsg5 + '最大开仓量不能为空;'
              }
              if (!element.direction && !errMsg5.includes('方向不能为空')) {
                errMsg5 = errMsg5 + '方向不能为空;'
              }
              if (!element.currencyCode && !errMsg5.includes('币种不能为空')) {
                errMsg5 = errMsg5 + '币种不能为空;'
              }
            })
            if (errMsg5 !== '目的标的：') {
              Notification(
                notifyInfo({
                  msg: errMsg5
                })
              )
              return
            }
          }
          if (this.type === 'add') {
            this.formData.parentStrategyCode = this.$route.params.uk
            request({
              url: '/api/strg/strategy/save',
              method: 'post',
              data: {
                data: this.formData,
                funcModule: '策略管理',
                funcOperation: '新增'
              }
            })
              .then(() => {
                Notification(
                  notifySuccess({
                    msg: this.$t('biz.msg.insertSuccess')
                  })
                )
                this.cancel()
              })
              .catch(() => {})
          } else if (this.type === 'update') {
            request({
              url: '/api/strg/strategy/update',
              method: 'post',
              data: {
                data: this.formData,
                funcModule: '策略管理',
                funcOperation: '更新'
              }
            })
              .then(() => {
                Notification(
                  notifySuccess({
                    msg: this.$t('biz.msg.updateSuccess')
                  })
                )
                this.cancel()
              })
              .catch(() => {})
          }
        } else {
          return false
        }
      })
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
      this.dialogParam = Object.assign({}, this.param, {
        moduleCode: this.$route.meta.bpmModule
      })
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

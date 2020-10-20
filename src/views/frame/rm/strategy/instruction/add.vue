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
      <el-button v-if="[ 'add', 'update'].includes(type) && $route.params.typeFlag ? $route.params.typeFlag==='1' : typeFlagF === '1'" v-db-click size="mini" style='margin-right:6px;' @click="strategyDialogOpen">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.selectStrategy')}}
      </el-button>
      <el-button v-if="[ 'add', 'update'].includes(type) && $route.params.typeFlag ? $route.params.typeFlag==='0' : typeFlagF === '0'" v-db-click size="mini" style='margin-right:6px;' @click="planDialogOpen">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.selectPlan')}}
      </el-button>
    </el-row>
    <!-- 内容 -->
    <header :style="{'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.basicInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="refForm">
        <el-row :gutter="20">
          <el-col :span="6" v-if="$route.params.typeFlag ? $route.params.typeFlag==='1' : typeFlagF === '1'">
            <el-form-item :label="$t('strategy.instruction.form.strategyName')" prop='planName'>
              <el-input v-model="formData.planName" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="$route.params.typeFlag ? $route.params.typeFlag==='1' : typeFlagF === '1'">
            <el-form-item :label="$t('strategy.instruction.form.strategyCode')" prop='planCode'>
              <el-input v-model="formData.planCode" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="$route.params.typeFlag ? $route.params.typeFlag==='0' : typeFlagF === '0'">
            <el-form-item :label="$t('strategy.instruction.form.planName')" prop='planName'>
              <el-input v-model="formData.planName" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="$route.params.typeFlag ? $route.params.typeFlag==='0' : typeFlagF === '0'">
            <el-form-item :label="$t('strategy.instruction.form.planCode')" prop='planCode'>
              <el-input v-model="formData.planCode" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.instructionType')" prop='instructionType'>
              <el-select v-model="formData.instructionType" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.instructionType1')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.instructionName')" prop='instructionName'>
              <input-validate v-model="formData.instructionName" :clearable='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.instructionCode')" prop='instructionCode'>
              <input-validate v-model="formData.instructionCode" :clearable='true' :disabled='disabledFlag'></input-validate>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.startDate')" prop='startDate'>
              <el-date-picker v-model="formData.startDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.endDate')" prop='endDate'>
              <el-date-picker v-model="formData.endDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.organCode')" prop='organCode'>
              <base-select v-model="formData.organCode" :attrs="{data: 'TREE_ORGAN',clearable: true,disabled:true }"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.deptCode')" prop='deptCode'>
              <TreeOrgBaseDept v-model="formData.deptCode" @handleNode='changeAll' :clearable='true'></TreeOrgBaseDept>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.faccount')" prop='faccount'>
              <base-select v-model="formData.faccount" :attrs="{data: 'DERIVATIVE_ACCOUNT',clearable: true }"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.subFaccount')" prop='subFaccount'>
              <base-select v-model="formData.subFaccount" :attrs="{data: 'DERIVATIVE_SUB_ACCOUNT',clearable: true }"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.traderCode')" prop='traderCode'>
              <base-select v-model="formData.traderCode" :attrs="{data: 'TREE_STAFF',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.instruction.form.orderCode')" prop='orderCode'>
              <base-select v-model="formData.orderCode" :attrs="{data: 'TREE_STAFF',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="['1','2'].includes(formData.strategyNature)">
            <el-form-item :label="$t('strategy.plan.form.enterMode')" prop='enterMode'>
              <el-select v-model="formData.enterMode" :clearable="true" :placeholder="$t('biz.placeholder.choose')" @change="modeChange">
                <el-option v-for="item in $t('datadict.enterMode')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="formData.enterMode && formData.enterMode!=='2'">
            <el-form-item :label="$t('strategy.plan.form.stopPoint')" prop='stopPoint'>
              <input-formatter v-model="formData.stopPoint" :min="0" :precision="2"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="['1','2'].includes(formData.strategyNature)">
            <el-form-item :label="$t('strategy.plan.form.limit')" v-if="formData.enterMode === '3'">
              <div style="width:48%;float:left">
                <input-formatter v-model="formData.minLimit" :min="-9999999999" :max="formData.maxHedgeRatio === null ? 9999999 : parseFloat(formData.maxLimit)" :precision="2"></input-formatter>
              </div>
              <div style="float:left">-</div>
              <div style="width:48%;float:left">
                <input-formatter v-model="formData.maxLimit" :min="formData.minHedgeRatio === null ? -999999999 : parseFloat(formData.minLimit)" :precision="2"></input-formatter>
              </div>
            </el-form-item>
            <el-form-item :label="$t('strategy.plan.form.priceDiff')" v-if="formData.enterMode === '1'">
              <div style="width:48%;float:left">
                <input-formatter v-model="formData.minLimit" :min="-9999999" :max="formData.maxHedgeRatio === null ? 9999999 : parseFloat(formData.maxLimit)" :precision="2"></input-formatter>
              </div>
              <div style="float:left">-</div>
              <div style="width:48%;float:left">
                <input-formatter v-model="formData.maxLimit" :min="formData.minHedgeRatio === null ? -9999999 : parseFloat(formData.minLimit)" :precision="2"></input-formatter>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.instruction.form.instrDetail')" name="instruction">
          <div>
            <div class='tabs-operate' style='margin-top:5px;' v-if="['add', 'update'].includes(type)">
              <el-button v-db-click size="mini" @click="addRow">
                <svg-icon icon-class="线性-增行"></svg-icon>增行
              </el-button>
              <el-button v-db-click size="mini" @click="deleteRow">
                <svg-icon icon-class="线性-删行"></svg-icon>删行
              </el-button>
            </div>
            <el-table stripe border ref="instrDetail" class='table-content tb-edit' :data="instrDetailDtoList" style="border:1px solid;" @selection-change="selectionChange" @row-click='handleClick' height="300" highlight-current-row>
              <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
              <el-table-column type="selection" width="45" align='center'></el-table-column>
              <!-- 品种 -->
              <el-table-column width="120" :label="$t('strategy.instruction.tab.productCode')" prop="productName">
                <template slot-scope='scope'>
                  <span style='padding:0 10px;'>{{ scope.row.productName }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('strategy.instruction.tab.contractCode')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.instruction.tab.contractCode')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <base-select size="mini" v-model="scope.row.contractCode" :attrs="{data: 'FUTURES_CONTRACT',clearable:true,params:{futuresVarietiesCode:scope.row.productCode} ,filterable: true}"></base-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('strategy.instruction.tab.direction')" width="80">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.instruction.tab.direction')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                    <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('strategy.instruction.tab.offsetFlag')" width="80">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.instruction.tab.offsetFlag')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <el-select size='mini' v-model="scope.row.offsetFlag" :disabled="scope.row.itemClass === '3'" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                    <el-option v-for="item in $t('datadict.offset')" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column :label="$t('strategy.instruction.tab.lots')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.instruction.tab.lots')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter :max='999999999999.9999' v-model="scope.row.lots" type="thousands" size="mini"></input-formatter>
                </template>
              </el-table-column>
              <el-table-column :label="$t('strategy.instruction.tab.unit')" width="90">
                <template slot-scope="scope">
                  <el-select size='mini' v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')" :clearable="true" :disabled="true">
                    <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('strategy.instruction.tab.price')" width="120" v-if="formData.enterMode==='2' ||formData.strategyNature!=='1'">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.instruction.tab.price')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter :max='999999999999.9999' v-model="scope.row.price" type="thousands" size="mini"></input-formatter>
                </template>
              </el-table-column>
              <el-table-column :label="$t('strategy.instruction.tab.priceDiff')" width="120" v-if="formData.enterMode==='2'||formData.strategyNature!=='1'">
                <template slot-scope="scope">
                  <input-formatter :max='999999999999.9999' v-model="scope.row.priceDiff" type="thousands" size="mini"></input-formatter>
                </template>
              </el-table-column>
              <el-table-column :label="$t('strategy.instruction.tab.currencyCode')" width="90">
                <template slot-scope="scope">
                  <base-select size="mini" v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY',clearable: true}"></base-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('strategy.instruction.tab.remark')" width="160">
                <template slot-scope="scope">
                  <input-validate size="mini" v-model="scope.row.remark" :placeholder="$t('biz.placeholder.input')" :clearable="true"></input-validate>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </main>
    <approve-history ref='approveHistory' v-if='approveHistoryVisible' @closeHandler='dialogHandlerHistory' :param='dialogParam' :opType="type"></approve-history>
    <strategyDialog v-if="strategyDialogVisible" :itemClassF="'2'" @close="strategyDialogClose" @confirm="strategyDialogConfirm" :strategyNatures="[ '1', '2', '4', '6']" :strgLevels="['2']"></strategyDialog>
    <planDialog v-if="planDialogVisible" :itemClass="'2'" @close="planDialogClose" @confirm="planDialogConfirm" :strategyNatures="[ '1', '2', '4', '6']" :strgLevels="['1']"></planDialog>
    <strategyDetailDialog v-if="dialogVisible" :strategyNature="formData.strategyNature" :strategyCode="formData.planCode" :itemClass="'2'" @closeHandlerDialog="strDetailDialogClose" @confirm="strDetailDialogConfirm"></strategyDetailDialog>
    <planDetailDialog v-if="dialogVisiblePlan" :strategyNature="formData.strategyNature" :planCode="formData.planCode" :itemClass="'2'" @closeHandlerDialog="planDetailDialogClose" @confirm="planDetailDialogConfirm"></planDetailDialog>
    <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='param' :opType="type" :opMode='"route"'></view-form-edit>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import Vue from 'vue'
import strategyDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDialog'
import planDialog from '@/views/frame/rm/strategy/plan/component/planDialog'
import strategyDetailDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDetailDialog'
import planDetailDialog from '@/views/frame/rm/strategy/instruction/component/planDetailDialog'
import TreeOrgBaseDept from '@/views/frame/base/organ/components/TreeOrgBaseDept'
import { mapGetters } from 'vuex'

export default {
  components: {
    planDialog,
    strategyDialog,
    strategyDetailDialog,
    planDetailDialog,
    TreeOrgBaseDept
  },
  data() {
    return {
      currencyCode: '',
      disabledFlag: false,
      approveHistoryVisible: false,
      dialogVisible: false,
      typeFlag: this.$route.params.typeFlag || this.typeFlagF,
      dialogVisiblePlan: false,
      param: this.$route.params,
      dialogParam: {},
      dialogLv2Visible: false,
      mainInfoVisible: true,
      type: this.$route.params.type || this.$route.params.opType,
      activeName: 'instruction',
      formData: { planCode: '', deptCode: '', organCode: '' },
      rules: {
        instructionName: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        instructionCode: [
          {
            required: false,
            trigger: 'blur'
          }
        ],
        instructionType: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        startDate: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        endDate: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        deptCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        orderCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        subFaccount: [
          {
            required: false,
            trigger: 'change'
          }
        ]
      },
      instrDetailDtoList: [],
      multipleSelection: [],
      strategyDialogVisible: false,
      planDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['userEmployeeCode'])
  },
  async mounted() {
    this.$set(this.formData, 'orderCode', this.userEmployeeCode)
    this.getDisabled()
    this.getRequired()
    // 校验规则提示添加
    $('.edit-page-style .el-col .is-required .el-form-item__content').attr('data-content', this.$t('biz.placeholder.require'))

    // 渲染表格数据
    if (this.type !== 'add' && this.type !== 'copy') {
      this.getEditData()
    }
    if (this.type === 'copy') {
      this.type = 'add'
      this.getEditData()
    }
    this.getCurrentCurrency()
    if (this.type === 'add' && this.$route.params.strategyCode) {
      this.initStrategy(this.$route.params.strategyCode)
    }
    if (this.type === 'add' && this.$route.params.planCode) {
      this.initPlan(this.$route.params.planCode)
    }
  },
  props: ['typeFlagF'],
  methods: {
    initStrategy(val) {
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
        this.formData.planCode = data.strategyCode
        this.formData.planName = data.strategyName
        this.formData.strategyNature = data.strategyNature
        this.formData.strgLevel = data.strgLevel
        this.formData.organCode = data.organCode
        this.formData.deptCode = data.deptCode
        this.formData.orderCode = data.applicant
        this.$set(this.formData, 'enterMode', '2')
      }).catch(() => { })
    },
    initPlan(val) {
      request({
        url: '/api/strategy/strgPlan/get',
        method: 'post',
        data: {
          data: val,
          funcModule: '策略管理',
          funcOperation: '获取单个'
        }
      }).then(response => {
        const data = response.data
        this.formData.planCode = data.planCode
        this.formData.planName = data.planName
        this.formData.strategyNature = data.strategyNature
        this.formData.strgLevel = data.strgLevel
        this.formData.organCode = data.organCode
        this.formData.deptCode = data.deptCode
        this.formData.orderCode = data.applicant
      }).catch(() => { })
    },
    getCurrentCurrency() {
      request({
        url: '/api/dd/selectData/list',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            type: 'CURRENCY'
          }
        }
      }).then(response => {
        response.data.forEach(element => {
          if (element.name === '人民币') {
            this.currencyCode = element.code
          }
        })
      })
    },
    orderCodeChange() {
      this.formData.planCode = ''
      this.formData.planName = ''
      this.formData.strategyNature = ''
      this.formData.strgLevel = ''
      this.formData.organCode = ''
      this.formData.deptCode = ''
    },
    modeChange() {
      if (this.formData.enterMode === '2') {
        this.formData.stopPoint = null
        this.formData.minLimit = null
        this.formData.maxLimit = null
      } else {
        if (this.instrDetailDtoList.length > 0) {
          this.instrDetailDtoList.forEach(element => {
            element.price = null
            element.priceDiff = null
          })
        }
      }
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
        this.rules.instructionCode = [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    },
    changePlanCode(value) {
      this.instrDetailDtoList = []
    },
    changeAll(val) {
      if (val) {
        this.formData.organCode = val.orgCode
      } else {
        this.formData.organCode = ''
      }
    },
    planDetailDialogConfirm(valArray) {
      this.dialogVisiblePlan = false
      valArray.forEach((i, index) => {
        this.instrDetailDtoList.push({
          productCode: i.productCode,
          productName: i.productName,
          contractCode: i.contractCode,
          direction: i.direction,
          offsetFlag: i.offsetFlag,
          currencyCode: this.currencyCode,
          unitCode: '5',
          itemClass: i.itemClass,
          rowNum: this.instrDetailDtoList.length + i
        })
      })
    },

    planDetailDialogClose() {
      this.dialogVisiblePlan = false
    },
    // 增行
    addRow() {
      if (this.typeFlag === '1') {
        if (!this.formData.planCode) {
          Notification(
            notifyInfo({
              msg: '请先选择所属策略'
            })
          )
          return
        }
        this.dialogVisible = true
      }
      if (this.typeFlag === '0') {
        if (!this.formData.planCode) {
          Notification(
            notifyInfo({
              msg: '请先选择所属计划'
            })
          )
          return
        }
        this.dialogVisiblePlan = true
      }
    },

    strategyDialogConfirm(val) {
      this.instrDetailDtoList = []
      // 赋值
      this.strategyDialogVisible = false
      this.formData.planCode = val.strategyCode
      this.formData.planName = val.strategyName
      this.formData.strategyNature = val.strategyNature
      this.formData.strgLevel = val.strgLevel
      this.formData.organCode = val.organCode
      this.formData.deptCode = val.deptCode
      this.formData.orderCode = val.applicant
    },
    planDialogConfirm(val) {
      this.instrDetailDtoList = []
      // 赋值
      this.planDialogVisible = false
      this.formData.planCode = val.planCode
      this.formData.planName = val.planName
      this.formData.strategyNature = val.strategyNature
      this.formData.strgLevel = val.strgLevel
      this.formData.organCode = val.organCode
      this.formData.deptCode = val.deptCode
      this.formData.orderCode = val.applicant
    },
    // 策略弹窗-关闭
    strategyDialogClose() {
      this.strategyDialogVisible = false
    },
    // 计划弹窗-关闭
    planDialogClose() {
      this.planDialogVisible = false
    },
    // 策略弹窗-显示
    strategyDialogOpen() {
      // if (!this.formData.orderCode) {
      //   Notification(
      //     notifyInfo({
      //       msg: this.$t('strategy.instruction.msg.orderFirst')
      //     })
      //   )
      //   return
      // }
      this.strategyDialogVisible = true
    },
    // 计划弹窗-显示
    planDialogOpen() {
      // if (!this.formData.orderCode) {
      //   Notification(
      //     notifyInfo({
      //       msg: this.$t('strategy.instruction.msg.orderFirst')
      //     })
      //   )
      //   return
      // }
      this.planDialogVisible = true
    },
    // 获取初始化数据
    getEditData() {
      if (this.$route.params.uk) {
        request({
          url: '/api/strg/instruction/get',
          method: 'post',
          data: {
            data: this.$route.params.uk,
            funcModule: '策略管理',
            funcOperation: '获取单个'
          }
        })
          .then(response => {
            this.formData = response.data
            if (this.type === 'add') {
              this.formData.instructionCode = ''
              this.formData.id = ''
            }
          })
          .catch(() => {})
      }
      if (this.$route.params.uk) {
        request({
          url: '/api/strg/strgInstrDetail/listByCode',
          method: 'post',
          data: {
            data: {
              instructionCode: this.$route.params.uk
            },
            funcModule: '策略管理',
            funcOperation: '获取单个'
          }
        })
          .then(response => {
            this.instrDetailDtoList = response.data
            this.instrDetailDtoList.forEach(element => {
              if (this.type === 'add') {
                element.id = ''
              }
              element.unitCode = '5'
            })
          })
          .catch(() => {})
      }
    },
    cancel() {
      if (this.type === 'audit') {
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: 'todo'
          })
        })
        return
      }
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'instructionManagement'
        })
      })
    },

    save() {
      this.$refs['refForm'].validate(valid => {
        if (valid) {
          if (this.formData.instructionType === '4') {
            if (this.instrDetailDtoList.length < 2) {
              Notification(
                notifyInfo({
                  msg: '指令明细至少两条'
                })
              )
              return
            }
            if (this.instrDetailDtoList.length > 1) {
              var array = []
              this.instrDetailDtoList.forEach(element => {
                if (!array.includes(element.contractCode)) {
                  array.push(element.contractCode)
                }
              })
              if (array.length !== this.instrDetailDtoList.length) {
                Notification(
                  notifyInfo({
                    msg: '所选择的合约必须不同'
                  })
                )
                return
              }
            }
          }
          var errMsg = ''
          if (this.instrDetailDtoList && this.instrDetailDtoList.length >= 1) {
            this.instrDetailDtoList.forEach(element => {
              if ((!element.contractCode || element.contractCode === '') && !errMsg.includes('合约不能为空')) {
                errMsg = errMsg + '合约不能为空 '
              }
              if ((!element.direction || element.direction === '') && !errMsg.includes('方向不能为空')) {
                errMsg = errMsg + '方向不能为空 '
              }
              if ((!element.offsetFlag || element.offsetFlag === '') && !errMsg.includes('开/平不能为空') && element.itemClass === '2') {
                errMsg = errMsg + '开/平不能为空 '
              }
              if ((!element.lots || element.lots === '') && !errMsg.includes('手数不能为空')) {
                errMsg = errMsg + '手数不能为空 '
              }
              if ((this.formData.enterMode === '2' || !['1', '2'].includes(this.formData.strategyNature)) && (!element.price || element.price === '') && !errMsg.includes('成交价格不能为空')) {
                errMsg = errMsg + '成交价格不能为空 '
              }
            })
            if (errMsg !== '') {
              Notification(
                notifyInfo({
                  msg: errMsg
                })
              )
              return
            }
          } else {
            Notification(
              notifyInfo({
                msg: '指令明细不能为空'
              })
            )
            return
          }
          if (this.type === 'add') {
            this.formData.instrDetailDtoList = this.instrDetailDtoList
            request({
              url: '/api/strg/instruction/save',
              method: 'post',
              data: {
                data: this.formData,
                funcModule: '指令管理',
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
            this.formData.instrDetailDtoList = this.instrDetailDtoList
            request({
              url: '/api/strg/instruction/update',
              method: 'post',
              data: {
                data: this.formData,
                funcModule: '指令管理',
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
    strDetailDialogClose() {
      this.dialogVisible = false
    },
    strDetailDialogConfirm(valArray) {
      this.dialogVisible = false
      valArray.forEach((i, index) => {
        this.instrDetailDtoList.push({
          productCode: i.productCode,
          productName: i.productName,
          contractCode: i.contractCode,
          currencyCode: this.currencyCode,
          unitCode: '5',
          itemClass: i.itemClass,
          rowNum: this.instrDetailDtoList.length + i
        })
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
    },
    // 处理勾选后
    selectionChange(val) {
      this.multipleSelection = val
    },
    handleClick(row) {
      this.$refs.instrDetail.toggleRowSelection(row)
    },
    // 删行
    deleteRow(file) {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            for (let i = this.instrDetailDtoList.length; i--; i >= 0) {
              if (this.multipleSelection.includes(this.instrDetailDtoList[i])) {
                this.instrDetailDtoList.splice(i, 1)
              }
            }

            // const filterArr = this.multipleSelection.map(
            //   select => select.rowNum
            // )
            // const templateData = []
            // this.instrDetailDtoList.forEach((item, index) => {
            //   if (!filterArr.includes(item.rowNum)) {
            //     templateData.push(item)
            //   }
            // })
            // templateData.forEach((i, index) => {
            //   i.rowNum = index
            // })
            // this.instrDetailDtoList = templateData
          })
          .catch(() => {})
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    }
  }
}
</script>

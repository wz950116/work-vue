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
            <el-form-item :label="$t('strategy.optionInstruction.form.strategyName')" prop='planName'>
              <el-input v-model="formData.planName" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="$route.params.typeFlag ? $route.params.typeFlag==='1' : typeFlagF === '1'">
            <el-form-item :label="$t('strategy.optionInstruction.form.strategyCode')" prop='planCode'>
              <el-input v-model="formData.planCode" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="$route.params.typeFlag ? $route.params.typeFlag==='0' : typeFlagF === '0'">
            <el-form-item :label="$t('strategy.optionInstruction.form.planName')" prop='planName'>
              <el-input v-model="formData.planName" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="$route.params.typeFlag ? $route.params.typeFlag==='0' : typeFlagF === '0'">
            <el-form-item :label="$t('strategy.optionInstruction.form.planCode')" prop='planCode'>
              <el-input v-model="formData.planCode" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionInstruction.form.instructionName')" prop='instructionName'>
              <input-validate v-model="formData.instructionName" :clearable='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionInstruction.form.instructionCode')" prop='instructionCode'>
              <input-validate v-model="formData.instructionCode" :clearable='true' :disabled='getBillNoRequired()'></input-validate>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionInstruction.form.startDate')" prop='startDate'>
              <el-date-picker v-model="formData.startDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionInstruction.form.endDate')" prop='endDate'>
              <el-date-picker v-model="formData.endDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionInstruction.form.organCode')" prop='organCode'>
              <base-select v-model="formData.organCode" :attrs="{data: 'TREE_ORGAN',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionInstruction.form.deptCode')" prop='deptCode'>
              <TreeOrgBaseDept v-model="formData.deptCode" :clearable='true'></TreeOrgBaseDept>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionInstruction.form.traderCode')" prop='traderCode'>
              <base-select v-model="formData.traderCode" :attrs="{data: 'TREE_STAFF',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionInstruction.form.orderCode')" prop='orderCode'>
              <base-select v-model="formData.orderCode" :attrs="{data: 'TREE_STAFF',clearable: true}"></base-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.optionInstruction.form.instrDetail')" name="optionInstruction">
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
              <!-- 期权合约 -->
              <el-table-column :label="$t('strategy.optionInstruction.list.optionContract')" width="240">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.optionInstruction.list.optionContract')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <base-select size="mini" v-model="scope.row.contractCode" @change="e =>contractChange(e, scope.row)" :attrs="{data: 'OPTION_CONTRACT',clearable:true ,filterable: true}"></base-select>
                </template>
              </el-table-column>
              <!-- 方向 -->
              <el-table-column :label="$t('strategy.optionInstruction.list.optionDirection')" width="80">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.optionInstruction.list.optionDirection')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                    <el-option v-for="item in $t('datadict.optionDirection')" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 交易动作 -->
              <el-table-column :label="$t('strategy.optionInstruction.list.optionOffset')" width="80">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.optionInstruction.list.optionOffset')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <el-select size='mini' v-model="scope.row.optionOffset" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                    <el-option v-for="item in $t('datadict.optionOffset')" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 看涨/看跌 -->
              <el-table-column :label="$t('strategy.optionInstruction.list.callPut')" width="120">
                <template slot-scope="scope">
                  <el-select size='mini' v-model="scope.row.callPut" :placeholder="$t('biz.placeholder.choose')" :disabled="true">
                    <el-option v-for="item in $t('datadict.callPut')" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 执行价 -->
              <el-table-column :label="$t('strategy.optionInstruction.list.strikePrice')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.optionInstruction.list.strikePrice')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter :max='999999999999.9999' v-model="scope.row.strikePrice" type="thousands" size="mini"></input-formatter>
                </template>
              </el-table-column>
              <!-- 期权单价 -->
              <el-table-column :label="$t('strategy.optionInstruction.list.price')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.optionInstruction.list.price')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter :max='999999999999.9999' v-model="scope.row.price" type="thousands" size="mini"></input-formatter>
                </template>
              </el-table-column>
              <!-- 价差 -->
              <el-table-column :label="$t('strategy.optionInstruction.list.priceDiff')" width="120">
                <template slot-scope="scope">
                  <input-formatter :max='999999999999.9999' v-model="scope.row.priceDiff" type="thousands" size="mini"></input-formatter>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column :label="$t('strategy.optionInstruction.list.lots')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('strategy.optionInstruction.list.lots')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter :max='999999999999' v-model="scope.row.lots" type="thousands" :precision='0' size="mini"></input-formatter>
                </template>
              </el-table-column>
              <!-- 单位 -->
              <el-table-column :width="90" :label="$t('strategy.optionInstruction.list.unitCode')" prop="unitCode">
                <template slot-scope="scope">
                  {{$t('strategy.optionInstruction.list.hand')}}
                </template>
              </el-table-column>
              <!-- 到期日 -->
              <el-table-column width="100" align='center' :label="$t('strategy.optionInstruction.list.endDate')" prop="endDate">
                <template slot-scope="scope">
                  <span>{{scope.row.endDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 备注 -->
              <el-table-column width="200" :label="$t('strategy.optionInstruction.list.remark')" prop="remark">
                <template slot-scope="scope">
                  <input-validate v-model="scope.row.remark" :clearable='true' size="mini"></input-validate>
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
import TreeOrgBaseDept from '@/views/frame/base/organ/components/TreeOrgBaseDept'
export default {
  components: {
    planDialog,
    strategyDialog,
    TreeOrgBaseDept
  },
  data() {
    return {
      currencyCode: '',
      approveHistoryVisible: false,
      dialogVisible: false,
      typeFlag: this.$route.params.typeFlag || this.typeFlagF,
      dialogVisiblePlan: false,
      param: this.$route.params,
      dialogParam: {},
      dialogLv2Visible: false,
      mainInfoVisible: true,
      type: this.$route.params.type || this.$route.params.opType,
      activeName: 'optionInstruction',
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
            required: !this.getBillNoRequired(),
            trigger: 'blur'
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
            required: true,
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
  async mounted() {
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

    this.currencyCode = await this.$store.dispatch('getCurrencyCode', {
      funcModule: this.$t('route.' + this.$route.meta.title),
      name: '人民币'
    })
  },
  props: ['typeFlagF'],

  methods: {
    contractChange(value, row) {
      request({
        url: '/api/data/ddOptionContract/get',
        method: 'post',
        data: {
          data: value,
          funcModule: '指令管理',
          funcOperation: '获取期权合约'
        }
      }).then(response => {
        const data = response.data
        this.$set(row, 'callPut', data.callPut)
        this.$set(row, 'endDate', data.endDate)
      })
    },
    getBillNoRequired() {
      if ((this.$route.params.type || this.$route.params.opType) === 'add') {
        const seqMode = this.$route.meta.seqMode
        if (seqMode && seqMode === '0') {
          return true
        }
        return false
      } else {
        return true
      }
    },

    // 增行
    addRow() {
      this.instrDetailDtoList.push({
        planCode: '',
        planName: '',
        optionInstructionName: '',
        optionInstructionCode: ''
      })
    },
    strategyDialogConfirm(val) {
      this.instrDetailDtoList = []
      // 赋值
      this.strategyDialogVisible = false
      this.formData.planCode = val.strategyCode
      this.formData.planName = val.strategyName
      this.formData.organCode = val.organCode
      this.formData.deptCode = val.deptCode
      this.formData.strategyNature = val.strategyNature
      this.formData.strategyCode = val.strategyCode
      this.formData.strategyName = val.strategyName
    },
    planDialogConfirm(val) {
      this.instrDetailDtoList = []
      // 赋值
      this.planDialogVisible = false
      this.formData.planCode = val.planCode
      this.formData.planName = val.planName
      this.formData.organCode = val.organCode
      this.formData.deptCode = val.deptCode
      this.formData.strategyNature = val.strategyNature
      this.formData.strategyCode = val.strategyCode
      this.formData.strategyName = val.strategyName
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
      this.strategyDialogVisible = true
    },
    // 计划弹窗-显示
    planDialogOpen() {
      this.planDialogVisible = true
    },
    // 获取初始化数据
    getEditData() {
      if (this.$route.params.uk) {
        request({
          url: '/api/strategy/strgOptInstruction/get',
          method: 'post',
          data: {
            data: this.$route.params.uk,
            funcModule: '策略管理',
            funcOperation: '获取单个'
          }
        })
          .then(response => {
            this.formData = response.data
            this.instrDetailDtoList = response.data.detailList
            if (this.type === 'add') {
              this.formData.optionInstructionCode = ''
              this.formData.id = ''
            }
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
          name: 'optionInstruction'
        })
      })
    },

    save() {
      this.$refs['refForm'].validate(valid => {
        if (valid) {
          var errMsg = ''
          if (this.instrDetailDtoList && this.instrDetailDtoList.length >= 1) {
            this.instrDetailDtoList.forEach(element => {
              if ((!element.contractCode || element.contractCode === '') && !errMsg.includes('合约不能为空')) {
                errMsg = errMsg + '合约不能为空 '
              }
              if ((!element.direction || element.direction === '') && !errMsg.includes('买/卖不能为空')) {
                errMsg = errMsg + '买/卖不能为空 '
              }
              if ((!element.optionOffset || element.optionOffset === '') && !errMsg.includes('交易动作不能为空')) {
                errMsg = errMsg + '交易动作不能为空 '
              }
              if ((!element.strikePrice || element.strikePrice === '') && !errMsg.includes('执行价不能为空')) {
                errMsg = errMsg + '执行价不能为空 '
              }
              if ((!element.price || element.price === '') && !errMsg.includes('期权单价不能为空')) {
                errMsg = errMsg + '期权单价不能为空 '
              }
              if ((!element.lots || element.lots === '') && !errMsg.includes('手数不能为空')) {
                errMsg = errMsg + '手数不能为空 '
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
            this.formData.detailList = this.instrDetailDtoList
            request({
              url: '/api/strategy/strgOptInstruction/save',
              method: 'post',
              data: {
                data: this.formData,
                funcModule: '期权指令管理',
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
            this.formData.detailList = this.instrDetailDtoList
            request({
              url: '/api/strategy/strgOptInstruction/update',
              method: 'post',
              data: {
                data: this.formData,
                funcModule: '期权指令管理',
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
            const filterArr = this.multipleSelection.map(select => select.rowNum)
            const templateData = []
            this.instrDetailDtoList.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })
            templateData.forEach((i, index) => {
              i.rowNum = index
            })
            this.instrDetailDtoList = templateData
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

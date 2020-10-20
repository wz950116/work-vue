<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" @click="close" v-if="type==='view'" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" @click="cancel" v-if="['add', 'update', 'assist', 'audit'].includes(type)" style='margin-right:6px;'>
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" @click="save" v-if="['add', 'update'].includes(type)" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-if="[ 'add', 'update'].includes(type)" v-db-click size="mini" style='margin-right:6px;' @click="planDialogOpen">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.selectStrategy')}}
      </el-button>
    </el-row>
    <!-- 内容 -->
    <header :style="{'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.mainInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="validateForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('strategy.posMatch.form.strategyName')" prop='instructionCode'>
              <el-input v-model="formData.instructionName" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.posMatch.form.matchCode')" prop='matchCode'>
              <input-validate v-model="formData.matchCode" :disabled='disabledFlag'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.posMatch.form.makeUser')" prop='makeUser'>
              <base-select v-model="formData.makeUser" :attrs="{data: 'TREE_STAFF', disabled: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.posMatch.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='true' />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.posMatch.tab.strategyInfo')" name="strategyInfo">
          <strategyInfo ref="strategyInfo" :itemClass="['2']" :strategyCode="formData.instructionCode" :strategyNature="formData.strategyNature" :optType='type' :tradeBatchDto='formData.detailList'></strategyInfo>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="bottomName" type="border-card">
        <el-tab-pane :label="$t('strategy.posMatch.tab.tradeInfo')" name="tradeInfo">
          <futureTradeInfo ref="tradeInfo" @changeMatch="changeMatch"></futureTradeInfo>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="tabModule" type="border-card">
        <el-tab-pane v-if="formData.matchNature === '1'" :label="$t('strategy.posMatch.tab.strategyRelation')" name="strategyTab">
          <strategyRelationInfo ref="relationInfo"></strategyRelationInfo>
        </el-tab-pane>
        <el-tab-pane v-if="formData.matchNature === '0'" :label="$t('strategy.posMatch.tab.planRelation')" name="planTab">
          <planRelationInfo ref="relationInfo"></planRelationInfo>
        </el-tab-pane>
      </el-tabs>
    </main>

    <strategyDialog v-if="strategyVisible" :strategyNatures="[ '1', '2', '4', '6']" :strgLevels="[ '3','4']" :itemClassF=" '2'" @close="dialogClose" @confirm="dialogConfirm"></strategyDialog>
  </div>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import strategyDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDialog'
import strategyInfo from '@/views/frame/rm/strategy/futuresMatch/components/strategy/strategyInfo'
import futureTradeInfo from '@/views/frame/rm/strategy/strgPosMatch/components/futureTradeInfo'
import strategyRelationInfo from '@/views/frame/rm/strategy/strgPosMatch/components/strategyRelationInfo'
import planRelationInfo from '@/views/frame/rm/strategy/strgPosMatch/components/planRelationInfo'

export default {
  components: {
    strategyDialog,
    strategyInfo,
    futureTradeInfo,
    strategyRelationInfo,
    planRelationInfo
  },
  data() {
    return {
      disabledFlag: false,
      mainInfoVisible: true,
      type: this.$route.params.type,
      activeName: 'strategyInfo',
      bottomName: 'tradeInfo',
      tabModule: this.$route.params.matchNature === '1' ? 'strategyTab' : 'planTab',
      strategyVisible: false,
      formData: {
        instructionCode: '',
        matchCode: '',
        makeUser: '',
        makeDate: '',
        matchNature: this.$route.params.matchNature || '',
        detailList: []
      },
      rules: {
        matchCode: [
          {
            required: false,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getDisabled()
    this.getRequired()
    if (this.type !== 'add') {
      this.getData()
    }
  },
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
        this.rules.matchCode = [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    },
    getData() {
      request({
        url: '/api/strategy/posMatch/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        if (this.formData.matchNature === '1') {
          this.tabModule = 'strategyTab'
        } else {
          this.tabModule = 'planTab'
        }
        setTimeout(() => {
          response.data.detailList[0].unitCode = '1'
          this.$refs.strategyInfo.$refs.strategyInfo1.tableData = response.data.detailList
          this.$refs.tradeInfo.tableData = response.data.detailList[0].detailList
          this.$refs.relationInfo.tableData = response.data.detailList[0].relationList
        }, 500)
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'strgPosMatch'
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
              name: 'strgPosMatch'
            })
          })
        })
        .catch(() => { })
    },
    checkSave() {
      const strategyInfo = this.$refs.strategyInfo.$refs.strategyInfo1.tableData
      if (strategyInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.nostrategyInfo')
          })
        )
        return false
      }
      const tradeInfo = this.$refs.tradeInfo.tableData
      if (tradeInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.noTradeInfo')
          })
        )
        return false
      }
      var tradeLots = 0
      var insLots = 0
      const virtualTrade = []
      for (let i = 0; i < tradeInfo.length; i++) {
        if (tradeInfo[i].tradeId + ',1' === tradeInfo[i].tradeGroup) {
          virtualTrade.push(tradeInfo[i].tradeId)
        }

        if (!tradeInfo[i].derivativeAccount && !tradeInfo[i].derivativeSubAccount) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.posMatch.msg.accountIsEmpty')
            })
          )
          return false
        }

        if (tradeInfo[i].matchLots === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.posMatch.msg.matchLotsZero')
            })
          )
          return false
        }

        if (tradeInfo[i].tradeGroup === tradeInfo[i].tradeId) {
          tradeLots += parseInt(tradeInfo[i].matchLots)
        }
      }

      for (let i = 0; i < tradeInfo.length; i++) {
        if (!virtualTrade.includes(tradeInfo[i].tradeId)) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.posMatch.msg.noVirtualTrade')
            })
          )
          return false
        }
      }

      for (let i = 0; i < strategyInfo.length; i++) {
        if (strategyInfo[i].matchLots === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.posMatch.msg.matchLotsZero')
            })
          )
          return false
        }
        insLots += parseInt(strategyInfo[i].matchLots)
      }
      if (insLots !== tradeLots) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.matchLotsNotEqual')
          })
        )
        return false
      }

      const relationInfo = this.$refs.relationInfo.tableData
      if (relationInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.relationInfoEmpty')
          })
        )
        return false
      }
      return true
    },
    save() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          if (!this.checkSave()) {
            return
          }
          this.formData.detailList = []
          const strategyInfo = this.$refs.strategyInfo.$refs.strategyInfo1.tableData
          const relationInfo = this.$refs.relationInfo.tableData
          const tradeInfo = this.$refs.tradeInfo.tableData
          this.formData.detailList = strategyInfo
          this.$set(this.formData, 'baseBillType', this.$route.meta.bizCode)
          this.$set(this.formData, 'baseModuleCode', this.$route.meta.bpmModule)
          this.formData.detailList[0].detailList = tradeInfo
          this.formData.detailList[0].relationList = relationInfo
          this.$confirm(this.$t('biz.msg.confirmSaveAndSubmit'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              var url = ''
              if (this.type === 'add') {
                url = 'save'
              } else if (this.type === 'update') {
                url = 'update'
              }
              request({
                url: '/api/strategy/posMatch/' + url,
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

                if (this.type === 'update') {
                  // 关闭编辑页返回主页面的回调...
                  this.$store.dispatch('delVisitedViews', this.$route).then(() => {
                    this.$router.push({
                      name: 'strgPosMatch',
                      query: {
                        refresh: true
                      }
                    })
                  })
                } else {
                  // 清空页面
                  this.formData = {}
                  this.$refs.strategyInfo.$refs.strategyInfo1.tableData = []
                  this.$refs.tradeInfo.tableData = []
                  this.$refs.relationInfo.tableData = []
                  this.formData.matchNature = this.$route.params.matchNature
                }
              })
            })
            .catch(() => { })
        } else {
          return false
        }
      })
    },
    planDialogOpen() {
      this.strategyVisible = true
    },
    dialogClose() {
      this.strategyVisible = false
    },
    dialogConfirm(val) {
      this.formData.instructionName = val.strategyName
      this.formData.instructionCode = val.strategyCode

      this.formData.strategyNature = val.strategyNature

      if (this.$refs.strategyInfo.$refs.strategyInfo1) {
        this.$refs.strategyInfo.$refs.strategyInfo1.tableData = []
      }

      this.$refs.tradeInfo.tableData = []

      this.strategyVisible = false
    },
    dataChange() {
      this.$refs.tradeInfo.tableData = []
    },
    changeMatch(value) {
      this.$set(this.$refs.strategyInfo.$refs.strategyInfo1.tableData[0], 'matchLots', value)
    }
  }
}
</script>

<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="close" v-if="type==='view'">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="cancel" v-if="['add', 'update', 'assist', 'audit'].includes(type)">
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="save" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-if="[ 'add', 'update'].includes(type) && tradeNature==='1'" v-db-click size="mini" style='margin-right:6px;' @click="dialogOpen">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.selectStrategy')}}
      </el-button>
      <el-button v-if="[ 'add', 'update'].includes(type) && tradeNature==='2'" v-db-click size="mini" style='margin-right:6px;' @click="dialogOpen">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.selectPlan')}}
      </el-button>
      <el-button v-if="[ 'add', 'update'].includes(type) && tradeNature==='3'" v-db-click size="mini" style='margin-right:6px;' @click="dialogOpen">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.selectInstruction')}}
      </el-button>
    </el-row>
    <!-- 内容 -->
    <header :style="{ 'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.mainInfo')}}
        <i :class="[ 'el-icon-arrow-down', { 'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="refForm">
        <el-row :gutter="20">
          <el-col :span="6" v-if="tradeNature==='1'">
            <el-form-item :label="$t( 'strategy.futureMatch.form.strategyName')" prop='instructionName'>
              <el-input v-model="formData.instructionName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="tradeNature==='2'">
            <el-form-item :label="$t( 'strategy.futureMatch.form.planName')" prop='instructionName'>
              <el-input v-model="formData.instructionName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="tradeNature==='3'">
            <el-form-item :label="$t( 'strategy.futureMatch.form.instructionName')" prop='instructionName'>
              <el-input v-model="formData.instructionName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t( 'strategy.futureMatch.form.matchCode')" prop='matchCode'>
              <input-validate v-model="formData.matchCode" :disabled='disabledFlag'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t( 'strategy.futureMatch.form.makeUser')" prop='makeUser'>
              <base-select v-model="formData.makeUser" :attrs="{data: 'TREE_STAFF', disabled: true,clearable: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t( 'strategy.futureMatch.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='true' />
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t( 'strategy.futureMatch.form.matchType')" prop='matchType'>
              <el-select v-model="formData.matchType" :placeholder="$t( 'biz.placeholder.choose')" :disabled='true'>
                <el-option v-for="item in $t( 'datadict.matchType')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane v-if="tradeNature==='1'" :label="$t( 'strategy.spotTrade.tab.strategyDetail')" name="strategyDetail">
          <strategyInfo ref="strategyInfo" :itemClass="['2','3']" :strategyCode="formData.instructionCode" :strategyNature="formData.strategyNature" :optType='type' :tradeBatchDto='formData.tradeBatchDto' @itemClassChange='itemClassChange'></strategyInfo>
        </el-tab-pane>
        <el-tab-pane v-if="tradeNature==='2'" :label="$t( 'strategy.spotTrade.tab.planDetail')" name="planDetail">
          <planInfo ref="planInfo" :itemClass="['2','3']" :planCode="formData.instructionCode" :strategyNature="formData.strategyNature" :tradeNature="tradeNature" :optType='type' :tradeBatchDto='formData.tradeBatchDto' @itemClassChange='itemClassChange'></planInfo>
        </el-tab-pane>
        <el-tab-pane v-if="tradeNature==='3'" :label="$t( 'strategy.spotTrade.tab.instructionDetail')" name="instructionDetail">
          <instructionTable ref="instructionInfo" :itemClass="['2','3']" :instructionCode="formData.instructionCode" :tradeNature="tradeNature" :optType='type' :tradeBatchDto='formData.tradeBatchDto' @itemClassChange='itemClassChange'></instructionTable>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="bottomName" type="border-card">
        <el-tab-pane :label="$t( 'strategy.futureMatch.tab.futureTrade')" name="futureTradeInfo">
          <futureTradeInfo v-if="itemClass === '2'" ref="futureTradeInfo" :tradeNature="tradeNature" :tradeList="formData.tradeDetailDtoList" :optType='type' @changeTrade="changeTrade"></futureTradeInfo>
          <futureExternalInfo v-if="itemClass === '3'" ref="futureTradeInfo" :tradeNature="tradeNature" :tradeList="formData.tradeDetailDtoList" :optType='type'></futureExternalInfo>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="openTradeRelation" type="border-card">
        <el-tab-pane :label="$t( 'strategy.futureMatch.tab.openTradeRelation')" name="openTradeRelation">
          <openTradeInfo ref="openTradeRelation" :openTradeVisible="openTradeVisible" :contractCode="selectedTrade.futuresContractCode" :direction="selectedTrade.direction" :relationList="selectedTrade.relationList" :optType='type' @syncData="syncTradeData"></openTradeInfo>
        </el-tab-pane>
      </el-tabs>
    </main>

    <strategyDialog v-if="dialogVisible && tradeNature==='1'" :strategyNatures="[ '1', '2', '4', '6']" :strgLevels="[ '4']" :itemClassF=" '2'" @close="dialogClose" @confirm="dialogConfirm"></strategyDialog>
    <planDialog v-if="dialogVisible && tradeNature==='2'" :strategyNatures="[ '1', '2', '4', '6']" :strgLevels="[ '3']" @close="dialogClose" @confirm="dialogConfirm"></planDialog>
    <instructionDialog v-if="dialogVisible && tradeNature==='3'" @close="dialogClose" @confirm="dialogConfirm" :strgLevels="[ '1', '2']"></instructionDialog>
  </div>
</template>

<script>
import strategyInfo from '@/views/frame/rm/strategy/futuresMatch/components/strategy/strategyInfo'
import planInfo from '@/views/frame/rm/strategy/futuresMatch/components/plan/planInfo'
import futureTradeInfo from '@/views/frame/rm/strategy/futuresMatch/components/futureTrade/futureTradeInfo'
import futureExternalInfo from '@/views/frame/rm/strategy/futuresMatch/components/futuresExternal/futureTradeInfo'
import instructionTable from '@/views/frame/rm/strategy/futuresMatch/components/instruction/instructionTable'
import planDialog from '@/views/frame/rm/strategy/futuresMatch/components/plan/planDialog'
import strategyDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDialog'
import instructionDialog from '@/views/frame/rm/strategy/instruction/component/instructionDialog'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import { dateFormate } from '@/utils/frame/base/index'
import openTradeInfo from '@/views/frame/rm/strategy/futuresMatch/components/futureTrade/openTradeInfo'

export default {
  components: {
    strategyInfo,
    planDialog,
    strategyDialog,
    planInfo,
    futureTradeInfo,
    instructionDialog,
    instructionTable,
    futureExternalInfo,
    openTradeInfo
  },
  data() {
    return {
      disabledFlag: false,
      openTradeVisible: false,
      openTradeRelation: 'openTradeRelation',
      mainInfoVisible: true,
      type: this.$route.params.type,
      tradeNature: this.$route.params.tradeNature,
      activeName: this.$route.params.tradeNature === '1' ? 'strategyDetail' : this.$route.params.tradeNature === '2' ? 'planDetail' : 'instructionDetail',
      bottomName: 'futureTradeInfo',
      dialogVisible: false,
      itemClass: '2',
      selectedTrade: {},
      formData: {
        matchType: '1',
        tradeDetailDtoList: [],
        tradeBatchDto: {},
        makeUser: '',
        makeDate: ''
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
    if (this.type === 'add') {
      this.formData.makeUser = this.$store.getters.userEmployeeCode
      this.formData.makeDate = dateFormate(new Date(), 'YYYYMMDD')
    }
    if (this.type !== 'add') {
      this.getData()
    }
  },
  methods: {
    syncTradeData(data) {
      this.selectedTrade.relationList = data
    },
    changeTrade(row) {
      this.selectedTrade = row
      if (row.offsetFlag === '1') {
        this.openTradeVisible = true
      } else {
        this.openTradeVisible = false
      }
    },
    itemClassChange(val) {
      this.itemClass = val
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
        url: '/api/strategy/match/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        this.itemClass = this.formData.tradeBatchDto.itemClass
        if (this.formData.strgLevel === '4') {
          this.formData.tradeBatchDto.quantity = this.formData.tradeBatchDto.reservedNum1
          this.formData.tradeBatchDto.maxPostion = this.formData.tradeBatchDto.reservedNum2
          this.formData.tradeBatchDto.unitCode = '1'
        }
        if (this.formData.strgLevel === '3') {
          this.formData.tradeBatchDto.minPrice = this.formData.tradeBatchDto.price
          this.formData.tradeBatchDto.maxPrice = this.formData.tradeBatchDto.priceDiff
          this.formData.tradeBatchDto.quantity = this.formData.tradeBatchDto.reservedNum2
          this.formData.tradeBatchDto.floatRatio = this.formData.tradeBatchDto.reservedNum3
          this.formData.tradeBatchDto.minQuantity = this.formData.tradeBatchDto.reservedNum4
          this.formData.tradeBatchDto.maxQuantity = this.formData.tradeBatchDto.reservedNum1
        }
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'futureMatch'
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
              name: 'futureMatch'
            })
          })
        })
        .catch(() => { })
    },
    save() {
      this.$refs['refForm'].validate(valid => {
        if (valid) {
          this.formData.tradeNature = this.tradeNature
          if (this.tradeNature === '1') {
            this.formData.tradeBatchDto = this.$refs.strategyInfo.$refs.strategyInfo1.tableData[0]
          }
          if (this.tradeNature === '2') {
            this.formData.tradeBatchDto = this.$refs.planInfo.$refs.strategyInfo1.tableData[0]
          }
          if (this.tradeNature === '3') {
            this.formData.tradeBatchDto = this.$refs.instructionInfo.tableData[0]
          }
          this.formData.tradeDetailDtoList = this.$refs.futureTradeInfo.tableData
          var sum = 0
          for (var i = 0; i < this.formData.tradeDetailDtoList.length; i++) {
            var data = this.formData.tradeDetailDtoList[i]
            if (data.matchLots > data.canMatchLots) {
              this.$notify(
                notifyInfo({
                  msg: '明细列表的可匹配数量需大于等于匹配数量'
                })
              )
              return
            }
            if (this.formData.tradeBatchDto.direction === data.direction) {
              sum = sum + parseInt(data.matchLots)
            }

            let lots = 0
            if (data.relationList && data.relationList.length > 0) {
              for (let j = 0; j < data.relationList.length; j++) {
                lots = parseInt(lots) + parseInt(data.relationList[j].matchLots)
              }
            }
            if (data.matchLots < lots) {
              this.$notify(
                notifyInfo({
                  msg: '开仓匹配数量不能大于成交匹配数量'
                })
              )
              return
            }
          }
          this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              if (this.type === 'add') {
                request({
                  url: '/api/strategy/match/save',
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
                  this.formData = {
                    matchType: '1',
                    tradeDetailDtoList: [],
                    tradeBatchDto: {},
                    makeUser: '',
                    makeDate: ''
                  }
                  if (this.tradeNature === '1') {
                    this.$refs.strategyInfo.$refs.strategyInfo1.tableData = []
                  }
                  if (this.tradeNature === '2') {
                    this.$refs.planInfo.$refs.strategyInfo1.tableData = []
                  }
                  if (this.tradeNature === '3') {
                    this.$refs.instructionInfo.tableData = []
                  }
                  this.$refs.futureTradeInfo.tableData = []
                  this.$refs.openTradeRelation.tableData = []
                  this.formData.matchType = '1'
                  this.formData.makeUser = this.$store.getters.userEmployeeCode
                  this.formData.makeDate = dateFormate(new Date(), 'YYYYMMDD')
                })
              }
              if (this.type === 'update') {
                request({
                  url: '/api/strategy/match/update',
                  method: 'POST',
                  data: {
                    funcModule: this.$t('route.' + this.$route.meta.title),
                    funcOperation: this.$t('biz.btn.update'),
                    data: this.formData
                  }
                }).then(response => {
                  this.$notify(
                    notifySuccess({
                      msg: this.$t('biz.msg.updateSuccess')
                    })
                  )
                  this.close()
                })
              }
            })
            .catch(() => { })
        } else {
          return false
        }
      })
    },
    dialogOpen() {
      this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
    },
    dialogConfirm(val) {
      if (this.tradeNature === '1') {
        this.formData.instructionName = val.strategyName
        this.formData.instructionCode = val.strategyCode
      } else if (this.tradeNature === '2') {
        this.formData.instructionName = val.planName
        this.formData.instructionCode = val.planCode
      } else if (this.tradeNature === '3') {
        this.formData.instructionName = val.instructionName
        this.formData.instructionCode = val.instructionCode
      }
      this.formData.strategyNature = val.strategyNature
      this.dialogVisible = false
      if (this.tradeNature === '1') {
        this.$refs.strategyInfo.$refs.strategyInfo1.tableData = []
        this.formData.tradeBatchDto = {}
      }
      if (this.tradeNature === '2') {
        this.$refs.planInfo.$refs.strategyInfo1.tableData = []
        this.formData.tradeBatchDto = {}
      }
      if (this.tradeNature === '3') {
        this.$refs.instructionInfo.tableData = []
        this.formData.tradeBatchDto = {}
      }
      this.$refs.futureTradeInfo.tableData = []
      this.$refs.openTradeRelation.tableData = []
      // this.formData.makeUser = this.$store.getters.userEmployeeCode
      // this.formData.makeDate = dateFormate(new Date(), 'YYYYMMDD')
    }
  }
}
</script>

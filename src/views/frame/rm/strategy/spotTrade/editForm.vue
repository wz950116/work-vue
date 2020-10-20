<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="close" v-if="type==='view'">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="cancel" v-if="['add', 'update', 'assist', 'audit'].includes(type)">
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="save" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click style='margin-right:6px;' size="mini" @click="planDialogOpen" :v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.chooseParent')}}
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
            <el-form-item :label="$t('strategy.spotTrade.form.planName')" prop='planName'>
              <el-input v-model="formData.planName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.spotTrade.form.matchCode')" prop='matchCode'>
              <input-validate v-model="formData.matchCode" :disabled='disabledFlag'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.spotTrade.form.makeUser')" prop='makeUser'>
              <base-select v-model="formData.makeUser" :attrs="{data: 'TREE_STAFF', disabled: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.spotTrade.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='true' />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane v-if="tradeNature === '1'" :label="$t('strategy.spotTrade.tab.strategyDetail')" name="strategyDetail">
          <strategyInfo ref="strategyInfo" :planCode="formData.planCode" :strategyNature="formData.strategyNature" :tradeNature="tradeNature" :detailList="formData.batchList"></strategyInfo>
        </el-tab-pane>
        <el-tab-pane v-if="tradeNature === '2'" :label="$t('strategy.spotTrade.tab.planDetail')" name="planDetail">
          <planInfo ref="planInfo" :planCode="formData.planCode" :strategyNature="formData.strategyNature" :tradeNature="tradeNature" :detailList="formData.batchList"></planInfo>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="bottomName" type="border-card">
        <el-tab-pane :label="$t('strategy.spotTrade.tab.spotExposure')" name="spotExposure">
          <exposureInfo ref="exposureInfo" :tradeNature="tradeNature" :hedgingMode="formData.hedgingMode" @quantityChange="quantityChange"></exposureInfo>
        </el-tab-pane>
      </el-tabs>
    </main>

    <strategyDialog v-if="planVisible && tradeNature === '1'" :strategyNatures="['1','3','5','6']" :strgLevels="['2','4']" @close="dialogClose" @confirm="dialogConfirm"></strategyDialog>
    <planDialog v-if="planVisible && tradeNature === '2'" :strategyNatures="['1','3','5','6']" :strgLevels="['1','3']" @close="dialogClose" @confirm="dialogConfirm"></planDialog>
  </div>
</template>

<script>
import strategyInfo from '@/views/frame/rm/strategy/spotTrade/components/strategyInfo'
import planInfo from '@/views/frame/rm/strategy/spotTrade/components/planInfo'
import exposureInfo from '@/views/frame/rm/strategy/spotTrade/components/exposureInfo'
import planDialog from '@/views/frame/rm/strategy/plan/component/planDialog'
import strategyDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDialog'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import NP from 'number-precision'

export default {
  components: {
    strategyInfo,
    planDialog,
    strategyDialog,
    planInfo,
    exposureInfo
  },
  data() {
    return {
      disabledFlag: false,
      mainInfoVisible: true,
      type: this.$route.params.type,
      tradeNature: this.$route.params.tradeNature,
      activeName: this.$route.params.tradeNature === '1' ? 'strategyDetail' : 'planDetail',
      bottomName: 'spotExposure',
      planVisible: false,
      formData: {
        planName: '',
        matchCode: '',
        planCode: '',
        makeUser: '',
        makeDate: '',
        batchList: []
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
        url: '/api/strategy/strgSpotTradeMatch/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        if (this.tradeNature === '1') {
          this.$refs.strategyInfo.tableData = response.data.batchList
        } else {
          this.$refs.planInfo.tableData = response.data.batchList
        }

        this.$refs.exposureInfo.tableData = response.data.batchList[0].tradeDetailList
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'spotTrade'
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
              name: 'spotTrade'
            })
          })
        })
        .catch(() => {})
    },
    checkSave() {
      if (this.tradeNature === '1') {
        this.formData.batchList = this.$refs.strategyInfo.tableData
      } else {
        this.formData.batchList = this.$refs.planInfo.tableData
      }
      if (this.formData.batchList.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotTrade.msg.noDetailInfo')
          })
        )
        return false
      }
      this.formData.batchList[0].tradeDetailList = this.$refs.exposureInfo.tableData
      if (this.formData.batchList[0].tradeDetailList.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotTrade.msg.noExposureInfo')
          })
        )
        return false
      }
      if (this.formData.batchList[0].matchQuantity === undefined) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotTrade.msg.quantityNotEmpty')
          })
        )
        return false
      }
      var batchQuantity = this.formData.batchList[0].matchQuantity
      var matchQuantity = 0
      for (var i = 0; i < this.formData.batchList[0].tradeDetailList.length; i++) {
        if (this.formData.batchList[0].tradeDetailList[i].matchQuantity === undefined) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.spotTrade.msg.quantityNotEmpty')
            })
          )
          return false
        }
        matchQuantity = NP.plus(matchQuantity, this.formData.batchList[0].tradeDetailList[i].matchQuantity)
      }
      if (matchQuantity - batchQuantity > 0.00000001 || matchQuantity - batchQuantity < -0.00000001) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotTrade.msg.matchNotEqual')
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
              this.formData.tradeNature = this.tradeNature
              request({
                url: '/api/strategy/strgSpotTradeMatch/' + url,
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
                      name: 'spotTrade',
                      query: {
                        refresh: true
                      }
                    })
                  })
                } else {
                  // 清空页面
                  this.formData = {}
                  if (this.tradeNature === '1') {
                    this.$refs.strategyInfo.tableData = []
                  } else {
                    this.$refs.planInfo.tableData = []
                  }
                  this.$refs.exposureInfo.tableData = []
                }
              })
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    planDialogOpen() {
      this.planVisible = true
    },
    dialogClose() {
      this.planVisible = false
    },
    dialogConfirm(val) {
      if (this.tradeNature === '1') {
        this.formData.planName = val.strategyName
        this.formData.planCode = val.strategyCode
      } else if (this.tradeNature === '2') {
        this.formData.planName = val.planName
        this.formData.planCode = val.planCode
      }
      this.formData.hedgingMode = val.hedgingMode
      this.formData.strategyNature = val.strategyNature

      if (this.tradeNature === '1') {
        this.$refs.strategyInfo.tableData = []
      } else {
        this.$refs.planInfo.tableData = []
      }

      this.$refs.exposureInfo.tableData = []

      this.planVisible = false
    },
    quantityChange(val) {
      if (this.tradeNature === '1') {
        this.$set(this.$refs.strategyInfo.tableData[0], 'matchQuantity', val)
      } else {
        this.$set(this.$refs.planInfo.tableData[0], 'matchQuantity', val)
      }
    }
  }
}
</script>

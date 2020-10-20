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
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.selectInstruction')}}
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
            <el-form-item :label="$t('strategy.optionMatch.form.instructionName')" prop='instructionName'>
              <el-input v-model="formData.instructionName" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionMatch.form.matchCode')" prop='matchCode'>
              <input-validate v-model="formData.matchCode" :disabled='getBillNoRequired()'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionMatch.form.makeUser')" prop='makeUser'>
              <base-select v-model="formData.makeUser" :attrs="{data: 'TREE_STAFF', disabled: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.optionMatch.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='true' />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.optionMatch.tab.instructionInfo')" name="instructionInfo">
          <instructionTable ref="instructionInfo" :instructionCode="formData.instructionCode" @dataChange="dataChange"></instructionTable>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="bottomName" type="border-card">
        <el-tab-pane :label="$t('strategy.optionMatch.tab.tradeInfo')" name="tradeInfo">
          <optionTradeInfo ref="tradeInfo" @changeMatch="changeMatch"></optionTradeInfo>
        </el-tab-pane>
      </el-tabs>
    </main>

    <instructionDialog v-if="strategyVisible" :instructionCode="formData.instructionCode" @close="dialogClose" @confirm="dialogConfirm"></instructionDialog>
  </div>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import instructionDialog from '@/views/frame/rm/strategy/optionMatch/components/instructionDialog'
import instructionTable from '@/views/frame/rm/strategy/optionMatch/components/instructionTable'
import optionTradeInfo from '@/views/frame/rm/strategy/optionMatch/components/optionTradeInfo'

export default {
  components: {
    instructionDialog,
    instructionTable,
    optionTradeInfo
  },
  data() {
    return {
      disabledFlag: false,
      mainInfoVisible: true,
      type: this.$route.params.type,
      activeName: 'instructionInfo',
      bottomName: 'tradeInfo',
      strategyVisible: false,
      formData: {
        instructionCode: '',
        matchCode: '',
        makeUser: '',
        makeDate: '',
        detailList: []
      },
      rules: {
        matchCode: [
          {
            required: !this.getBillNoRequired(),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.type !== 'add') {
      this.getData()
    }
  },
  methods: {
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
    getData() {
      request({
        url: '/api/strategy/strgOptMatch/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        this.$refs.instructionInfo.tableData = response.data.batchList
        this.$refs.tradeInfo.tableData = response.data.tradeDetailList
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'optionMatch'
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
              name: 'optionMatch'
            })
          })
        })
        .catch(() => {})
    },
    checkSave() {
      const instructionInfo = this.$refs.instructionInfo.tableData
      if (instructionInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.optionMatch.msg.noInstructionInfo')
          })
        )
        return false
      }
      if (instructionInfo[0].matchLots > instructionInfo[0].canMatchLots) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.optionMatch.msg.matchLotsMore')
          })
        )
        return false
      }
      const tradeInfo = this.$refs.tradeInfo.tableData
      if (tradeInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.optionMatch.msg.noTradeInfo')
          })
        )
        return false
      }
      var tradeLots = 0
      var insLots = 0
      for (let i = 0; i < tradeInfo.length; i++) {
        if (tradeInfo[i].matchLots === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.optionMatch.msg.matchLotsZero')
            })
          )
          return false
        }

        tradeLots += parseInt(tradeInfo[i].matchLots)
      }

      for (let i = 0; i < instructionInfo.length; i++) {
        if (instructionInfo[i].matchLots === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.optionMatch.msg.matchLotsZero')
            })
          )
          return false
        }
        insLots += parseInt(instructionInfo[i].matchLots)
      }
      if (insLots !== tradeLots) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.optionMatch.msg.matchLotsNotEqual')
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
          const instructionInfo = this.$refs.instructionInfo.tableData
          const tradeInfo = this.$refs.tradeInfo.tableData
          this.formData.batchList = instructionInfo
          this.formData.tradeDetailList = tradeInfo
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
                url: '/api/strategy/strgOptMatch/' + url,
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
                      name: 'optionMatch',
                      query: {
                        refresh: true
                      }
                    })
                  })
                } else {
                  // 清空页面
                  this.formData = {}
                  this.$refs.instructionInfo.tableData = []
                  this.$refs.tradeInfo.tableData = []
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
      this.strategyVisible = true
    },
    dialogClose() {
      this.strategyVisible = false
    },
    dialogConfirm(val) {
      this.formData.instructionName = val.instructionName
      this.formData.instructionCode = val.instructionCode

      this.$refs.instructionInfo.tableData = []
      this.$refs.tradeInfo.tableData = []

      this.strategyVisible = false
    },
    dataChange() {
      this.$refs.tradeInfo.tableData = []
    },
    changeMatch(value) {
      this.$set(this.$refs.instructionInfo.tableData[0], 'matchLots', value)
    }
  }
}
</script>

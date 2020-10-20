<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" @click="close" v-if="type==='view'" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" @click="cancel" v-if="['add', 'update'].includes(type)" style='margin-right:6px;'>
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" @click="save" v-if="['add', 'update'].includes(type)" style='margin-right:6px;' type="primary">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
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
            <el-form-item :label="$t('strategy.indealMatch.form.matchCode')" prop='matchCode'>
              <input-validate v-model="formData.matchCode" :disabled='disabledFlag'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.indealMatch.form.makeUser')" prop='makeUser'>
              <base-select v-model="formData.makeUser" :attrs="{data: 'FUNC_EMPLOYEE', disabled: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.indealMatch.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='true' />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.indealMatch.tab.tradeDetail')" name="tradeDetail">
          <tradeInfo ref="tradeInfo" :height="tableHeight" @virtualTrade="virtualTrade" @deleteRow="deleteRow"></tradeInfo>
        </el-tab-pane>
      </el-tabs>
    </main>

    <main>
      <el-tabs v-model="activeBottom" type="border-card">
        <el-tab-pane :label="$t('strategy.indealMatch.tab.virtualTrade')" name="virtualTrade">
          <virtualTradeInfo ref="virtualTradeInfo" :height="tableHeight"></virtualTradeInfo>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import tradeInfo from '@/views/frame/rm/strategy/indealMatch/components/tradeInfo'
import virtualTradeInfo from '@/views/frame/rm/strategy/indealMatch/components/virtualTradeInfo'
import { mapGetters } from 'vuex'

export default {
  components: {
    tradeInfo,
    virtualTradeInfo
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1355 ? this.clientHeight - 290 : this.clientHeight - 310 // 防止底部滚动条遮挡
    }
  },
  data() {
    return {
      disabledFlag: false,
      mainInfoVisible: true,
      type: this.$route.params.type,
      activeName: 'tradeDetail',
      activeBottom: 'virtualTrade',
      formData: {
        matchCode: '',
        makeUser: '',
        makeDate: '',
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
    deleteRow(group) {
      this.$refs.virtualTradeInfo.deleteRow(group)
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
        url: '/api/strategy/indealMatch/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        for (let i = 0; i < response.data.detailList.length; i++) {
          response.data.detailList[i].group = response.data.detailList[i].id
        }
        this.$refs.tradeInfo.tableData = response.data.detailList
        this.$refs.virtualTradeInfo.tableData = response.data.detailList
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'indealMatch'
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
              name: 'indealMatch'
            })
          })
        })
        .catch(() => {})
    },
    checkSave() {
      if (this.formData.detailList.length !== 2) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.indealMatch.msg.detailCount2')
          })
        )
        return false
      }
      // 验证数据不能为空
      for (let i = 0; i < this.formData.detailList.length; i++) {
        const data = this.formData.detailList[i]
        if (!data.volume || data.volume === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.indealMatch.msg.matchLosZero')
            })
          )
          return false
        }

        if (!data.price) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.indealMatch.msg.priceEmpty')
            })
          )
          return false
        }

        if (!data.derivativeAccount && !data.derivativeSubAccount) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.indealMatch.msg.accountEmpty')
            })
          )
          return false
        }
      }

      var data1 = this.formData.detailList[0]
      var data2 = this.formData.detailList[1]
      if (data1.matchLots !== data2.matchLots) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.indealMatch.msg.matchLotsNotEqual')
          })
        )
        return false
      }

      if (data1.price !== data2.price) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.indealMatch.msg.priceNotEqual')
          })
        )
        return false
      }

      if (data1.contractCode !== data2.contractCode) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.indealMatch.msg.contractNotEqual')
          })
        )
        return false
      }

      if (data1.direction === data2.direction) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.indealMatch.msg.directionEqual')
          })
        )
        return false
      }

      if (data1.derivativeAccount !== data2.derivativeAccount) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.indealMatch.msg.derivativeAccount')
          })
        )
        return false
      }

      if (data1.derivativeSubAccount !== data2.derivativeSubAccount) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.indealMatch.msg.derivativeSubAccount')
          })
        )
        return false
      }

      return true
    },
    save() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          this.formData.detailList = this.$refs.virtualTradeInfo.tableData
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
                url: '/api/strategy/indealMatch/' + url,
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
                    name: 'indealMatch',
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
    virtualTrade(data) {
      this.$refs.virtualTradeInfo.virtualTrade(data)
    }
  }
}
</script>

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
      <el-button v-db-click style='margin-right:6px;' size="mini" @click="planDialogOpen">
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
          <el-col :span="6">
            <el-form-item :label="$t('strategy.futuresSpotMatch.form.strategyName')" prop='strategyName'>
              <el-input v-model="formData.strategyName" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.futuresSpotMatch.form.matchCode')" prop='matchCode'>
              <input-validate v-model="formData.matchCode" :disabled='disabledFlag'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.futuresSpotMatch.form.makeUser')" prop='makeUser'>
              <base-select v-model="formData.makeUser" :attrs="{data: 'TREE_STAFF', disabled: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.futuresSpotMatch.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='true' />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.futuresSpotMatch.tab.spotInfo')" name="spotInfo">
          <exposureTable ref="spotInfo" :strategyCode="formData.strategyCode"></exposureTable>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="bottomName" type="border-card">
        <el-tab-pane :label="$t('strategy.futuresSpotMatch.tab.futuresInfo')" name="futuresInfo">
          <futureTradeInfo ref="futuresInfo" :strategyCode="formData.strategyCode"></futureTradeInfo>
        </el-tab-pane>
      </el-tabs>
    </main>

    <strategyDialog v-if="strategyVisible" :strategyNatures="['1','6']" @close="dialogClose" @confirm="dialogConfirm"></strategyDialog>
  </div>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import strategyDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDialog'
import exposureTable from '@/views/frame/rm/strategy/futuresSpotMatch/components/exposureTable'
import futureTradeInfo from '@/views/frame/rm/strategy/futuresSpotMatch/components/futureTradeInfo'

export default {
  components: {
    strategyDialog,
    exposureTable,
    futureTradeInfo
  },
  data() {
    return {
      disabledFlag: false,
      mainInfoVisible: true,
      type: this.$route.params.type,
      activeName: 'spotInfo',
      bottomName: 'futuresInfo',
      strategyVisible: false,
      formData: {
        instructionCode: '',
        matchCode: '',
        makeUser: '',
        makeDate: '',
        detailList: []
      },
      rules: {
        instructionCode: [
          {
            required: true,
            trigger: 'blur'
          }
        ],

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
    // 校验规则提示添加
    $('.edit-page-style .el-col .is-required .el-form-item__content').attr('data-content', this.$t('biz.placeholder.require'))

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
        url: '/api/strategy/strgCompMatch/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        this.$refs.spotInfo.tableData = response.data.detailList
        this.$refs.futuresInfo.tableData = response.data.detailList[0].detailList
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'futuresSpotMatch'
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
              name: 'futuresSpotMatch'
            })
          })
        })
        .catch(() => {})
    },
    checkSave() {
      const spotInfo = this.$refs.spotInfo.tableData
      if (spotInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.futuresSpotMatch.msg.spotInfoEmpty')
          })
        )
        return false
      }
      const futuresInfo = this.$refs.futuresInfo.tableData
      if (futuresInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.futuresSpotMatch.msg.futuresInfoEmtpy')
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
          this.formData.detailList = this.$refs.spotInfo.tableData
          this.formData.detailList[0].detailList = this.$refs.futuresInfo.tableData
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
                url: '/api/strategy/strgCompMatch/' + url,
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
                      name: 'futuresSpotMatch',
                      query: {
                        refresh: true
                      }
                    })
                  })
                } else {
                  // 清空页面
                  this.formData = {}
                  this.$refs.spotInfo.tableData = []
                  this.$refs.futuresInfo.tableData = []
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
      this.formData.strategyName = val.strategyName
      this.formData.strategyCode = val.strategyCode

      this.$refs.spotInfo.tableData = []
      this.$refs.futuresInfo.tableData = []

      this.strategyVisible = false
    }
  }
}
</script>

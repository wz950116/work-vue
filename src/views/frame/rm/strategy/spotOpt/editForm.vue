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
            <el-form-item :label="$t('strategy.spotOpt.form.strategyName')" prop='strategyName'>
              <el-input v-model="formData.strategyName" :disabled='true'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.spotOpt.form.matchCode')" prop='matchCode'>
              <input-validate v-model="formData.matchCode" :disabled='disabledFlag'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.spotOpt.form.makeUser')" prop='makeUser'>
              <base-select v-model="formData.makeUser" :attrs="{data: 'TREE_STAFF', disabled: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.spotOpt.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='true' />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.spotOpt.tab.optimized')" name="optimized">
          <tradeInfo ref="optimizedInfo" :strategyCode="formData.strategyCode" :direction="'2'"></tradeInfo>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="bottomName" type="border-card">
        <el-tab-pane :label="$t('strategy.spotOpt.tab.target')" name="target">
          <tradeInfo ref="targetInfo" :strategyCode="formData.strategyCode" :direction="'1'"></tradeInfo>
        </el-tab-pane>
      </el-tabs>
    </main>

    <strategyDialog v-if="strategyVisible" :strategyNatures="['1','3','5','6']" :queryUrl="'listForSpotOpt'" @close="dialogClose" @confirm="dialogConfirm"></strategyDialog>
  </div>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import strategyDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDialog'
import tradeInfo from '@/views/frame/rm/strategy/spotOpt/components/tradeInfo'

export default {
  components: {
    strategyDialog,
    tradeInfo
  },
  data() {
    return {
      disabledFlag: false,
      mainInfoVisible: true,
      type: this.$route.params.type,
      tradeNature: this.$route.params.tradeNature,
      activeName: 'optimized',
      bottomName: 'target',
      strategyVisible: false,
      formData: {
        strategyName: '',
        matchCode: '',
        makeUser: '',
        makeDate: '',
        detailList: []
      },
      rules: {
        strategyName: [
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
        url: '/api/strategy/strgSpotOpt/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        for (var i = 0; i < this.formData.detailList.length; i++) {
          var data = this.formData.detailList[i]
          if (data.optType === '1') {
            this.$refs.optimizedInfo.tableData.push(data)
          } else {
            this.$refs.targetInfo.tableData.push(data)
          }
        }
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'spotOpt'
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
              name: 'spotOpt'
            })
          })
        })
        .catch(() => {})
    },
    checkSave() {
      const optimizedInfo = this.$refs.optimizedInfo.tableData
      if (optimizedInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotOpt.msg.noOptimizedInfo')
          })
        )
        return false
      }
      const targetInfo = this.$refs.targetInfo.tableData
      if (targetInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotOpt.msg.noTargetInfo')
          })
        )
        return false
      }

      for (let i = 0; i < optimizedInfo.length; i++) {
        if (optimizedInfo[i].optQuantity === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.spotOpt.msg.quantityNotZero')
            })
          )
          return false
        }
      }
      for (let i = 0; i < targetInfo.length; i++) {
        if (targetInfo[i].optQuantity === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.spotOpt.msg.quantityNotZero')
            })
          )
          return false
        }
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
          const optimizedInfo = this.$refs.optimizedInfo.tableData
          const targetInfo = this.$refs.targetInfo.tableData
          for (let i; i < optimizedInfo.length; i++) {
            optimizedInfo[i].optType = '1'
            this.formData.detailList.push(optimizedInfo[i])
          }
          for (let i = 0; i < targetInfo.length; i++) {
            targetInfo[i].optType = '2'
            this.formData.detailList.push(targetInfo[i])
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
              request({
                url: '/api/strategy/strgSpotOpt/' + url,
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
                      name: 'spotOpt',
                      query: {
                        refresh: true
                      }
                    })
                  })
                } else {
                  // 清空页面
                  this.formData = {}
                  this.$refs.optimizedInfo.tableData = []
                  this.$refs.targetInfo.tableData = []
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

      this.$refs.optimizedInfo.tableData = []
      this.$refs.targetInfo.tableData = []

      this.strategyVisible = false
    }
  }
}
</script>

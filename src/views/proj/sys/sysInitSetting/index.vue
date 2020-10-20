<template>
  <div class="app-container tree-form-table">
    <!-- 内容 -->
    <div class='left-content'>
      <div class="navigationClass" :style="{height: tableHeight + 'px'}">
        <ul class="">
          <li ref="selection1" class='selected'>1）现货敞口</li>
          <li ref="selection2">2）期货头寸</li>
          <li ref="selection3">3）现货资金</li>
          <li ref="selection4">4）现货费用</li>
          <li ref="selection5">5）期货费用</li>
          <li ref="selection6">6）开账</li>
        </ul>
      </div>
    </div>
    <main class='right-content'>
      <el-row class='top-operate'>
        <el-button size="mini" @click="back" :disabled="step<=1">
          上一步
        </el-button>
        <el-button size="mini" @click="next" :disabled="step>=6">
          下一步
        </el-button>
        <el-button v-db-click size="mini" @click="revert" v-if="revertFlag">
          反开账
        </el-button>
      </el-row>

      <positionTab v-if="step===1"></positionTab>
      <futuresTradeTab v-if="step===2"></futuresTradeTab>
      <spotFundTab v-if="step===3"></spotFundTab>
      <spotCostTab v-if="step===4"></spotCostTab>
      <futuresCostTab v-if="step >= 5"></futuresCostTab>
    </main>
  </div>
</template>

<script>
// vuex辅助函数
import { mapGetters } from 'vuex'
// axios访问
import request from '@/utils/frame/base/request'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import positionTab from '@/views/proj/spot/spotExopsure/components/positionTab'
import futuresTradeTab from '@/views/frame/rm/derivative/components/FuturesAccountTradeTab'
import spotFundTab from '@/views/proj/spot/fund/components/spotFundTab'
import spotCostTab from '@/views/proj/spot/cost/components/spotCostTab'
import futuresCostTab from '@/views/proj/spot/futuresCost/components/futuresCostTab'

export default {
  components: {
    positionTab,
    futuresTradeTab,
    spotFundTab,
    spotCostTab,
    futuresCostTab
  },
  data() {
    return {
      revertFlag: false,
      step: 1
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth < 1366 ? this.clientHeight - 118 : this.clientHeight - 101
    }
  },
  mounted() {
    this.checkFlag()
  },
  methods: {
    checkFlag() {
      request({
        url: '/api/sys/sysInitSetting/getFlag',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        if (response.data) {
          this.revertFlag = true
        }
      })
    },
    back() {
      if (this.step <= 1) {
        this.step = 1
        return
      }
      this.$refs['selection' + this.step--].className = ''
      this.$refs['selection' + this.step].className = 'selected'
    },
    next() {
      if (this.step >= 6) {
        this.step = 6
        return
      }
      this.$refs['selection' + this.step++].className = ''
      this.$refs['selection' + this.step].className = 'selected'
      if (this.step === 6) {
        this.open()
      }
    },
    open() {
      request({
        url: '/api/sys/sysInitSetting/getFlag',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        if (response.data) {
          this.$notify(
            notifyInfo({
              msg: this.$t('projSys.initSetting.disableOpening')
            })
          )
          return
        }
        this.$confirm(this.$t('projSys.initSetting.confirmOpening'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        }).then(() => {
          // 调用后台保存接口
          request({
            url: '/api/sys/sysInitSetting/updateSetting',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.update'),
              data: '1'
            }
          }).then(res => {
            this.$refs['selection' + this.step++].className = ''
            this.step = 1
            this.$refs['selection' + this.step].className = 'selected'
            this.revertFlag = true
            this.$notify(
              notifySuccess({
                msg: this.$t('projSys.initSetting.openingSuccess')
              })
            )
          })
        })
      })
    },
    revert() {
      this.$confirm(this.$t('projSys.initSetting.confirmRevert'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/sys/sysInitSetting/updateSetting',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save'),
            data: '0'
          }
        }).then(request => {
          this.$refs['selection' + this.step++].className = ''
          this.step = 1
          this.$refs['selection' + this.step].className = 'selected'
          this.revertFlag = false
          this.$notify(
            notifySuccess({
              msg: this.$t('projSys.initSetting.revertSuccess')
            })
          )
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.tree-form-table {
  display: flex;
  .left-content {
    width: 200px;
    min-width: 200px;
    border: 1px solid #aaaaaa;
    border-radius: 5px 5px 0 0;
    margin-right: 3px;
    background: #ffffff;
    .title {
      height: 30px;
      line-height: 30px;
      text-indent: 10px;
      background: #e2e9f4;
      border-bottom: 1px solid #aaaaaa;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .buttons {
      padding: 5px;
      border-bottom: 1px solid #aaaaaa;
      background: #e2e2e2;
      overflow-x: auto;
      .el-row {
        .el-button {
          padding: 6px 8px;
        }
      }
    }
    .tree-wrapper {
      overflow-x: auto;
      .el-tree {
        padding: 10px 10px 5px;
        overflow: auto;
        min-width: 100%;
        display: inline-block !important;
      }
    }
  }
  .right-content {
    flex: 1;
    min-width: 954px;
  }

  .navigationClass {
    float: left;
    width: 100%;
    line-height: 46px;
    height: 100%;
    background-color: white;
    ul {
      width: 100%;
      height: 100%;
      margin: 10px;
      li {
        list-style: none;
        font-size: 14px;
        cursor: pointer;
      }
      .selected {
        font-weight: bold;
        font-size: 18px;
        text-decoration: underline;
      }
    }
  }
}
</style>

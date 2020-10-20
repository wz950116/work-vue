<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '1000px' : '1150px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <!-- 顶部按钮 -->
      <el-row class='top-operate'>
        <el-button v-db-click size="mini" @click="cancel">
          <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type="primary" v-db-click size="mini" @click="confirmClick">
          <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
        </el-button>
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('biz.btn.exportData')" />
        <el-button v-db-click size="mini" v-if="autoMatchFlag" @click="autoMatchFlag = false">
          <svg-icon icon-class="线性-返回"></svg-icon>{{$t('biz.btn.cancelMatch')}}
        </el-button>
      </el-row>

      <main>
        <el-tabs v-model="activeNameBottom" type="border-card">
          <el-tab-pane :label="$t('derivative.externalTradeAccount.fundInfo')" name="exposureInfo">
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='370'>
              <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
              <!-- 期货公司  -->
              <el-table-column align='left' prop='brokerName' :label="$t('derivative.externalTradeAccount.brokerName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 期货账号  -->
              <el-table-column align='left' prop='derivativeAccount' :label="$t('derivative.externalTradeAccount.derivativeAccount')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 入账日期  -->
              <el-table-column align='center' prop='tradeDate' :label="$t('derivative.externalTradeAccount.tradingDay')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.tradingDay | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 上日结存  -->
              <el-table-column align='right' prop='preBalance' :label="$t('derivative.externalTradeAccount.preBalance')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.preBalance | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 当日入金  -->
              <el-table-column align='right' prop='rawQuantity' :label="$t('derivative.externalTradeAccount.inFund')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.inFund | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 当日出金  -->
              <el-table-column align='right' prop='startDate' :label="$t('derivative.externalTradeAccount.outFund')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.outFund | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 平仓盈亏  -->
              <el-table-column align='right' prop='endDate' :label="$t('derivative.externalTradeAccount.closeProfit')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.closeProfit | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 持仓盈亏  -->
              <el-table-column align='right' prop='endDate' :label="$t('derivative.externalTradeAccount.positionProfit')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.positionProfit | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 手续费  -->
              <el-table-column align='right' prop='endDate' :label="$t('derivative.externalTradeAccount.commission')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.commission | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 保证金  -->
              <el-table-column align='right' prop='endDate' :label="$t('derivative.externalTradeAccount.posiMargin')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.posiMargin | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 可用资金  -->
              <el-table-column align='right' prop='endDate' :label="$t('derivative.externalTradeAccount.available')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.available | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 当日结存  -->
              <el-table-column align='right' prop='endDate' :label="$t('derivative.externalTradeAccount.balance')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.balance | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 币种  -->
              <el-table-column align='left' prop='currencyName' :label="$t('derivative.externalTradeAccount.currencyName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 期初 -->
              <el-table-column align='left' prop='preliminaryFlag' :label="$t('derivative.externalTradeAccount.preliminaryFlag')" width='100' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.preliminaryFlag | dataDictFormat($t('datadict.yesNo'))}}</span>
                </template>
              </el-table-column>
              <!-- 备注 -->
              <el-table-column align='left' prop='remark' :label="$t('derivative.externalTradeAccount.remark')" width='100' show-overflow-tooltip></el-table-column>
              <el-table-column prop='result' :label="$t('derivative.externalTradeAccount.reason')" width='300'></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </main>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo, notifyError, notifySuccess } from '@/utils/frame/base/notifyParams'
import { numFormat } from '@/utils/frame/base/validate'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import request from '@/utils/frame/base/request'

export default {
  name: '',
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      tableData: [],
      loading: false,
      currentRow: null,
      autoMatchFlag: false,
      virtualFlag: '',
      activeNameBottom: 'exposureInfo',
      productItemInfo: [],
      listQuery: {
        data: {},
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.save')
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440
        ? this.clientHeight - 500
        : this.clientHeight - 520 // 防止底部滚动条遮挡
    },
    titleName() {
      return this.$t('derivative.externalTradeAccount.importTitle')
    }
  },
  props: {
    data: [String, Array]
  },
  methods: {
    // 保存 向后台返回数据 返回true则把数据带到列表页面
    confirmClick() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('derivative.externalTradeAccount.msg.tableIsEmpty')
          })
        )
        return
      }

      for (var i in this.tableData) {
        if (this.tableData[i].result) {
          this.$notify(
            notifyError({
              msg:
                '第' +
                (parseInt(i) + 1) +
                '条数据' +
                this.tableData[i].result +
                ',无法保存!'
            })
          )
          return
        }
      }

      request({
        url: '/api/derivative/dvtExtFuturesAccount/import',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.tableData
        }
      }).then(request => {
        this.$notify(
          notifySuccess({
            msg: this.$t('spotProj.exposure.msg.importSuccess')
          })
        )
        this.$emit('close')
      })
    },
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        this.$emit('close')
      }).catch(() => { })
    },
    // 文件校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 文件上传
    handleSuccess({ results, header }) {
      if (results) {
        this.pageLoading = true
        // 导入的数据不能为空
        if (results.length === 0) {
          this.showDialog = false
          this.$notify(
            notifyInfo({
              msg: this.$t('导入的文件数据为空!')
            })
          )
        } else {
          this.documentNos = {}
          results.forEach(element => {
            const obj = {}
            element.brokerName = element['期货公司']
            element.derivativeAccount = element['期货账号']
            if (element['入账日期']) {
              element.tradingDay = element['入账日期'].replace(RegExp('-', 'g'), '')
            }
            if (element[this.$t('derivative.externalTradeAccount.preBalance')]) {
              element.preBalance = element[this.$t('derivative.externalTradeAccount.preBalance')].trim()
            }
            if (element[this.$t('derivative.externalTradeAccount.inFund')]) {
              element.inFund = element[this.$t('derivative.externalTradeAccount.inFund')].trim()
            }
            if (element[this.$t('derivative.externalTradeAccount.outFund')]) {
              element.outFund = element[this.$t('derivative.externalTradeAccount.outFund')].trim()
            }
            if (element[this.$t('derivative.externalTradeAccount.closeProfit')]) {
              element.closeProfit = element[this.$t('derivative.externalTradeAccount.closeProfit')].trim()
            }
            if (element[this.$t('derivative.externalTradeAccount.positionProfit')]) {
              element.positionProfit = element[this.$t('derivative.externalTradeAccount.positionProfit')].trim()
            }
            if (element[this.$t('derivative.externalTradeAccount.commission')]) {
              element.commission = element[this.$t('derivative.externalTradeAccount.commission')].trim()
            }
            if (element[this.$t('derivative.externalTradeAccount.posiMargin')]) {
              element.posiMargin = element[this.$t('derivative.externalTradeAccount.posiMargin')].trim()
            }
            if (element[this.$t('derivative.externalTradeAccount.available')]) {
              element.available = element[this.$t('derivative.externalTradeAccount.available')].trim()
            }
            if (element[this.$t('derivative.externalTradeAccount.balance')]) {
              element.balance = element[this.$t('derivative.externalTradeAccount.balance')].trim()
            }
            element.currencyName = element[this.$t('derivative.externalTradeAccount.currencyName')]
            if (element[this.$t('derivative.externalTradeAccount.preliminaryFlag')] === '是') {
              element.preliminaryFlag = '1'
            } else {
              element.preliminaryFlag = '0'
            }
            this.validate(element)
          })

          this.tableData = results
        }
      }
    },
    validate(element) {
      if (!element.brokerName) {
        element.result = '期货公司不能为空'
        return
      }
      if (!element.derivativeAccount) {
        element.result = '期货账号不能为空'
        return
      }
      if (!element.tradingDay) {
        element.result = '入账日期不能为空'
        return
      }
      if (!element.positionProfit && !element.closeProfit) {
        element.result = '盈亏信息不能为空'
        return
      }
    }
  }
}
</script>

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
          <el-tab-pane :label="$t('option.trade.importTitle')" name="exposureInfo">
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='370'>
              <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
              <!-- 账号  -->
              <el-table-column align='left' prop='derivativeAccount' :label="$t('option.trade.list.derivativeAccount')" width='150' show-overflow-tooltip></el-table-column>
              <!-- 客户  -->
              <el-table-column align='left' prop='customerName' :label="$t('option.trade.list.customerName')" width='150' show-overflow-tooltip></el-table-column>
              <!-- 成交单号  -->
              <el-table-column v-if="!getBillNoRequired()" align='left' prop='tradeId' :label="$t('option.trade.list.tradeId')" width='150' show-overflow-tooltip></el-table-column>
              <!-- 交易动作  -->
              <el-table-column align='center' prop='optionOffset' :label="$t('option.trade.list.optionOffset')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.optionOffset | dataDictFormat($t('datadict.optionOffset'))}}</span>
                </template>
              </el-table-column>
              <!-- 期权合约  -->
              <el-table-column align='left' prop='optionContract' :label="$t('option.trade.list.optionContract')" width='200' show-overflow-tooltip></el-table-column>
              <!-- 成交日期  -->
              <el-table-column align='center' prop='tradingDay' :label="$t('option.trade.list.tradingDay')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.tradingDay | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 方向  -->
              <el-table-column align='center' prop='direction' :label="$t('option.trade.list.direction')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.direction | dataDictFormat($t('datadict.optionDirection'))}}</span>
                </template>
              </el-table-column>
              <!-- 期权单价  -->
              <el-table-column align='right' prop='price' :label="$t('option.trade.list.price')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.price | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 手数  -->
              <el-table-column align='right' prop='volume' :label="$t('option.trade.list.volume')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.volume | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 成交标的价  -->
              <el-table-column align='right' prop='underlyingPrice' :label="$t('option.trade.list.underlyingPrice')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.underlyingPrice | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 权利金/行权盈亏  -->
              <el-table-column align='right' prop='premium' :label="$t('option.trade.list.premium')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.premium | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 手续费  -->
              <el-table-column align='right' prop='commission' :label="$t('option.trade.list.commission')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.commission | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 对方客户名称  -->
              <el-table-column align='left' prop='counterpartyName' :label="$t('option.trade.list.counterpartyName')" width='150' show-overflow-tooltip></el-table-column>
              <!-- 期初标志  -->
              <el-table-column align='center' prop='preliminaryFlag' :label="$t('option.trade.list.preliminaryFlag')" width='80' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <el-checkbox v-model="scope.row.preliminaryFlag" :disabled="true"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop='result' :label="$t('dataHq.marginRate.reason')" width='300'></el-table-column>
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
      return this.clientWidth > 1440 ? this.clientHeight - 500 : this.clientHeight - 520 // 防止底部滚动条遮挡
    },
    titleName() {
      return this.$t('option.trade.importTitle')
    }
  },
  props: {
    data: [String, Array]
  },
  mounted() {
  },
  methods: {
    getBillNoRequired() {
      return this.$route.meta.seqMode === '0'
    },
    // 保存 向后台返回数据 返回true则把数据带到列表页面
    confirmClick() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('dataHq.marginRate.msg.tableIsEmpty')
          })
        )
        return
      }

      for (var i in this.tableData) {
        var data = this.tableData[i]
        if (data.preliminaryFlag) {
          data.preliminaryFlag = '1'
        } else {
          data.preliminaryFlag = '0'
        }

        if (data.result) {
          this.$notify(
            notifyError({
              msg: '第' + (parseInt(i) + 1) + '条数据' + data.result + ',无法保存!'
            })
          )
          return
        }
      }

      request({
        url: '/api/derivative/dvtOptionTrade/import',
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
      })
        .then(() => {
          this.$emit('close')
        })
        .catch(() => { })
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

            element.derivativeAccount = element[this.$t("option.trade.list.derivativeAccount")]
            element.customerName = element[this.$t("option.trade.list.customerName")]
            element.tradeId = element[this.$t("option.trade.list.tradeId")]
            element.optionOffset = numFormat(element[this.$t("option.trade.list.optionOffset")], this.$t('datadict.optionOffset'))
            element.optionContract = element[this.$t("option.trade.list.optionContract")]
            if (element[this.$t("option.trade.list.tradingDay")]) {
              element.tradingDay = element[this.$t("option.trade.list.tradingDay")].replace(RegExp('-', 'g'), '')
            }
            element.direction = numFormat(element[this.$t("option.trade.list.direction")], this.$t('datadict.optionDirection'))
            if (element[this.$t("option.trade.list.price")]) {
              element.price = element[this.$t("option.trade.list.price")].trim()
            }
            if (element[this.$t("option.trade.list.volume")]) {
              element.volume = element[this.$t("option.trade.list.volume")].trim()
            }
            if (element[this.$t("option.trade.list.underlyingPrice")]) {
              element.underlyingPrice = element[this.$t("option.trade.list.underlyingPrice")].trim()
            }
            if (element[this.$t("option.trade.list.premium")]) {
              element.premium = element[this.$t("option.trade.list.premium")].trim()
            }
            if (element[this.$t("option.trade.list.commission")]) {
              element.commission = element[this.$t("option.trade.list.commission")].trim()
            }
            element.counterpartyName = element[this.$t("option.trade.list.counterpartyName")]
            if (element[this.$t('option.trade.list.preliminaryFlag')] === 'Y') {
              element.preliminaryFlag = true
            } else {
              element.preliminaryFlag = false
            }
            this.validate(element)
          })

          this.tableData = results
        }
      }
    },
    validate(element) {
      if (!element.derivativeAccount) {
        element.result = '账号不能为空'
        return
      }
      if (!element.customerName) {
        element.result = '客户不能为空'
        return
      }
      if (!element.optionContract) {
        element.result = '期权合约不能为空'
        return
      }
      if (!element.direction) {
        element.result = '方向不能为空'
        return
      }
      if (!element.optionOffset) {
        element.result = '交易动作不能为空'
        return
      }
      if (!element.price) {
        element.result = '期权单价不能为空'
        return
      }
      if (!element.volume) {
        element.result = '手数不能为空'
        return
      }
      if (!element.underlyingPrice) {
        element.result = '成交标的价不能为空'
        return
      }
    }
  }
}
</script>

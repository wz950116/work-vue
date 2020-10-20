<template>
  <div class="app-container edit-page-style">
    <!-- 顶部按钮 -->
    <el-row class="top-operate">
      <upload-excel-component v-permission="['select']" :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('biz.btn.chooseFile')" style="margin-right:6px;" />
      <el-button v-db-click size="mini" v-permission="['cancel']" @click="cancel" style="margin-right:6px;">
        <svg-icon icon-class="线性-取消"></svg-icon>
        {{this.$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" v-permission="['save']" @click="saveEdit" style="margin-right:6px;" type="primary" :disabled="disabled">
        <svg-icon icon-class="线性-保存"></svg-icon>
        {{this.$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" v-permission="['download']" @click="download" style="margin-right:6px;">
        <svg-icon icon-class="线性-下载"></svg-icon>
        {{this.$t('biz.btn.download')}}
      </el-button>
    </el-row>
    <!-- 头部查询 -->
    <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class="form-title">
        {{$t('biz.title.mainInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click="mainInfoVisible = !mainInfoVisible"></i>
      </div>
      <el-form v-if="mainInfoVisible" :inline="true" :model="formData" class="header-form-inline" label-position="left" ref="refForm">
        <el-row :gutter="20">
          <!-- 子账号 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImportInit.derivativeSubAccount')">
              <input-validate v-model="formData.derivativeSubAccount" :placeholder="$t('biz.placeholder.input')" disabled></input-validate>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImportInit.tradingDay')">
              <el-date-picker v-model="formData.tradingDay" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd" :placeholder="$t('biz.placeholder.dateInput')" disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 持仓保证金 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImportInit.posiMargin')">
              <input-formatter v-model="formData.posiMargin" type="thousands" :max="999999999999.999999" :min="0" :precision="2" size="mini" disabled></input-formatter>
            </el-form-item>
          </el-col>

          <!-- 平仓盈亏 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImportInit.closeProfit')">
              <input-formatter v-model="formData.closeProfit" type="thousands" :max="999999999999.999999" :min="0" :precision="2" size="mini" disabled></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 浮动盈亏 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImportInit.positionProfit')">
              <input-formatter v-model="formData.positionProfit" type="thousands" :max="999999999999.999999" :min="0" :precision="2" size="mini" disabled></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 当日权益 -->
          <!-- <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImportInit.balance')">
              <input-formatter v-model="formData.balance" type="thousands" :max='999999999999.999999' :min='0' :precision='3' size="mini" disabled> </input-formatter>
            </el-form-item>
          </el-col>-->
          <!-- 手续费 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImportInit.commission')">
              <input-formatter v-model="formData.commission" type="thousands" :max="999999999999.999999" :min="0" :precision="2" size="mini" disabled></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 浮动盈亏 -->
          <!-- <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImportInit.positionProfit')">
              <input-formatter v-model="formData.positionProfit" type="thousands" :max='999999999999.999999' :min='0' :precision='3' size="mini" disabled> </input-formatter>
            </el-form-item>
          </el-col>-->
        </el-row>
      </el-form>
    </header>

    <!-- 列表内容 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
      <el-tabs v-model="activeName" type="border-card">
        <!-- 持仓明细  -->
        <el-tab-pane :label="$t('derivative.futureSubImportInit.positionDetails')" name="positionDetails">
          <el-table stripe border v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" class="table-content" ref="multipleTable" highlight-current-row :data="list">
            <el-table-column type="index" width="50" :label="$t('table.id')" fixed></el-table-column>
            <!-- 期货账号 -->
            <el-table-column prop="derivativeAccount" :label="$t('derivative.futureSubImportInit.derivativeAccount')" width="120" show-overflow-tooltip></el-table-column>
            <!-- 子账号 -->
            <el-table-column prop="derivativeSubAccount" :label="$t('derivative.futureSubImportInit.derivativeSubAccount')" width="120" show-overflow-tooltip>
            </el-table-column>
            <!-- 交易日期 -->
            <el-table-column align="center" prop="tradingDay" :label="$t('derivative.futureSubImportInit.tradingDay')" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.tradingDay | dateFormat}}</span>
              </template>
            </el-table-column>
            <!-- 合约 -->
            <el-table-column prop="futuresContractCode" :label="$t('derivative.futureSubImportInit.futuresContractCode')" width="120" show-overflow-tooltip>
            </el-table-column>
            <!-- 委托单号 -->
            <el-table-column prop="orderSysId" :label="$t('derivative.futureSubImportInit.orderSysId')" width="120" show-overflow-tooltip></el-table-column>

            <!-- 买持仓-  数量(整数) -->
            <el-table-column align="right" prop="longVolume" :label="$t('derivative.futureSubImportInit.longVolume')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.longVolume }}</span>
              </template>
            </el-table-column>
            <!-- 买入价 单价 -->
            <el-table-column align="right" prop="longPrice" :label="$t('derivative.futureSubImportInit.longPrice')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.longPrice === ''">{{scope.row.longPrice}}</span>
                <span v-else>{{scope.row.longPrice | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 卖持仓  数量(整数) -->
            <el-table-column align="right" prop="shortVolume" :label="$t('derivative.futureSubImportInit.shortVolume')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.shortVolume }}</span>
              </template>
            </el-table-column>
            <!-- 卖出价  单价 -->
            <el-table-column align="right" prop="shortPrice" :label="$t('derivative.futureSubImportInit.shortPrice')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.shortPrice === ''">{{scope.row.shortPrice }}</span>
                <span v-else>{{scope.row.shortPrice | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 昨结算价  单价 -->
            <el-table-column prop="preSettlementPrice" :label="$t('derivative.futureSubImportInit.preSettlementPrice')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.preSettlementPrice === ''">{{scope.row.preSettlementPrice }}</span>
                <span v-else>{{scope.row.preSettlementPrice | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 今结算价  单价 -->
            <el-table-column prop="settlementPrice" :label="$t('derivative.futureSubImportInit.settlementPrice')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.settlementPrice === ''">{{scope.row.settlementPrice }}</span>
                <span v-else>{{scope.row.settlementPrice | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 持仓盈亏  金额 -->
            <el-table-column prop="positionProfit" :label="$t('derivative.futureSubImportInit.positionProfit')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.positionProfit === ''">{{scope.row.positionProfit }}</span>
                <span v-else>{{scope.row.positionProfit | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 投机/套保 -->
            <el-table-column align="center" prop="hedgeFlag" :label="$t('derivative.futureSubImportInit.hedgeFlag')" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!isNaN(scope.row.hedgeFlag)">{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
                <span v-else>{{scope.row.hedgeFlag }}</span>
                <!-- <span>{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span> -->
              </template>
            </el-table-column>
            <!-- 成交单号 -->
            <el-table-column prop="tradeId" :label="$t('derivative.futureSubImportInit.tradeId')" width="120" show-overflow-tooltip></el-table-column>
            <!-- 检查结果 -->
            <el-table-column prop="checkResult" :label="$t('derivative.futureSubImportInit.checkResult')" width="160" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputFormatter from '@/components/frame/InputFormatter'
import { parseTime } from '@/utils/frame/base/index'
import UploadExcelComponent from '@/views/frame/rm/derivative/components/UploadExcelMore'
import excel_DvtFutureSubImpInit from '@/assets/frame/excel/dvt/DvtFutureSubImpInit.xlsx'
// getImport
import * as futureSubImportInit from '@/api/frame/rm/derivative/futuresAccountImportInit'
import {
  numFormat, // 上传文件转换为字典码表key值
  toDateFromString, // 验证时间是否有效
  verifyNamber, // 验证是数字
  verifyInteger // 验证是整数
} from '@/utils/frame/base/validate'
// 期货子账号期初数据导入
export default {
  name: 'futureSubImportInit',
  data() {
    return {
      mainInfoVisible: true,
      tempExcelPath: excel_DvtFutureSubImpInit,
      activeName: 'positionDetails',
      loading: false,
      disabled: true,
      list: [],
      formData: {
        derivativeSubAccount: '',
        tradingDay: '',
        posiMargin: '',
        closeProfit: '',
        commission: '',
        positionProfit: ''
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1355
        ? this.clientHeight - 505
        : this.clientHeight - 525
    }
  },
  components: {
    InputFormatter,
    UploadExcelComponent
  },
  mounted() { },
  methods: {
    download() {
      const url = this.tempExcelPath
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '子账号期初数据模板.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
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
    handleSuccess(data) {
      this.list = []
      this.formData = {}
      const results1 = data.results1
      const results2 = data.results2
      if (
        data.header1.length !== 10 ||
        data.header2.length !== 13 ||
        results1.length !== 3
      ) {
        this.$notify.error({
          title: '错误',
          message: '导入模板错误',
          position: 'bottom-right'
        })
        return
      }
      if (results1) {
        for (var j in results1) {
          for (var v in results1[j]) {
            results1[j][v] = results1[j][v].trim()
            if (results1[j][v].indexOf(',') !== -1) {
              results1[j][v] = results1[j][v].replace(/,/g, '')
            }
          }
        }
        this.formData.derivativeSubAccount = results1[0]['__EMPTY_1'] || ''
        this.formData.tradingDay = results1[0]['__EMPTY_6'] || ''
        this.formData.posiMargin = results1[1]['__EMPTY_1'] || ''
        this.formData.closeProfit = results1[1]['__EMPTY_6'] || ''
        this.formData.positionProfit = results1[2]['__EMPTY_1'] || ''
        this.formData.commission = results1[2]['__EMPTY_6'] || ''
        if (this.formData.tradingDay !== '') {
          this.formData.tradingDay = parseTime(
            this.formData.tradingDay,
            '{y}{m}{d}'
          )
        }
        var msg = ''
        for (var i in this.formData) {
          const ele = this.formData[i]
          if (ele === '' || ele === undefined) {
            msg += this.$t('derivative.futureSubImportInit.' + i) + '不能为空!'
          }
        }
        if (msg !== '') {
          this.$notify.error({
            title: '错误',
            message: msg,
            position: 'bottom-right'
          })
          return
        }
        for (var index in this.formData) {
          const ele = this.formData[index]
          // 验证日期
          if (index === 'tradingDay' && ele !== '') {
            if (!toDateFromString(ele)) {
              this.$notify.error({
                title: '错误',
                message: '交易日期不是有效的日期',
                position: 'bottom-right'
              })
              return
            }
          }
          if (
            (index === 'closeProfit' && ele !== '' && !verifyNamber(ele)) ||
            (index === 'commission' && ele !== '' && !verifyNamber(ele)) ||
            (index === 'positionProfit' && ele !== '' && !verifyNamber(ele)) ||
            (index === 'posiMargin' && ele !== '' && !verifyNamber(ele))
          ) {
            this.$notify.error({
              title: '错误',
              message:
                this.$t('derivative.futureSubImportInit.' + index) +
                '不是有效的数组',
              position: 'bottom-right'
            })
            return
          }
        }
      }
      if (results2.length !== 0) {
        this.disabled = false
        results2.forEach(element => {
          for (var j in element) {
            element[j] = element[j].trim()
            if (element[j].indexOf(',') !== -1) {
              element[j] = element[j].replace(/,/g, '')
            }
          }
          var objDown = {}
          objDown.derivativeAccount = element['期货账号'] || ''
          objDown.derivativeSubAccount = element['子账号'] || ''
          objDown.futuresContractCode = element['合约'] || ''
          objDown.orderSysId = ''
          objDown.tradeId = element['成交单号'] || ''
          objDown.longVolume = element['买持仓'] || ''
          objDown.longPrice = element['买入价'] || ''
          objDown.shortVolume = element['卖持仓'] || ''
          objDown.shortPrice = element['卖出价'] || ''
          objDown.preSettlementPrice = element['昨结算价'] || ''
          objDown.settlementPrice = element['今结算价'] || ''
          objDown.positionProfit = element['浮动盈亏'] || ''
          objDown.hedgeFlag = element['投机/套保'] || ''
          objDown.tradingDay = this.formData.tradingDay
          // objDown.tradeDate = element['实际成交日期'] || ''
          // objDown.tradeDate = parseTime(objDown.tradeDate, '{y}{m}{d}')
          objDown.checkResult = ''
          objDown.hedgeFlag = numFormat(
            objDown.hedgeFlag,
            this.$t('datadict.futureHedgeType')
          )
          for (var i in objDown) {
            const ele = objDown[i]
            // 验证不为空
            if (
              (i === 'futuresContractCode' && ele === '') ||
              (i === 'derivativeSubAccount' && ele === '') ||
              (i === 'positionProfit' && ele === '') ||
              (i === 'tradeId' && ele === '') ||
              (i === 'hedgeFlag' && ele === '')
            ) {
              objDown.checkResult +=
                this.$t('derivative.futureSubImportInit.' + i) +
                '存在空值' +
                ','
            }

            if (
              (i === 'longVolume' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'longPrice' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'shortVolume' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'shortPrice' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'preSettlementPrice' &&
                ele !== '' &&
                !verifyInteger(ele)) ||
              (i === 'settlementPrice' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'positionProfit' && ele !== '' && !verifyInteger(ele))
            ) {
              objDown.checkResult +=
                this.$t('derivative.futureSubImportInit.' + i) +
                '不是数字或小于零' +
                ','
            }
            // 验证是整数
            if (
              (i === 'longVolume' && ele !== '') ||
              (i === 'shortVolume' && ele !== '')
            ) {
              if (ele > 0 && ele % 1 !== 0) {
                objDown.checkResult +=
                  this.$t('derivative.futureSubImportInit.' + i) +
                  '不是整数' +
                  ','
              }
            }
            if (i === 'longVolume' && ele !== '') {
              objDown.longVolume = parseFloat(objDown.longVolume).toString()
            }
            if (i === 'shortVolume' && ele !== '') {
              objDown.shortVolume = parseFloat(objDown.shortVolume).toString()
            }
            // if (i === 'tradeDate' && ele !== '') {
            //   if (!toDateFromString(ele)) {
            //     objDown.checkResult +=
            //       this.$t('derivative.futureSubImportInit.' + i) +
            //       '不是有效的日期' +
            //       ','
            //   }
            // }
            if (i === 'hedgeFlag' && (ele !== '1' && ele !== '3')) {
              objDown.checkResult +=
                this.$t('derivative.futureSubImportInit.' + i) +
                '的值不正确' +
                ','
            }
          }
          // 买持仓与卖持仓不可以同时为空。
          if (objDown.longVolume === '' && objDown.shortVolume === '') {
            objDown.checkResult += '买持仓与卖持仓不可以同时为空!'
          }

          if (objDown.longVolume !== '' && objDown.shortVolume !== '') {
            objDown.checkResult += '买持仓与卖持仓不可以同时有值!'
          }
          if (objDown.longVolume !== '' && objDown.longPrice === '') {
            objDown.checkResult += '输入买持仓时，买入价也必须输入!'
          }
          if (objDown.shortVolume !== '' && objDown.shortPrice === '') {
            objDown.checkResult += '输入卖持仓时，卖出价也必须输入!'
          }
          if (objDown.longPrice !== '' && objDown.longVolume === '') {
            objDown.checkResult += '输入买入价时，买持仓也必须输入!'
          }
          if (objDown.shortPrice !== '' && objDown.shortVolume === '') {
            objDown.checkResult += '输入卖出价时，卖持仓也必须输入!'
          }
          this.list.push(objDown)
        })
      } else {
        this.disabled = true
        this.$notify.error({
          title: '错误',
          message: '持仓明细数据不可为空',
          position: 'bottom-right'
        })
        return
      }
      if (this.list.length !== 0) {
        var arr = []
        for (var it = 0; it < this.list.length; it++) {
          if (it === 0) arr.push(this.list[it])
          let b = false
          if (arr.length > 0 && it > 0) {
            for (var p = 0; p < arr.length; p++) {
              if (
                arr[p].futuresContractCode ===
                this.list[i].futuresContractCode &&
                arr[p].tradeId === this.list[it].tradeId
              ) {
                b = true // break;
                this.list[p].checkResult +=
                  '持仓明细数据重复(合约代码:' +
                  this.list[p].futuresContractCode +
                  ', 成交单号:' +
                  this.list[p].tradeId +
                  ')'
              }
            }
            if (!b) {
              arr.push(this.list[it])
            }
          }
        }
        this.list.forEach(t => {
          if (t.checkResult.length !== 0) {
            // 打开保存按钮
            this.disabled = true
          }
        })
      }
    },

    // 保存
    saveEdit() {
      this.$confirm(
        this.$t('biz.msg.confirmSaveFuturetip'),
        this.$t('biz.msg.tip'),
        {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        }
      )
        .then(() => {
          var data = {
            account: this.formData,
            posiList: this.list,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.import')
          }
          futureSubImportInit
            .importSub({ data: data })
            .then(response => {
              this.$store.dispatch('delVisitedViews', this.$route).then(() => {
                this.$router.push({
                  name: 'futureSubImportInit',
                  params: {
                    refresh: true
                  }
                })
              })
            })
            .catch(() => { })
        })
        .catch(() => { })
    },
    // 取消
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.list = []
          this.formData = {}
        })
        .catch(() => { })
    }
  }
}
</script>

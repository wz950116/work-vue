<template>
  <div class="app-container edit-page-style">
    <!-- 顶部按钮 -->
    <el-row class="top-operate">
      <el-button v-db-click style='margin-right:6px;' type="primary" size="mini" @click="close" v-if="['view'].includes(type)">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" @click="handleUpload" style="margin-right:6px;" :loading="loading" v-if="['add'].includes(type)">
        <svg-icon icon-class="线性-上传"></svg-icon>
        {{this.$t('biz.btn.chooseFile')}}
        <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleFile" v-if="['add'].includes(type)" />
      </el-button>
      <el-button v-db-click size="mini" @click="cancel" style="margin-right:6px;" v-if="['add'].includes(type)">
        <svg-icon icon-class="线性-取消"></svg-icon>
        {{this.$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" @click="saveEdit" style="margin-right:6px;" type="primary" :disabled="disabled" v-if="['add'].includes(type)">
        <svg-icon icon-class="线性-保存"></svg-icon>
        {{this.$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" @click="download" style="margin-right:6px;" v-if="['add'].includes(type)">
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
      <el-form v-if="mainInfoVisible" :inline="true" class="header-form-inline" label-position="left" ref="refForm">
        <el-row :gutter="20">
          <!-- 期货账号 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.derivativeAccount')">
              <input-validate v-model.trim="formData.derivativeAccount" :placeholder="$t('biz.placeholder.input')" disabled></input-validate>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.tradingDay')">
              <el-date-picker v-model="formData.tradingDay" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd" :placeholder="$t('biz.placeholder.dateInput')" disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 客户名称 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.mainName')">
              <input-validate v-model.trim="formData.mainName" :placeholder="$t('biz.placeholder.input')" disabled>
              </input-validate>
            </el-form-item>
          </el-col>
          <!-- 期货公司名称 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.brokerName')">
              <input-validate v-model.trim="formData.brokerName" :placeholder="$t('biz.placeholder.input')" disabled>
              </input-validate>
            </el-form-item>
          </el-col>
          <!-- 上日结存 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.preBalance')">
              <input-formatter v-model="formData.preBalance" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 当日权益 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.balance')">
              <input-formatter v-model="formData.balance" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>

          <!-- 资金存取 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.fundInOut')">
              <input-formatter v-model="formData.fundInOut" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 平仓盈亏 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.closeProfit')">
              <input-formatter v-model="formData.closeProfit" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 手续费 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.commission')">
              <input-formatter v-model="formData.commission" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 当日结存 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.reserve')">
              <input-formatter v-model="formData.reserve" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 浮动盈亏 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.positionProfit')">
              <input-formatter v-model="formData.positionProfit" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 可用资金 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.available')">
              <input-formatter v-model="formData.available" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓保证金 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImportInit.posiMargin')">
              <input-formatter v-model="formData.posiMargin" placeholder="$t('biz.placeholder.input')" disabled type="thousands" :precision="2" :max="999999999999.999999" :min="0" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <!-- 列表内容 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-tabs v-model="activeName" type="border-card">
        <!-- 持仓明细  -->
        <el-tab-pane :label="$t('derivative.futuresAccountImportInit.positionDetails')" name="positionDetails">
          <el-table stripe border v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" class="table-content" ref="multipleTable" :data="list" highlight-current-row height="286">
            <el-table-column type="index" width="50" :label="$t('table.id')" fixed></el-table-column>
            <!-- 合约 -->
            <el-table-column prop="futuresContractCode" :label="$t('derivative.futuresAccountImportInit.futuresContractCode')" width="120" show-overflow-tooltip>
            </el-table-column>
            <!-- 委托单号 -->
            <el-table-column prop="orderSysId" :label="$t('derivative.futuresAccountImportInit.orderSysId')" width="120" show-overflow-tooltip></el-table-column>
            <!-- 成交单号 -->
            <el-table-column prop="tradeId" :label="$t('derivative.futuresAccountImportInit.tradeId')" width="120" show-overflow-tooltip></el-table-column>
            <!-- 买持仓数量(整数) -->
            <el-table-column align="right" prop="longVolume" :label="$t('derivative.futuresAccountImportInit.longVolume')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.longVolume }}</span>
              </template>
            </el-table-column>
            <!-- 买入价单价 -->
            <el-table-column align="right" prop="longPrice" :label="$t('derivative.futuresAccountImportInit.longPrice')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!scope.row.longPrice">{{scope.row.longPrice }}</span>
                <span v-else>{{scope.row.longPrice | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 卖持仓数量(整数) -->
            <el-table-column align="right" prop="shortVolume" :label="$t('derivative.futuresAccountImportInit.shortVolume')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.shortVolume }}</span>
              </template>
            </el-table-column>
            <!-- 卖出价单价 -->
            <el-table-column align="right" prop="shortPrice" :label="$t('derivative.futuresAccountImportInit.shortPrice')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.shortPrice === ''">{{scope.row.shortPrice }}</span>
                <span v-else>{{scope.row.shortPrice | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 昨结算价单价 -->
            <el-table-column align="right" prop="preSettlementPrice" :label="$t('derivative.futuresAccountImportInit.preSettlementPrice')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.preSettlementPrice === ''">{{scope.row.preSettlementPrice }}</span>
                <span v-else>{{scope.row.preSettlementPrice | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 今结算价单价 -->
            <el-table-column align="right" prop="settlementPrice" :label="$t('derivative.futuresAccountImportInit.settlementPrice')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.settlementPrice === ''">{{scope.row.settlementPrice}}</span>
                <span v-else>{{scope.row.settlementPrice | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 持仓盈亏金额 -->
            <el-table-column align="right" prop="positionProfit" :label="$t('derivative.futuresAccountImportInit.positionProfit')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.positionProfit === ''">{{scope.row.positionProfit}}</span>
                <span v-else>{{scope.row.positionProfit | numFilter(2) | thousandth}}</span>
              </template>
            </el-table-column>
            <!-- 投机/套保 -->
            <el-table-column align="center" prop="hedgeFlag" :label="$t('derivative.futuresAccountImportInit.hedgeFlag')" width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="!isNaN(scope.row.hedgeFlag)">{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
                <span v-else>{{scope.row.hedgeFlag }}</span>
              </template>
            </el-table-column>
            <!-- 交易日期 -->
            <el-table-column align="center" prop="tradingDay" :label="$t('derivative.futuresAccountImportInit.tradingDay')" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.tradingDay | dateFormat}}</span>
              </template>
            </el-table-column>
            <!-- 检查结果 -->
            <el-table-column prop="checkResult" :label="$t('derivative.futuresAccountImportInit.checkResult')" width="160" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 持仓汇总 -->
        <el-tab-pane :label="$t('derivative.futuresAccountImport.positionDetails')" name="positionSum">
          <import-position-tab :detailDatas="list1" :tableHeight="tableHeight"></import-position-tab>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as futuresAccountImportInit from '@/api/frame/rm/derivative/futuresAccountImportInit'
import InputFormatter from '@/components/frame/InputFormatter'
import excel_DvtFutureImpInit from '@/assets/frame/excel/dvt/DvtFutureImpData.xlsx'
import XLSX from 'xlsx'
import QmExcelUtil from '@/views/frame/rm/derivative/components/ExcelUtil/QmExcelUtil'
import importPositionTab from '@/views/frame/rm/derivative/components/importPositionTab'
import request from '@/utils/frame/base/request'

export default {
  name: 'futuresAccountImportInit',
  data() {
    return {
      mainInfoVisible: true,
      tempExcelPath: excel_DvtFutureImpInit,
      activeName: 'positionDetails',
      loading: false,
      disabled: true,
      list: [], // 持仓明细
      list1: [], // 持仓汇总
      flg: false,
      formData: {},
      type: this.$route.params.type
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
    importPositionTab
  },
  mounted() {
    if (this.$route.params.type !== 'add') {
      this.getList()
    }
  },
  methods: {
    getList() {
      request({
        url: '/api/derivative/dvtFutureInitRcd/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.remove'),
          data: this.$route.params.id
        }
      }).then(request => {
        this.formData = request.data.account
        this.list = request.data.posiList
        this.list1 = request.data.posiSumList
      })
    },
    download() {
      const url = this.tempExcelPath
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '期货账号期初数据模板.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleFile(e) {
      // excel表内容为空，直接return
      if (this.$refs['excel-upload-input'].value === '') {
        return
      }
      this.disabled = true
      let errorFlag = false
      // 获取上传的的excel表文件
      const files = e.target.files
      // 每次只能上传一个文件，所以取第一个就可以了
      const rawFile = files[0] // only use files[0]
      // excel文件必须有内容
      if (!rawFile) {
        this.$refs['excel-upload-input'].value = ''
        return
      }
      // excel文件必须有内容
      if (rawFile.size) {
      } else {
        this.$notify.error({
          title: '错误',
          message: '导入模板错误',
          position: 'bottom-right'
        })
        this.$refs['excel-upload-input'].value = ''
        return
      }
      // 文件的大小不能超过1m
      if (rawFile.size > 1024 * 1024) {
        this.$notify.error({
          title: '错误',
          message: '只可以上传不超过1M的文件',
          position: 'bottom-right'
        })
        this.$refs['excel-upload-input'].value = ''
        return
      }
      // 字典码表数据
      // 0:买 1:卖
      const dataDictFutureDirectionType = {}
      this.$t('datadict.futuresDirection').forEach(
        dataDict =>
          (dataDictFutureDirectionType[dataDict.label] = dataDict.value)
      )
      // 0:开 1：平
      const dataDictFutureOffsetType = {}
      this.$t('datadict.derivativeOffsetShort').forEach(
        dataDict => (dataDictFutureOffsetType[dataDict.label] = dataDict.value)
      )
      // 1：投机  2：套利 3：套保 5：做市商
      const dataDictFutureHedgeType = {}
      this.$t('datadict.futureHedgeType').forEach(
        dataDict => (dataDictFutureHedgeType[dataDict.label] = dataDict.value)
      )
      // 创建读取流的对象
      const reader = new FileReader()
      reader.onload = e => {
        // data为excel的流信息
        const data = XLSX.read(e.target.result, { type: 'binary' })
        // 自定义一个对象，包含期货资金和持仓明细
        const excelData = {
          account: {},
          positionList: [],
          posiSumList: []
        }
        if (
          data.Sheets['客户交易结算日报'] !== undefined &&
          data.Sheets['持仓明细'] !== undefined
        ) {
          // 标准结算单导入
          let sheet = data.Sheets['客户交易结算日报']
          let ref = QmExcelUtil.excelNumRange(sheet['!ref'])
          let cellTxt = ''
          let baseInfoBaseRow = 0 // 【基本资料】开始行
          let accountBaseRow = 0 // 【期货期权账户资金状况】开始行
          let posiSumBaseRow = 0 // 【期货持仓汇总】开始行
          let posiSumEndRow = 0 // 【期货持仓汇总】结束行
          for (let y = ref.top; y <= ref.bottom; y++) {
            cellTxt = QmExcelUtil.excelCellText(sheet, 'A' + y)
            if (baseInfoBaseRow === 0) {
              if (cellTxt === '基本资料') {
                baseInfoBaseRow = y
              }
            }
            if (accountBaseRow === 0) {
              if (cellTxt === '期货期权账户资金状况') {
                accountBaseRow = y
              }
            }
            if (posiSumBaseRow === 0) {
              if (cellTxt === '期货持仓汇总') {
                posiSumBaseRow = y
              }
            } else if (posiSumEndRow === 0) {
              if (cellTxt === '合计') {
                posiSumEndRow = y
                break
              }
            }
          }
          if (baseInfoBaseRow === 0 || accountBaseRow === 0) {
            this.$notify.error({
              title: '错误',
              message: '导入模板错误',
              position: 'bottom-right'
            })
            return
          }
          // 基本资料
          let errMsg = ''
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmpty(
              sheet,
              'C' + (baseInfoBaseRow + 1),
              '客户期货期权内部资金账户'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmpty(
              sheet,
              'C' + (baseInfoBaseRow + 2),
              '客户名称'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmpty(
              sheet,
              'C' + (baseInfoBaseRow + 3),
              '期货公司名称'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyDate(
              sheet,
              'H' + (baseInfoBaseRow + 1),
              '交易日期'
            )
          // 期货期权账户资金状况
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'C' + (accountBaseRow + 1),
              '上日结存'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'C' + (accountBaseRow + 2),
              '当日存取合计'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'C' + (accountBaseRow + 3),
              '平仓盈亏'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'C' + (accountBaseRow + 5),
              '当日手续费'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'C' + (accountBaseRow + 6),
              '当日结存'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'C' + (accountBaseRow + 7),
              '浮动盈亏'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'H' + (accountBaseRow + 6),
              '保证金占用'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'H' + (accountBaseRow + 7),
              '可用资金'
            )
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(
              sheet,
              'H' + (accountBaseRow + 1),
              '客户权益'
            )
          if (errMsg !== '') {
            errorFlag = true
            this.$notify.error({
              title: '错误',
              message: errMsg,
              position: 'bottom-right'
            })
          }

          // 基本资料
          excelData.account.derivativeAccount = QmExcelUtil.excelCellText(
            sheet,
            'C' + (baseInfoBaseRow + 1)
          ) // 客户期货期权内部资金账户
          excelData.account.mainName = QmExcelUtil.excelCellText(
            sheet,
            'C' + (baseInfoBaseRow + 2)
          ) // 客户名称
          excelData.account.brokerName = QmExcelUtil.excelCellText(
            sheet,
            'C' + (baseInfoBaseRow + 3)
          ) // 期货公司名称
          excelData.account.tradingDay = QmExcelUtil.excelCellDate(
            sheet,
            'H' + (baseInfoBaseRow + 1)
          ) // 交易日期
          // 期货期权账户资金状况
          excelData.account.preBalance = QmExcelUtil.excelCellNum(
            sheet,
            'C' + (accountBaseRow + 1)
          ) // 上日结存
          excelData.account.fundInOut = QmExcelUtil.excelCellNum(
            sheet,
            'C' + (accountBaseRow + 2)
          ) // 当日存取合计
          excelData.account.closeProfit = QmExcelUtil.excelCellNum(
            sheet,
            'C' + (accountBaseRow + 3)
          ) // 平仓盈亏
          excelData.account.commission = QmExcelUtil.excelCellNum(
            sheet,
            'C' + (accountBaseRow + 5)
          ) // 当日手续费
          excelData.account.balance = QmExcelUtil.excelCellNum(
            sheet,
            'C' + (accountBaseRow + 6)
          ) // 当日结存
          excelData.account.positionProfit = QmExcelUtil.excelCellNum(
            sheet,
            'C' + (accountBaseRow + 7)
          ) // 浮动盈亏
          excelData.account.posiMargin = QmExcelUtil.excelCellNum(
            sheet,
            'H' + (accountBaseRow + 6)
          ) // 保证金占用
          excelData.account.available = QmExcelUtil.excelCellNum(
            sheet,
            'H' + (accountBaseRow + 7)
          ) // 可用资金
          excelData.account.reserve = QmExcelUtil.excelCellNum(
            sheet,
            'H' + (accountBaseRow + 1)
          ) // 客户权益
          // 期货持仓汇总
          // let posiSumErrorCount = 0
          for (let y = posiSumBaseRow + 2; y <= posiSumEndRow - 1; y++) {
            if (
              QmExcelUtil.isEmpty(sheet, 'A' + y) &&
              QmExcelUtil.isEmpty(sheet, 'B' + y) &&
              QmExcelUtil.isEmpty(sheet, 'C' + y) &&
              QmExcelUtil.isEmpty(sheet, 'D' + y) &&
              QmExcelUtil.isEmpty(sheet, 'E' + y) &&
              QmExcelUtil.isEmpty(sheet, 'F' + y) &&
              QmExcelUtil.isEmpty(sheet, 'G' + y) &&
              QmExcelUtil.isEmpty(sheet, 'H' + y) &&
              QmExcelUtil.isEmpty(sheet, 'I' + y) &&
              QmExcelUtil.isEmpty(sheet, 'J' + y)
            ) {
              continue
            }
            let checkResult = ''
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmpty(sheet, 'A' + y, '合约')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusInt(sheet, 'B' + y, '买持仓')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusNum(sheet, 'C' + y, '买均价')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusInt(sheet, 'D' + y, '卖持仓')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusNum(sheet, 'E' + y, '卖均价')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusNum(sheet, 'F' + y, '昨结算价')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(
                sheet,
                'G' + y,
                '今结算价'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNum(sheet, 'H' + y, '浮动盈亏')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(
                sheet,
                'I' + y,
                '交易保证金'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checlCellNotEmptyTxtMap(
                sheet,
                'J' + y,
                dataDictFutureHedgeType,
                '投机/套保'
              )
            // if (checkResult !== '') {
            //   posiSumErrorCount++
            // }
            excelData.posiSumList.push({
              derivativeAccount: excelData.account.derivativeAccount,
              tradingDay: excelData.account.tradingDay,
              futuresContractCode: QmExcelUtil.excelCellText(sheet, 'A' + y), // 合约
              longVolume: QmExcelUtil.excelCellNum(sheet, 'B' + y), // 买持仓
              longPrice: QmExcelUtil.excelCellNum(sheet, 'C' + y), // 买均价
              shortVolume: QmExcelUtil.excelCellNum(sheet, 'D' + y), // 卖持仓
              shortPrice: QmExcelUtil.excelCellNum(sheet, 'E' + y), // 卖均价
              preSettlementPrice: QmExcelUtil.excelCellNum(sheet, 'F' + y), // 昨结算价
              settlementPrice: QmExcelUtil.excelCellNum(sheet, 'G' + y), // 今结算价
              positionProfit: QmExcelUtil.excelCellNum(sheet, 'H' + y), // 浮动盈亏
              useMargin: QmExcelUtil.excelCellNum(sheet, 'I' + y), // 交易保证金
              hedgeFlag: QmExcelUtil.excelCellTextMap(
                sheet,
                'J' + y,
                dataDictFutureHedgeType
              ), // 投机/套保
              checkResult: checkResult
            })
          }

          // 持仓明细的sheet页
          let tradeBaseRow = 0 // 【持仓明细】开始行
          let tradeEndRow = 0 // 【持仓明细】结束行
          sheet = data.Sheets['持仓明细']
          ref = QmExcelUtil.excelNumRange(sheet['!ref'])
          for (let y = ref.top; y <= ref.bottom; y++) {
            if (sheet['A' + y] === undefined) {
              continue
            }
            cellTxt = sheet['A' + y].w
            if (tradeBaseRow === 0) {
              if (cellTxt === '持仓明细') {
                tradeBaseRow = y
              }
            } else if (tradeEndRow === 0) {
              if (cellTxt === '合计') {
                tradeEndRow = y
                break
              }
            }
          }
          let tradeErrorCount = 0
          // 根据校验规则校验字段
          for (let y = tradeBaseRow + 2; y <= tradeEndRow - 1; y++) {
            if (
              QmExcelUtil.isEmpty(sheet, 'A' + y) &&
              QmExcelUtil.isEmpty(sheet, 'B' + y) &&
              QmExcelUtil.isEmpty(sheet, 'C' + y) &&
              QmExcelUtil.isEmpty(sheet, 'D' + y) &&
              QmExcelUtil.isEmpty(sheet, 'E' + y) &&
              QmExcelUtil.isEmpty(sheet, 'F' + y) &&
              QmExcelUtil.isEmpty(sheet, 'G' + y) &&
              QmExcelUtil.isEmpty(sheet, 'H' + y) &&
              QmExcelUtil.isEmpty(sheet, 'I' + y) &&
              QmExcelUtil.isEmpty(sheet, 'J' + y) &&
              QmExcelUtil.isEmpty(sheet, 'K' + y) &&
              QmExcelUtil.isEmpty(sheet, 'L' + y)
            ) {
              continue
            }

            let checkResult = ''
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmpty(sheet, 'A' + y, '合约')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmpty(sheet, 'B' + y, '成交序号')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusInt(sheet, 'C' + y, '买持仓')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusNum(sheet, 'D' + y, '买入价')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusInt(sheet, 'E' + y, '卖持仓')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusNum(sheet, 'F' + y, '卖出价')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotMinusNum(sheet, 'G' + y, '昨结算价')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(
                sheet,
                'H' + y,
                '今结算价'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNum(sheet, 'I' + y, '浮动盈亏')

            checkResult =
              checkResult +
              QmExcelUtil.checlCellNotEmptyTxtMap(
                sheet,
                'J' + y,
                dataDictFutureHedgeType,
                '投机/套保'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyDate(sheet, 'L' + y, '实际成交日期')

            // 买持仓与卖持仓不可以同时为空。
            var longVolume = QmExcelUtil.excelCellNum(sheet, 'C' + y) // 买持仓
            var longPrice = QmExcelUtil.excelCellNum(sheet, 'D' + y) // 买入价
            var shortVolume = QmExcelUtil.excelCellNum(sheet, 'E' + y) // 卖持仓
            var shortPrice = QmExcelUtil.excelCellNum(sheet, 'F' + y) // 卖出价
            if (longVolume === '' && shortVolume === '') {
              checkResult += '买持仓与卖持仓不可以同时为空!'
            }
            if (longVolume && shortVolume) {
              checkResult += '买持仓与卖持仓不可以同时有值!'
            }
            if (longVolume !== '' && longPrice === '') {
              checkResult += '输入买持仓时，买入价也必须输入!'
            }
            if (shortVolume !== '' && shortPrice === '') {
              checkResult += '输入卖持仓时，卖出价也必须输入!'
            }
            if (longPrice !== '' && longVolume === '') {
              checkResult += '输入买入价时，买持仓也必须输入!'
            }
            if (shortPrice !== '' && shortVolume === '') {
              checkResult += '输入卖出价时，卖持仓也必须输入!'
            }
            if (checkResult !== '') {
              tradeErrorCount++
            }
            excelData.positionList.push({
              derivativeAccount: excelData.account.derivativeAccount,
              futuresContractCode: QmExcelUtil.excelCellText(sheet, 'A' + y), // 合约
              tradeId: QmExcelUtil.excelCellText(sheet, 'B' + y), // 成交序号
              longVolume: QmExcelUtil.excelCellNum(sheet, 'C' + y), // 买持仓
              longPrice: QmExcelUtil.excelCellNum(sheet, 'D' + y), // 买入价
              shortVolume: QmExcelUtil.excelCellNum(sheet, 'E' + y), // 卖持仓
              shortPrice: QmExcelUtil.excelCellNum(sheet, 'F' + y), // 卖出价
              preSettlementPrice: QmExcelUtil.excelCellNum(sheet, 'G' + y), // 昨结算价
              settlementPrice: QmExcelUtil.excelCellNum(sheet, 'H' + y), // 今结算价
              positionProfit: QmExcelUtil.excelCellNum(sheet, 'I' + y), // 浮动盈亏
              hedgeFlag: QmExcelUtil.excelCellTextMap(
                sheet,
                'J' + y,
                dataDictFutureHedgeType
              ), // 投机/套保
              orderSysId: QmExcelUtil.excelCellText(sheet, 'K' + y), // 交易编码==委托单号
              tradingDay: QmExcelUtil.excelCellDate(sheet, 'L' + y), // 实际成交日期
              checkResult: checkResult
            })
          }
          if (tradeErrorCount > 0) {
            errorFlag = true
            this.$notify.error({
              title: '错误',
              message: '持明细有错误数据。',
              position: 'bottom-right'
            })
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '导入模板错误',
            position: 'bottom-right'
          })
          return
        }
        this.formData = excelData.account
        this.list = excelData.positionList
        this.list1 = excelData.posiSumList
        if (this.list.length !== 0) {
          var arr = []
          for (var it = 0; it < this.list.length; it++) {
            if (it === 0) arr.push(this.list[it])
            let b = false
            if (arr.length > 0 && it > 0) {
              for (var p = 0; p < arr.length; p++) {
                if (
                  arr[p].futuresContractCode ===
                  this.list[it].futuresContractCode &&
                  arr[p].tradeId === this.list[it].tradeId
                ) {
                  b = true // break;
                  arr[p].checkResult +=
                    '持仓明细数据重复(合约代码:' +
                    arr[p].futuresContractCode +
                    ', 成交单号:' +
                    arr[p].tradeId +
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
        this.disabled = errorFlag
        return
      }
      reader.readAsBinaryString(rawFile)
      this.$refs['excel-upload-input'].value = ''
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
          var postData = {
            data: {
              account: this.formData,
              posiList: this.list,
              posiSumList: this.list1
            },
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.import')
          }
          futuresAccountImportInit
            .getImport(postData)
            .then(response => {
              this.$store.dispatch('delVisitedViews', this.$route).then(() => {
                this.$router.push({
                  name: 'futuresAccountImportInit',
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
          this.close()
        })
        .catch(() => { })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'futuresAccountImportInit'
        })
      })
    }
  }
}
</script>
<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
</style>

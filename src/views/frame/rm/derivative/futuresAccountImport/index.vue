<template>
  <div class='app-container edit-page-style'>

    <!-- 每个功能按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" @click='handleUpload' style='margin-right:6px;' :loading="loading">
        <svg-icon icon-class="线性-上传"></svg-icon>{{this.$t('biz.btn.chooseFile')}}
        <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleFile" />
      </el-button>
      <el-button v-db-click size="mini" @click='cancel' style='margin-right:6px;'>
        <svg-icon icon-class="线性-取消"></svg-icon>{{this.$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" @click='saveEdit' style='margin-right:6px;' type='primary' :disabled='disabled'>
        <svg-icon icon-class="线性-保存"></svg-icon>{{this.$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" @click='download' style='margin-right:6px;'>
        <svg-icon icon-class="线性-下载"></svg-icon>{{this.$t('biz.btn.download')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' v-if="!autoMatchFlag" @click="autoMatchFlag = true">
        <svg-icon icon-class="线性-自动匹配"></svg-icon>{{$t('biz.btn.autoMatch')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' v-if="autoMatchFlag" @click="autoMatchFlag = false">
        <svg-icon icon-class="线性-返回"></svg-icon>{{$t('biz.btn.cancelMatch')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' v-if="autoMatchFlag" @click="openDialog('4')">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.byStrategy')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' v-if="autoMatchFlag" @click="openDialog('3')">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.byPlan')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' v-if="autoMatchFlag" @click="openDialog('1')">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.byInstruction')}}
      </el-button>
    </el-row>

    <!-- 头部查询 -->
    <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.mainInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" ref="refForm">
        <el-row :gutter="20" style='width:94%;'>
          <!-- 期货账号 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.derivativeAccount')">
              <input-validate v-model="formData.derivativeAccount" :placeholder="$t('biz.placeholder.input')" disabled></input-validate>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.tradingDay')">
              <el-date-picker v-model="formData.tradingDay" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :picker-options="pickerSignDateBefore" :placeholder="$t('biz.placeholder.dateInput')" disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 客户名称 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.mainName')">
              <input-validate v-model="formData.mainName" :placeholder="$t('biz.placeholder.input')" disabled></input-validate>
            </el-form-item>
          </el-col>
          <!-- 期货公司名称 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.brokerName')">
              <input-validate v-model="formData.brokerName" :placeholder="$t('biz.placeholder.input')" disabled></input-validate>
            </el-form-item>
          </el-col>
          <!-- 上日结存 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.preBalance')">
              <input-formatter v-model="formData.preBalance" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>

          </el-col>
          <!-- 期末权益 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.reserve')">
              <input-formatter v-model="formData.reserve" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 资金存取 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.fundInOut')">
              <input-formatter v-model="formData.fundInOut" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 平仓盈亏 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.closeProfit')">
              <input-formatter v-model="formData.closeProfit" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 手续费 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.commission')">
              <input-formatter v-model="formData.commission" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 当日结存 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.balance')">
              <input-formatter v-model="formData.balance" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 浮动盈亏 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.positionProfit')">
              <input-formatter v-model="formData.positionProfit" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 可用资金 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.available')">
              <input-formatter v-model="formData.available" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 保证金占用 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.posiMargin')">
              <input-formatter v-model="formData.posiMargin" type="thousands" disabled :placeholder="$t('biz.placeholder.input')" :precision='2' :max='999999999999.999999' :min='-9999999999.00' size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 风险度 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountImport.riskDegree')">
              <input-formatter v-model="formData.riskDegree" type="percent" disabled :placeholder="$t('biz.placeholder.input')" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <!-- 列表内容 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-tabs v-model="activeNameTop" type="border-card">
        <el-tab-pane :label="$t('derivative.futuresAccountImport.strategyPlanInstrInfo')" name="strategyPlanInfo">
          <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="200" :element-loading-text="$t('route.load')" :data="detailTable">
            <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
            <el-table-column width="150" :label="$t('derivative.futuresAccountImport.instructionName')" prop="instructionName"></el-table-column>
            <el-table-column width="150" :label="$t('derivative.futuresAccountImport.instructionCode')" prop="instructionCode"></el-table-column>
            <el-table-column width="120" :label="$t('derivative.futuresAccountImport.productCode')" prop="productCode"></el-table-column>
            <el-table-column width="120" :label="$t('derivative.futuresAccountImport.futuresContractCode')" prop="contractCode"></el-table-column>
            <el-table-column align='right' width="120" :label="$t('derivative.futuresAccountImport.noMatchLots')">
              <template slot-scope="scope">
                {{scope.row.noMatchLots | quantityFilter | thousands}}
              </template>
            </el-table-column>
            <el-table-column align='center' width="80" :label="$t('derivative.futuresAccountImport.direction')" prop="direction">
              <template slot-scope="scope">
                <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' width="80" :label="$t('derivative.futuresAccountImport.offsetFlag')" prop="offsetFlag">
              <template slot-scope="scope">
                <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="activeNameBottom" type="border-card">
        <!-- 成交明细 -->
        <el-tab-pane :label="$t('derivative.futuresAccountImport.businessDetails')" name="businessDetails">
          <import-details-tab :detailDatas='list' :tableHeight='tableHeight' :useType='this.$route.params.type'></import-details-tab>
        </el-tab-pane>
        <!-- 持仓汇总 -->
        <el-tab-pane :label="$t('derivative.futuresAccountImport.positionDetails')" name="positionDetails">
          <import-position-tab :detailDatas='list1' :tableHeight='tableHeight' :useType='this.$route.params.type'></import-position-tab>
        </el-tab-pane>
      </el-tabs>
    </main>

    <!-- 底部按钮 -->
    <!-- <footerBar>
      <div class='icon-combine' v-if="!this.$route.query.id">
        <a :href="tempExcelPath" download="期货数据导入模板.xlsx">
          <i class="el-icon-download" title='模板下载'></i>
        </a>
      </div>
      <el-button @click='cancel'>{{ $t('biz.btn.cancel') }}</el-button>
      <el-button v-if="!this.$route.query.id" type='primary' @click="saveEdit" :disabled='disabled'>{{ $t('biz.btn.save') }}</el-button>
    </footerBar> -->
    <strategyPlanDialog v-if="dialogVisible" :strgLevel="strgLevel" @close="dialogClose" @confirm="confirm"></strategyPlanDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import footerBar from '@/components/frame/FooterBar'
import importDetailsTab from '@/views/frame/rm/derivative/components/importDetailsTab'
import importPositionTab from '@/views/frame/rm/derivative/components/importPositionTab'
import * as futuresAccountImport from '@/api/frame/rm/derivative/futuresAccountImport'
import InputFormatter from '@/components/frame/InputFormatter'
import excel_DvtFutureImpData from '@/assets/frame/excel/dvt/DvtFutureImpData.xlsx'
import XLSX from 'xlsx'
import QmExcelUtil from '@/views/frame/rm/derivative/components/ExcelUtil/QmExcelUtil'
import * as futruesImportRecordApi from '@/api/frame/rm/derivative/futruesImportRecord'
import strategyPlanDialog from '@/views/frame/rm/derivative/components/strategyPlanDialog'

export default {
  name: 'futuresAccountImport',
  data() {
    return {
      mainInfoVisible: true,
      autoMatchFlag: false,
      dialogVisible: false,
      strgLevel: '',
      tempExcelPath: excel_DvtFutureImpData,
      activeNameTop: 'strategyPlanInfo',
      activeNameBottom: 'businessDetails',
      loading: false,
      disabled: true,
      list: [], // 成交明细
      list1: [], // 持仓明细
      fileName: '',
      pickerSignDateBefore: {},
      formData: {}, // 基本信息 账号自己
      detailTable: []
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
    // footerBar,
    importDetailsTab,
    importPositionTab,
    InputFormatter,
    strategyPlanDialog
  },
  mounted() {
    if (this.$route.params.id) {
      futruesImportRecordApi
        .getImportData(
          { data: this.$route.params.id },
          {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.view')
          }
        )
        .then(response => {
          this.loading = false
          this.formData = response.data.account
          this.list = response.data.tradeList
          this.list1 = response.data.posiSumList
        })
        .catch(() => {
          this.loading = false
        })
    }
  },
  methods: {
    download() {
      const url = this.tempExcelPath
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '期货数据导入模板.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    // 文件上传
    handleFile(e) {
      if (this.$refs['excel-upload-input'].value === '') {
        return
      }
      this.disabled = true
      this.formData = {}
      this.list = []
      this.list1 = []
      let errorFlag = false
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) {
        this.$refs['excel-upload-input'].value = ''
        return
      }
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
      if (rawFile.size > 1024 * 1024) {
        this.$notify.error({
          title: '错误',
          message: '只可以上传不超过1M的文件',
          position: 'bottom-right'
        })
        this.$refs['excel-upload-input'].value = ''
        return
      }

      const dataDictFutureDirectionType = {}
      this.$t('datadict.futureDirectionType').forEach(
        dataDict =>
          (dataDictFutureDirectionType[dataDict.label] = dataDict.value)
      )
      const dataDictFutureOffsetType = {}
      this.$t('datadict.derivativeOffsetShort').forEach(
        dataDict => (dataDictFutureOffsetType[dataDict.label] = dataDict.value)
      )
      const dataDictFutureHedgeType = {}
      this.$t('datadict.futureHedgeType').forEach(
        dataDict => (dataDictFutureHedgeType[dataDict.label] = dataDict.value)
      )

      const reader = new FileReader()
      reader.onload = e => {
        const data = XLSX.read(e.target.result, { type: 'binary' })
        const excelData = {
          account: {},
          tradeList: [],
          posiSumList: []
        }
        if (
          data.Sheets['客户交易结算日报'] !== undefined &&
          data.Sheets['成交明细'] !== undefined
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
          excelData.account.riskDegree = QmExcelUtil.excelCellText(
            sheet,
            'H' + (accountBaseRow + 8)
          ) // 风险度
          // 期货持仓汇总
          let posiSumErrorCount = 0
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
            if (checkResult !== '') {
              posiSumErrorCount++
            }
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
          if (posiSumErrorCount > 0) {
            errorFlag = true
            this.$notify.error({
              title: '错误',
              message: '持仓汇总有错误数据。',
              position: 'bottom-right'
            })
          }

          let tradeBaseRow = 0 // 【成交明细】开始行
          let tradeEndRow = 0 // 【成交明细】结束行
          sheet = data.Sheets['成交明细']
          ref = QmExcelUtil.excelNumRange(sheet['!ref'])
          for (let y = ref.top; y <= ref.bottom; y++) {
            if (sheet['A' + y] === undefined) {
              continue
            }
            cellTxt = sheet['A' + y].w
            if (tradeBaseRow === 0) {
              if (cellTxt === '成交明细') {
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
              QmExcelUtil.checkCellNotEmptyTime(sheet, 'C' + y, '成交时间')
            checkResult =
              checkResult +
              QmExcelUtil.checlCellNotEmptyTxtMap(
                sheet,
                'D' + y,
                dataDictFutureDirectionType,
                '买/卖'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checlCellNotEmptyTxtMap(
                sheet,
                'E' + y,
                dataDictFutureHedgeType,
                '投机/套保'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(sheet, 'F' + y, '成交价')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusInt(sheet, 'G' + y, '手数')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(sheet, 'H' + y, '成交额')
            checkResult =
              checkResult +
              QmExcelUtil.checlCellNotEmptyTxtMap(
                sheet,
                'I' + y,
                dataDictFutureOffsetType,
                '开/平'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(sheet, 'J' + y, '手续费')
            checkResult =
              checkResult + QmExcelUtil.checkCellNum(sheet, 'K' + y, '平仓盈亏')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyDate(sheet, 'L' + y, '实际成交日期')
            if (checkResult !== '') {
              tradeErrorCount++
            }
            excelData.tradeList.push({
              derivativeAccount: excelData.account.derivativeAccount,
              tradingDay: excelData.account.tradingDay,
              futuresContractCode: QmExcelUtil.excelCellText(sheet, 'A' + y), // 合约
              orderSysId: null, // orderSysId
              tradeId: QmExcelUtil.excelCellText(sheet, 'B' + y), // 成交序号
              tradeTime: QmExcelUtil.excelCellTime(sheet, 'C' + y), // 成交时间
              direction: QmExcelUtil.excelCellTextMap(
                sheet,
                'D' + y,
                dataDictFutureDirectionType
              ), // 买/卖
              hedgeFlag: QmExcelUtil.excelCellTextMap(
                sheet,
                'E' + y,
                dataDictFutureHedgeType
              ), // 投机/套保
              price: QmExcelUtil.excelCellNum(sheet, 'F' + y), // 成交价
              volume: QmExcelUtil.excelCellNum(sheet, 'G' + y), // 手数
              amount: QmExcelUtil.excelCellNum(sheet, 'H' + y), // 成交额
              offsetFlag: QmExcelUtil.excelCellTextMap(
                sheet,
                'I' + y,
                dataDictFutureOffsetType
              ), // 开/平
              commission: QmExcelUtil.excelCellNum(sheet, 'J' + y), // 手续费
              closeProfit: QmExcelUtil.excelCellNum(sheet, 'K' + y), // 平仓盈亏
              tradeDate: QmExcelUtil.excelCellDate(sheet, 'L' + y), // 实际成交日期
              checkResult: checkResult
            })
          }
          if (tradeErrorCount > 0) {
            errorFlag = true
            this.$notify.error({
              title: '错误',
              message: '成交明细有错误数据。',
              position: 'bottom-right'
            })
          }
        } else if (
          data.Sheets['基本信息'] !== undefined &&
          data.Sheets['成交明细'] !== undefined &&
          data.Sheets['持仓汇总'] !== undefined
        ) {
          let sheet = data.Sheets['基本信息']

          // 基本资料
          let errMsg = ''
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmpty(sheet, 'C2', '期货账号')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmpty(sheet, 'C3', '客户名称')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmpty(sheet, 'H3', '期货公司名称')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyDate(sheet, 'H2', '交易日期')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyNum(sheet, 'C4', '上日结存')
          errMsg =
            errMsg +
            QmExcelUtil.checkCellNotEmptyNum(sheet, 'C5', '当日存取合计')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyNum(sheet, 'C6', '平仓盈亏')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyNum(sheet, 'C8', '当日手续费')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyNum(sheet, 'C9', '当日结存')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyNum(sheet, 'C10', '浮动盈亏')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyNum(sheet, 'H9', '保证金占用')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyNum(sheet, 'H10', '可用资金')
          errMsg =
            errMsg + QmExcelUtil.checkCellNotEmptyNum(sheet, 'H4', '客户权益')
          if (errMsg !== '') {
            errorFlag = true
            this.$notify.error({
              title: '错误',
              message: errMsg,
              position: 'bottom-right'
            })
          }
          // 基本信息
          excelData.account.derivativeAccount = QmExcelUtil.excelCellText(
            sheet,
            'C2'
          ) // 期货账号
          excelData.account.mainName = QmExcelUtil.excelCellText(sheet, 'C3') // 客户名称
          excelData.account.brokerName = QmExcelUtil.excelCellText(sheet, 'H3') // 期货公司名称
          excelData.account.tradingDay = QmExcelUtil.excelCellNum(sheet, 'H2') // 交易日期
          excelData.account.preBalance = QmExcelUtil.excelCellNum(sheet, 'C4') // 上日结存
          excelData.account.fundInOut = QmExcelUtil.excelCellNum(sheet, 'C5') // 当日存取合计
          excelData.account.closeProfit = QmExcelUtil.excelCellNum(sheet, 'C6') // 平仓盈亏
          excelData.account.commission = QmExcelUtil.excelCellNum(sheet, 'C8') // 当日手续费
          excelData.account.balance = QmExcelUtil.excelCellNum(sheet, 'C9') // 当日结存
          excelData.account.positionProfit = QmExcelUtil.excelCellNum(
            sheet,
            'C10'
          ) // 浮动盈亏
          excelData.account.posiMargin = QmExcelUtil.excelCellNum(sheet, 'H9') // 保证金占用
          excelData.account.available = QmExcelUtil.excelCellNum(sheet, 'H10') // 可用资金
          excelData.account.reserve = QmExcelUtil.excelCellNum(sheet, 'H4') // 客户权益

          // 成交明细
          sheet = data.Sheets['成交明细']
          let ref = QmExcelUtil.excelNumRange(sheet['!ref'])
          let tradeErrorCount = 0
          for (let y = 3; y <= ref.bottom; y++) {
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
              QmExcelUtil.checkCellNotEmpty(sheet, 'B' + y, '委托单号')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmpty(sheet, 'C' + y, '成交序号')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyTime(sheet, 'D' + y, '成交时间')
            checkResult =
              checkResult +
              QmExcelUtil.checlCellNotEmptyTxtMap(
                sheet,
                'E' + y,
                dataDictFutureDirectionType,
                '买/卖'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checlCellNotEmptyTxtMap(
                sheet,
                'F' + y,
                dataDictFutureHedgeType,
                '投机/套保'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(sheet, 'G' + y, '成交价')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusInt(sheet, 'H' + y, '手数')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(sheet, 'I' + y, '成交额')
            checkResult =
              checkResult +
              QmExcelUtil.checlCellNotEmptyTxtMap(
                sheet,
                'J' + y,
                dataDictFutureOffsetType,
                '开/平'
              )
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyNotMinusNum(sheet, 'K' + y, '手续费')
            checkResult =
              checkResult +
              QmExcelUtil.checkCellNotEmptyDate(sheet, 'L' + y, '实际成交日期')
            if (checkResult !== '') {
              tradeErrorCount++
            }
            excelData.tradeList.push({
              derivativeAccount: excelData.account.derivativeAccount,
              tradingDay: excelData.account.tradingDay,
              futuresContractCode: QmExcelUtil.excelCellText(sheet, 'A' + y), // 合约
              orderSysId: QmExcelUtil.excelCellText(sheet, 'B' + y), // 委托单号
              tradeId: QmExcelUtil.excelCellText(sheet, 'C' + y), // 成交序号
              tradeTime: QmExcelUtil.excelCellTime(sheet, 'D' + y), // 成交时间
              direction: QmExcelUtil.excelCellTextMap(
                sheet,
                'E' + y,
                dataDictFutureDirectionType
              ), // 买/卖
              hedgeFlag: QmExcelUtil.excelCellTextMap(
                sheet,
                'F' + y,
                dataDictFutureHedgeType
              ), // 投机/套保
              price: QmExcelUtil.excelCellNum(sheet, 'G' + y), // 成交价
              volume: QmExcelUtil.excelCellNum(sheet, 'H' + y), // 手数
              amount: QmExcelUtil.excelCellNum(sheet, 'I' + y), // 成交额
              offsetFlag: QmExcelUtil.excelCellTextMap(
                sheet,
                'J' + y,
                dataDictFutureOffsetType
              ), // 开/平
              commission: QmExcelUtil.excelCellNum(sheet, 'K' + y), // 手续费
              closeProfit: null, // 平仓盈亏
              tradeDate: QmExcelUtil.excelCellDate(sheet, 'L' + y), // 实际成交日期
              checkResult: checkResult
            })
          }
          if (tradeErrorCount > 0) {
            errorFlag = true
            this.$notify.error({
              title: '错误',
              message: '成交明细有错误数据。',
              position: 'bottom-right'
            })
          }

          // 持仓汇总
          sheet = data.Sheets['持仓汇总']
          ref = QmExcelUtil.excelNumRange(sheet['!ref'])
          let posiSumErrorCount = 0
          for (let y = 3; y <= ref.bottom; y++) {
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
                '交易保证金'
              )
            if (checkResult !== '') {
              posiSumErrorCount++
            }
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
          if (posiSumErrorCount > 0) {
            errorFlag = true
            this.$notify.error({
              title: '错误',
              message: '持仓汇总有错误数据。',
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
        this.list = excelData.tradeList
        this.list1 = excelData.posiSumList
        this.disabled = errorFlag
        return
      }
      reader.readAsBinaryString(rawFile)
      this.$refs['excel-upload-input'].value = ''
    },
    // 保存
    saveEdit() {
      if (this.autoMatchFlag) {
        if (!this.detailTable || this.detailTable.length === 0) {
          this.$notify.error({
            title: '错误',
            message: this.$t('spotProj.exposure.msg.detailListIsNull'),
            position: 'bottom-right'
          })
          return
        }

        for (let i = 0; i < this.list.length; i++) {
          var data = this.list[i]
          data.instructionCode = this.detailTable[0].instructionCode
          data.instructionDetailId = this.detailTable[0].id
        }
      }

      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          var postData = {
            data: {
              account: this.formData,
              tradeList: this.list,
              posiSumList: this.list1
            },
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.import')
          }
          futuresAccountImport
            .getImport(postData)
            .then(response => {
              this.$store.dispatch('delVisitedViews', this.$route).then(() => {
                this.$router.push({
                  name: this.$route.params.url,
                  params: {
                    refresh: true
                  }
                })
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
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
          this.$store.dispatch('delVisitedViews', this.$route).then(() => {
            this.$router.push({
              name: this.$route.params.url
            })
          })
        })
        .catch(() => {})
    },
    // 关闭
    close() {
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'futruesImportRecord'
        })
      })
    },
    openDialog(strgLevel) {
      this.strgLevel = strgLevel
      this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(data) {
      this.detailTable = []
      this.detailTable.push(data)
      this.dialogVisible = false
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

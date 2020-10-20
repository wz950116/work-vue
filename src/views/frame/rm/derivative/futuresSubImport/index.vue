<template>
  <div class="app-container edit-page-style">

    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <upload-excel-component ref="excel-upload-input" :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('biz.btn.chooseFile')" style='margin-right:6px;' />
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
      <el-form v-if='mainInfoVisible' :inline="true" class="header-form-inline" label-position="left" ref="refForm">
        <el-row :gutter="20">
          <!-- 子账号 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImport.derivativeSubAccount')">
              <input-validate v-model="formData.derivativeSubAccount" :placeholder="$t('biz.placeholder.input')" disabled></input-validate>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImport.tradingDay')">
              <el-date-picker v-model="formData.tradingDay" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :picker-options="pickerSignDateBefore" :placeholder="$t('biz.placeholder.dateInput')" disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 持仓保证金 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImport.posiMargin')">
              <input-formatter v-model="formData.posiMargin" type="thousands" :max='999999999999.999999' :min='0' :precision='2' size="mini" disabled> </input-formatter>
            </el-form-item>
          </el-col>

          <!-- 平仓盈亏 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImport.closeProfit')">
              <input-formatter v-model="formData.closeProfit" type="thousands" :max='999999999999.999999' :min='0' :precision='2' size="mini" disabled> </input-formatter>
            </el-form-item>
          </el-col>
          <!-- 浮动盈亏 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImport.positionProfit')">
              <input-formatter v-model="formData.positionProfit" type="thousands" :max='999999999999.999999' :min='0' :precision='2' size="mini" disabled> </input-formatter>
            </el-form-item>
          </el-col>
          <!-- 手续费 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futureSubImport.commission')">
              <input-formatter v-model="formData.commission" type="thousands" :max='999999999999.999999' :min='0' :precision='2' size="mini" disabled> </input-formatter>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </header>

    <!-- 列表内容 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
      <el-tabs v-model="activeNameTop" type="border-card">
        <el-tab-pane :label="$t('derivative.futuresAccountImport.strategyPlanInstrInfo')" name="strategyPlanInfo">
          <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="200" :element-loading-text="$t('route.load')" :data="detailTable">
            <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
            <el-table-column :width="150" :label="$t('derivative.futuresAccountImport.instructionName')" prop="instructionName"></el-table-column>
            <el-table-column :width="150" :label="$t('derivative.futuresAccountImport.instructionCode')" prop="instructionCode"></el-table-column>
            <el-table-column :width="150" :label="$t('derivative.futuresAccountImport.productCode')" prop="productCode"></el-table-column>
            <el-table-column :width="150" :label="$t('derivative.futuresAccountImport.futuresContractCode')" prop="contractCode"></el-table-column>
            <el-table-column align='right' :width="120" :label="$t('derivative.futuresAccountImport.noMatchLots')">
              <template slot-scope="scope">
                {{scope.row.noMatchLots | quantityFilter | thousands}}
              </template>
            </el-table-column>
            <el-table-column align='center' :width="80" :label="$t('derivative.futuresAccountImport.direction')" prop="direction">
              <template slot-scope="scope">
                <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
              </template>
            </el-table-column>
            <el-table-column align='center' :width="80" :label="$t('derivative.futuresAccountImport.offsetFlag')" prop="offsetFlag">
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
          <import-details-tab :detailDatas='list' :adjustType='adjustType'></import-details-tab>
        </el-tab-pane>
        <!-- 持仓汇总 -->
        <el-tab-pane :label="$t('derivative.futuresAccountImport.positionDetails')" name="positionDetails">
          <import-position-tab :detailDatas='list1'></import-position-tab>
        </el-tab-pane>
      </el-tabs>
    </main>

    <strategyPlanDialog v-if="dialogVisible" :strgLevel="strgLevel" @close="dialogClose" @confirm="confirm"></strategyPlanDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import footerBar from '@/components/frame/FooterBar'
import { parseTime } from '@/utils/frame/base/index'
import UploadExcelComponent from '@/views/frame/rm/derivative/components/UploadExcelMore'
import InputFormatter from '@/components/frame/InputFormatter'
import * as futureSubImport from '@/api/frame/rm/derivative/futuresAccountImport'
import importDetailsTab from '@/views/frame/rm/derivative/components/importDetailsTab'
import importPositionTab from '@/views/frame/rm/derivative/components/importPositionTab'
import {
  datatime, // 转换为hhmmss,不够两位补零
  numFormat, // 上传文件转换为字典码表key值
  toDateFromString, // 验证时间是否有效
  verifyNamber, // 验证是数字
  verifyInteger, // 验证是整数
  verifyTime // 验证时间格式
} from '@/utils/frame/base/validate'
import excel_DvtFutureSubImpData from '@/assets/frame/excel/dvt/DvtFutureSubImpData.xlsx'
import QmExcelUtil from '@/views/frame/rm/derivative/components/ExcelUtil/QmExcelUtil'
import XLSX from 'xlsx'
import strategyPlanDialog from '@/views/frame/rm/derivative/components/strategyPlanDialog'

// 期货子账号期初数据导入
export default {
  name: 'futureSubImport',
  data() {
    return {
      mainInfoVisible: true,
      dialogVisible: false,
      autoMatchFlag: false,
      strgLevel: '',
      tempExcelPath: excel_DvtFutureSubImpData,
      activeNameTop: 'strategyPlanInfo',
      activeNameBottom: 'businessDetails',
      loading: false,
      disabled: true,
      adjustType: 'subImport',
      list: [],
      list1: [],
      pickerSignDateBefore: {
        disabledDate(time) {
          return new Date().getTime() < time.getTime()
        }
      },
      formData: {
        derivativeSubAccount: '',
        tradingDay: '',
        posiMargin: '',
        closeProfit: '',
        balance: '',
        commission: '',
        positionProfit: ''
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  filters: {},
  components: {
    // footerBar,
    InputFormatter,
    importDetailsTab,
    importPositionTab,
    UploadExcelComponent,
    strategyPlanDialog
  },
  mounted() {},
  methods: {
    download() {
      const url = this.tempExcelPath
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '子账号数据导入模板.xlsx')
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
      this.formData = {}
      this.list = []
      this.list1 = []
      let flg = true
      let flg2 = true
      let flg3 = true
      const results1 = data.results1
      const results2 = data.results2
      const results3 = data.results3
      if (
        data.header1.length !== 10 ||
        data.header2.length !== 14 ||
        data.header3.length !== 10 ||
        results1.length !== 3
      ) {
        this.$notify.error({
          title: '错误',
          message: '导入模板错误',
          position: 'bottom-right'
        })
        return
      }
      var nowDate = parseTime(new Date(), '{y}{m}{d}')
      if (results1) {
        for (var j in results1) {
          for (var v in results1[j]) {
            results1[j][v] = results1[j][v].trim()
            if (results1[j][v].indexOf(',') !== -1) {
              results1[j][v] = results1[j][v].replace(/,/g, '')
            }
          }
        }
        // 子账号
        this.formData.derivativeSubAccount = results1[0]['__EMPTY_1'] || ''
        // 交易日期
        this.formData.tradingDay = results1[0]['__EMPTY_6'] || ''

        //  持仓保证金
        this.formData.posiMargin = results1[1]['__EMPTY_1'] || ''
        // 平仓盈亏
        this.formData.closeProfit = results1[1]['__EMPTY_6'] || ''
        // 持仓盈亏
        this.formData.positionProfit = results1[2]['__EMPTY_1'] || ''
        // 当日手续费

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
            msg += this.$t('derivative.futuresAccountImport.' + i) + '不能为空!'
          }
        }
        if (msg !== '') {
          this.$notify.error({
            title: '错误',
            message: msg,
            position: 'bottom-right'
          })
          flg = false
          return
        }
        for (var index in this.formData) {
          const ele = this.formData[index]

          if (index === 'tradingDay' && ele !== '') {
            if (ele < nowDate) {
              this.$notify.error({
                title: '错误',
                message: '如果需要维护历史数据，请使用子账号数据调整单',
                position: 'bottom-right'
              })
              flg = false
              return
            }
            if (!toDateFromString(this.formData.tradingDay)) {
              this.$notify.error({
                title: '错误',
                message: '交易日期不是有效的日期',
                position: 'bottom-right'
              })
              flg = false
              return
            }
          }
          if (
            (index === 'closeProfit' && ele !== '' && !verifyNamber(ele)) ||
            (index === 'positionProfit' && ele !== '' && !verifyNamber(ele))
          ) {
            this.$notify.error({
              title: '错误',
              message:
                this.$t('derivative.futuresAccountImport.' + index) +
                '不是有效的数组',
              position: 'bottom-right'
            })
            flg = false
            return
          }
          if (
            (index === 'posiMargin' && ele !== '' && !verifyInteger(ele)) ||
            (index === 'commission' && ele !== '' && !verifyInteger(ele))
          ) {
            this.$notify.error({
              title: '错误',
              message:
                this.$t('derivative.futuresAccountImport.' + index) +
                '不是大于等于0的数组',
              position: 'bottom-right'
            })
            flg = false
            return
          }
        }
      }
      if (results2.length !== 0) {
        flg2 = false
        this.disabled = false
        results2.forEach(element => {
          var objDown = {}
          for (var j in element) {
            element[j] = element[j].trim()
            if (element[j].indexOf(',') !== -1) {
              element[j] = element[j].replace(/,/g, '')
            }
          }
          objDown.derivativeAccount = element['期货账号'] || ''
          objDown.derivativeSubAccount = element['子账号'] || ''
          objDown.futuresContractCode = element['合约'] || ''
          objDown.orderSysId = element['委托单号'] || ''
          objDown.direction = element['买/卖'] || ''
          objDown.offsetFlag = element['开/平'] || ''
          objDown.price = element['成交价'] || ''
          objDown.volume = element['手数'] || ''
          objDown.amount = element['成交额'] || ''
          objDown.commission = element['手续费'] || ''
          objDown.tradeTime = element['成交时间'] || ''
          objDown.tradeDate = element['成交日期'] || ''
          objDown.hedgeFlag = element['投机/套保'] || ''
          objDown.tradeId = element['成交单号'] || ''
          objDown.tradingDay = this.formData.tradingDay
          if (objDown.tradeDate !== '') {
            objDown.tradeDate = parseTime(objDown.tradeDate, '{y}{m}{d}')
          }
          // 方向
          objDown.direction = numFormat(
            objDown.direction,
            this.$t('datadict.futuresDirection')
          )

          // 开平
          objDown.offsetFlag = numFormat(
            objDown.offsetFlag,
            this.$t('datadict.offset')
          )
          // 投机套保
          objDown.hedgeFlag = numFormat(
            objDown.hedgeFlag,
            this.$t('datadict.futureHedgeType')
          )
          objDown.checkResult = ''
          for (var i in objDown) {
            const ele = objDown[i]
            // 验证不为空
            if (
              i !== 'orderSysId' &&
              i !== 'checkResult' &&
              i !== 'derivativeAccount' &&
              (ele === undefined || ele === '')
            ) {
              objDown.checkResult +=
                this.$t('derivative.futuresAccountImport.' + i) +
                '存在空值' +
                ','
            }
            if (
              (i === 'price' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'volume' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'amount' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'commission' && ele !== '' && !verifyNamber(ele))
            ) {
              objDown.checkResult +=
                this.$t('derivative.futuresAccountImport.' + i) +
                '不是数字' +
                ','
            }
            // 验证是整数
            if (i === 'volume' && ele !== '') {
              if (ele % 1 !== 0) {
                objDown.checkResult +=
                  this.$t('derivative.futuresAccountImport.' + i) +
                  '不是整数' +
                  ','
              } else {
                objDown.volume = parseFloat(ele).toString()
              }
            }

            if (i === 'tradeTime' && ele !== '') {
              if (!verifyTime(ele)) {
                objDown.checkResult +=
                  this.$t('derivative.futuresAccountImport.' + i) +
                  '时间格式不正确' +
                  ','
              } else {
                objDown.tradeTime = datatime(ele)
              }
            }
            if (i === 'tradeDate' && ele !== '') {
              if (!toDateFromString(ele)) {
                objDown.checkResult +=
                  this.$t('derivative.futuresAccountImport.' + i) +
                  '不是有效日期' +
                  ','
              }
            }
            if (
              (i === 'direction' &&
                ele !== '' &&
                (ele !== '2' && ele !== '1')) ||
              (i === 'offsetFlag' &&
                ele !== '' &&
                (ele !== '0' && ele !== '1')) ||
              (i === 'hedgeFlag' && ele !== '' && (ele !== '1' && ele !== '3'))
            ) {
              objDown.checkResult +=
                this.$t('derivative.futuresAccountImport.' + i) +
                '的值不正确' +
                ','
            }
          }
          this.list.push(objDown)
        })
      } else {
        flg2 = true
      }
      if (results3.length !== 0) {
        flg3 = false
        this.disabled = false
        results3.forEach(element => {
          for (var j in element) {
            element[j] = element[j].trim()
            if (element[j].indexOf(',') !== -1) {
              element[j] = element[j].replace(/,/g, '')
            }
          }
          var objpos = {}
          objpos.futuresContractCode = element['合约'] || ''
          objpos.longVolume = element['买持仓'] || ''
          objpos.longPrice = element['买均价'] || ''
          objpos.shortVolume = element['卖持仓'] || ''
          objpos.shortPrice = element['卖均价'] || ''
          objpos.preSettlementPrice = element['昨结算价'] || ''
          objpos.settlementPrice = element['今结算价'] || ''
          objpos.positionProfit = element['浮动盈亏'] || ''
          objpos.useMargin = element['交易保证金'] || ''
          objpos.hedgeFlag = element['投机/套保']
          // 投机套保
          objpos.hedgeFlag = numFormat(
            objpos.hedgeFlag,
            this.$t('datadict.futureHedgeType')
          )
          objpos.checkResult = ''
          for (var i in objpos) {
            const ele = objpos[i]
            // 验证不为空
            if (
              (i === 'futuresContractCode' &&
                (ele === undefined || ele === '')) ||
              (i === 'settlementPrice' && (ele === undefined || ele === '')) ||
              (i === 'positionProfit' && (ele === undefined || ele === '')) ||
              (i === 'useMargin' && (ele === undefined || ele === '')) ||
              (i === 'hedgeFlag' && (ele === undefined || ele === ''))
            ) {
              objpos.checkResult +=
                this.$t('derivative.futuresAccountImport.' + i) +
                '存在空值' +
                ','
            }
            // 验证是d大于0 数字
            if (
              (i === 'preSettlementPrice' &&
                ele !== '' &&
                !verifyNamber(ele)) ||
              (i === 'settlementPrice' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'positionProfit' && ele !== '' && !verifyNamber(ele))
            ) {
              objpos.checkResult +=
                this.$t('derivative.futuresAccountImport.' + i) +
                '不是数字' +
                ','
            }
            if (
              (i === 'longVolume' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'longPrice' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'shortVolume' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'shortPrice' && ele !== '' && !verifyInteger(ele)) ||
              (i === 'useMargin' && ele !== '' && !verifyInteger(ele))
            ) {
              objpos.checkResult +=
                this.$t('derivative.futuresAccountImport.' + i) +
                '不是大于或等于0的数字' +
                ','
            }

            // 验证是整数
            if (
              (i === 'longVolume' && ele !== '') ||
              (i === 'shortVolume' && ele !== '')
            ) {
              if (ele % 1 !== 0) {
                objpos.checkResult +=
                  this.$t('derivative.futuresAccountImport.' + i) +
                  '不是整数' +
                  ','
              }
            }
            if (i === 'longVolume' && ele !== '') {
              objpos.longVolume = parseFloat(objpos.longVolume).toString()
            }
            if (i === 'shortVolume' && ele !== '') {
              objpos.shortVolume = parseFloat(objpos.shortVolume).toString()
            }
            if (
              i === 'hedgeFlag' &&
              ele !== '' &&
              (ele !== '1' && ele !== '3')
            ) {
              objpos.checkResult +=
                this.$t('derivative.futuresAccountImport.' + i) +
                '的值不正确' +
                ','
            }
            // 关联检查
            if (
              (i = 'longVolume' && Number(ele) > 0) &&
              (i = 'longPrice' && Number(ele) <= 0)
            ) {
              objpos.checkResult += '买持仓与买均价必须同时输入,'
            }
            if (
              (i = 'shortVolume' && Number(ele) > 0) &&
              (i = 'shortPrice' && Number(ele) <= 0)
            ) {
              objpos.checkResult += '卖持仓与卖均价必须同时输入,'
            }
          }
          this.list1.push(objpos)
        })
      } else {
        flg3 = true
      }
      if (flg) {
        if (flg2 && flg3) {
          this.disabled = false
        } else if (flg2 && !flg3) {
          this.list1.forEach(p => {
            if (p.checkResult.length !== 0) {
              // 打开保存按钮
              this.disabled = true
            }
          })
        } else if (!flg2 && flg3) {
          this.list.forEach(p => {
            if (p.checkResult.length !== 0) {
              // 打开保存按钮
              this.disabled = true
            }
          })
        } else if (!flg2 && !flg3) {
          this.list.forEach(t => {
            this.list1.forEach(p => {
              if (t.checkResult.length !== 0 || p.checkResult.length !== 0) {
                // 打开保存按钮
                this.disabled = true
              }
            })
          })
        }
      }
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
          futureSubImport
            .save(postData)
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

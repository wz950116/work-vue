<template>
  <!-- 调整单选择数据弹窗 -->
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='app-container dialog-container' type='formTableDialog' style="padding: 0;">
      <!-- 头部 -->
      <title-contain :titleName='$t("derivative.futuresAccountAdjust.dialogTitle")' @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <!-- 内容 -->
      <header style='border-radius:5px;'>
        <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <!-- 交易日期 -->
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futuresAccountAdjust.tradingDay')" prop="tradingDay">
                <el-date-picker v-model="listQuery.data.tradingDay" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :picker-options="pickerSignDateBefore" :placeholder="$t('biz.placeholder.dateInput')"></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- 合约 -->
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futuresAccountAdjust.futuresContractCode')" prop='futuresContractCode'>
                <el-select v-model="listQuery.data.futuresContractCode" clearable filterable :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="(item, index) in futureCodeList" :key="index" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 成交单号 -->
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futuresAccountAdjust.tradeId')" prop='tradeId'>
                <input-validate v-model="listQuery.data.tradeId" :placeholder="$t('biz.placeholder.input')" :disabled='true'></input-validate>
              </el-form-item>
            </el-col>
            <!-- 方向 -->
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futuresAccountAdjust.direction')" prop='direction'>
                <el-select v-model="listQuery.data.direction" clearable filterable :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="(item, index) in $t('datadict.futuresDirection')" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 开平 -->
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futuresAccountAdjust.offsetFlag')" prop='offsetFlag'>
                <el-select v-model="listQuery.data.offsetFlag" clearable filterable :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="(item, index) in $t('datadict.derivativeOffsetShort')" :key="index" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 右侧搜索按钮 -->
          <div class="search-btn" v-permission="['query']">
            <el-button type="primary" @click="onSubmit" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
        </el-form>
      </header>
      <!-- 列表内容 -->
      <main>
        <el-tabs v-model="activeName" type="border-card">
          <!-- 历史数据 -->
          <el-tab-pane :label="$t('derivative.futuresAccountAdjust.historyDate')" name="historyDate">
            <el-table :data="waitData" stripe v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" border class='table-content tb-edit' ref="multipleTable" style="border:1px solid" height='400' highlight-current-row @row-click="handleCurrent" @selection-change="handleSelectionChange">
              <el-table-column align='center' type="index" fixed="left" width="50" label=' '></el-table-column>
              <el-table-column type="selection" fixed="left" width="42"></el-table-column>
              <!-- 交易日期 -->
              <el-table-column align='center' prop='tradingDay' :label="$t('derivative.futuresAccountAdjust.tradingDay')" min-width='200' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.tradingDay | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 期货账号 -->
              <el-table-column prop='derivativeAccount' :label="$t('derivative.futuresAccountAdjust.derivativeAccount')" min-width='160' show-overflow-tooltip v-if="useType === 'accountAdjust'"></el-table-column>
              <el-table-column prop='derivativeSubAccount' :label="$t('derivative.futuresSubAdjust.derivativeSubAccount')" min-width='160' show-overflow-tooltip v-if="useType === 'subAdjust'"></el-table-column>
              <!-- 合约 -->
              <el-table-column prop='futuresContractCode' :label="$t('derivative.futuresAccountAdjust.futuresContractCode')" min-width='200' show-overflow-tooltip></el-table-column>
              <!-- 成交单号 -->
              <!-- 方向 -->
              <el-table-column prop='direction' :label="$t('derivative.futuresAccountAdjust.direction')" min-width='200' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
                </template>
              </el-table-column>
              <!-- 开/平 -->
              <el-table-column prop='offsetFlag' :label="$t('derivative.futuresAccountAdjust.offsetFlag')" min-width='200' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.futureOffsetType'))}}</span>
                </template>
              </el-table-column>
              <!-- 价格 -->
              <el-table-column align='right' prop='price' :label="$t('derivative.futuresAccountAdjust.price')" min-width='200' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.price | numFilter(2) | thousandth}}</span>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column align='right' prop='volume' :label="$t('derivative.futuresAccountAdjust.volume')" min-width='200' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.volume | numFilter(3)}}</span>
                </template>
              </el-table-column>
              <!-- 成交金额 -->
              <el-table-column align="right" prop='amount' :label="$t('derivative.futuresAccountAdjust.amount')" min-width='200' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.amount | numFilter(2) | thousandth}}</span>
                </template>
              </el-table-column>
              <!-- 手续费 -->
              <el-table-column align='right' prop='commission' :label="$t('derivative.futuresAccountAdjust.commission')" min-width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.commission | numFilter(2) | thousandth}}</span>
                </template>
              </el-table-column>
              <!-- 成交时间 -->
              <el-table-column align='center' prop='tradeTime' :label="$t('derivative.futuresAccountAdjust.tradeTime')" min-width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.tradeTime | dateFormat('HH:mm:ss')}}</span>
                </template>
              </el-table-column>
              <!-- 成交日期 -->
              <el-table-column align='center' prop='tradeDate' :label="$t('derivative.futuresAccountAdjust.tradeDate')" min-width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.tradeDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 投机/套保 -->
              <el-table-column prop='hedgeFlag' :label="$t('derivative.futuresAccountAdjust.hedgeFlag')" min-width='120' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
                </template>
              </el-table-column>
              <!-- 委托单号 -->
              <el-table-column align="right" prop='orderSysId' :label="$t('derivative.futuresAccountAdjust.orderSysId')" min-width='120' show-overflow-tooltip>
              </el-table-column>
              <!-- 客户名称 -->
              <el-table-column align="center" prop='mainName' :label="$t('derivative.futuresAccountAdjust.mainName')" min-width='180' show-overflow-tooltip>
              </el-table-column>
              <!-- 数据来源 -->
              <el-table-column align="center" prop='dataSourceType' :label="$t('derivative.futuresAccountAdjust.dataSourceType')" min-width='180' show-overflow-tooltip>
                <template slot-scope="scope ">
                  <span>{{scope.row.dataSourceType | dataDictFormat($t('datadict.futureDataSourceType'))}}</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 底部按钮 -->
            <div class='bottom-operate'>
              <div class="bottom-operate-left" v-show='emptyTextVisible'>
                <svg-icon icon-class="线性-惊叹号"></svg-icon>
                {{$t('table.emptyText')}}
              </div>
              <!-- 分页 -->
              <el-pagination small background layout="total, sizes, prev, pager, next, jumper"
                             :current-page="listQuery.current"
                             :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total"
                             @size-change="handleSizeChange"
                             @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </main>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click='cancel' v-db-click size="mini">{{ $t('biz.btn.cancel') }}</el-button>
        <el-button type="primary" @click="nextClick" v-db-click size="mini">{{ $t('biz.btn.exportData') }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import TitleContain from '@/components/frame/TitleContain'
import elementFun from '@/utils/frame/base/elementFun'
import * as futuresAccountAdjust from '@/api/frame/rm/derivative/futuresAccountAdjust'
// import { dateFormate } from '@/utils/frame/base/index'

export default {
  name: 'creditEdit',
  data() {
    return {
      // 是否显示暂无数据
      emptyTextVisible: true,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      pickerSignDateBefore: {},
      type: this.$route.query.type,
      activeName: 'historyDate',
      futureCodeList: [],
      multipleSelection: [],
      loading: false,
      status: false,
      total: null,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          futuresContractCode: '',
          direction: '',
          derivativeAccount: this.myDetailData,
          offsetFlag: '',
          derivativeSubAccount: this.myDetailData,
          tradingDay: '',
          tradeId: ''
        }
      },
      rules: {
        tradingDay: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ]
      },
      waitData: [],
      selectData: ''
    }
  },
  props: ['myDetailData', 'useType'],
  components: {
    TitleContain
  },

  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  mounted() {
    // 查询期货合约列表
    futuresAccountAdjust
      .listFuturesContractCode()
      .then(response => {
        this.futureCodeList = response.data
      })
      .catch(() => {})
  },
  methods: {
    ...elementFun,
    // 页码跳转
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    getList() {
      // element验证参数
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          const params = {
            data: this.listQuery.data,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search')
          }
          if (this.useType === 'accountAdjust') {
            futuresAccountAdjust
              .listTrade(params)
              .then(response => {
                this.loading = false
                this.waitData = response.data
                this.total = response.total
                if (this.total && this.total > 0) {
                  this.emptyTextVisible = false
                } else {
                  this.emptyTextVisible = true
                }
              })
              .catch(() => {
                this.loading = false
              })
          } else if (this.useType === 'subAdjust') {
            futuresAccountAdjust
              .listTradeSub(params)
              .then(response => {
                this.loading = false
                this.waitData = response.data
                this.total = response.total
                if (this.total && this.total > 0) {
                  this.emptyTextVisible = false
                } else {
                  this.emptyTextVisible = true
                }
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    // 处理勾选后
    handleSelectionChange(val) {
      this.selectData = val
      // 通过操作dom更改选中行底色
      this.$nextTick(() => {
        if (!this.$refs.multipleTable) return
        $(this.$refs.multipleTable.$el)
          .find('.el-table__row td')
          .removeClass('select-row-bg-color')
        $(this.$refs.multipleTable.$el)
          .find('.is-checked')
          .parents('.el-table__row')
          .find('td')
          .addClass('select-row-bg-color')
      })
    },
    nextClick() {
      if (this.selectData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('tableColSet.noCheckTip')
          })
        )
        return
      }
      this.$emit('closeHandlerDialog', this.selectData)
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
        .catch(() => {})
    }
  }
}
</script>

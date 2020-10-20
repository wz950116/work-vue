<!-- 导入页面成交明细tab -->
<template>
  <div>
    <!-- 成交明细 -->
    <el-table :data="detailData" height='260' stripe border v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" class='table-content' ref="multipleTable" highlight-current-row @row-click="handleCurrent" @selection-change="handleSelectionChange">
      <el-table-column type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
      <!-- 期货账号 -->
      <el-table-column prop='derivativeAccount' :label="$t('derivative.futuresAccountImport.derivativeAccount')" width='120' show-overflow-tooltip v-if="adjustType === 'subImport'"></el-table-column>
      <!-- 子账号 -->
      <el-table-column prop='derivativeSubAccount' :label="$t('derivative.futureSubImport.derivativeSubAccount')" width='120' show-overflow-tooltip v-if="adjustType === 'subImport'"></el-table-column>
      <!-- 交易日期 -->
      <!-- <el-table-column prop='tradingDay' align='center' :label="$t('derivative.futuresAccountImport.tradingDay')" width='140' show-overflow-tooltip v-if="adjustType === 'subImport'">
        <template slot-scope='scope'>
          <span>{{scope.row.tradingDay | dateFormat}}</span>
        </template>
      </el-table-column> -->
      <!-- 合约 -->
      <el-table-column prop='futuresContractCode' :label="$t('derivative.futuresAccountImport.futuresContractCode')" width='120' show-overflow-tooltip></el-table-column>
      <!-- 委托单号 -->
      <el-table-column prop='orderSysId' :label="$t('derivative.futuresAccountImport.orderSysId')" width='120' show-overflow-tooltip></el-table-column>
      <!-- 成交单号 -->
      <el-table-column prop='tradeId' :label="$t('derivative.futuresAccountImport.tradeId')" width='120' show-overflow-tooltip></el-table-column>
      <!-- 成交时间 -->
      <el-table-column align='center' prop='tradeTime' :label="$t('derivative.futuresAccountImport.tradeTime')" width='100' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.tradeTime | dateFormat('HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <!-- 买/卖 -->
      <el-table-column align="center" prop='direction' :label="$t('derivative.futuresAccountImport.direction')" width='80' show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!isNaN(scope.row.direction)">{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
          <span v-else>{{scope.row.direction}}</span>
        </template>
      </el-table-column>
      <!-- 开/平 -->
      <el-table-column align="center" prop='offsetFlag' :label="$t('derivative.futuresAccountImport.offsetFlag')" width='80' show-overflow-tooltip v-if="adjustType === 'subImport'">
        <template slot-scope="scope">
          <span v-if="!isNaN(scope.row.offsetFlag)">{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
          <span v-else>{{scope.row.offsetFlag }}</span>
        </template>
      </el-table-column>
      <!-- 投机/套保 -->
      <el-table-column align="center" prop='hedgeFlag' :label="$t('derivative.futuresAccountImport.hedgeFlag')" width='100' show-overflow-tooltip v-if="adjustType !== 'subImport'">
        <template slot-scope="scope">
          <span v-if="!isNaN(scope.row.hedgeFlag)">{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
          <span v-else>{{scope.row.hedgeFlag }}</span>
        </template>
      </el-table-column>
      <!-- 成交价 -->
      <el-table-column align='right' prop='price' :label="$t('derivative.futuresAccountImport.price')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.price ===''">{{scope.row.price}}</span>
          <span v-else>{{scope.row.price | numFilter(2) | thousands}}</span>
        </template>
      </el-table-column>
      <!-- 手数 -->
      <el-table-column align='right' prop='volume' :label="$t('derivative.futuresAccountImport.volume')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.volume }}</span>
        </template>
      </el-table-column>
      <!-- 成交额 -->
      <el-table-column align='right' prop='amount' :label="$t('derivative.futuresAccountImport.amount')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.amount ===''">{{scope.row.amount }}</span>
          <span v-else>{{scope.row.amount |numFilter(2) | thousands }}</span>
        </template>
      </el-table-column>
      <!-- 开/平 -->
      <el-table-column align="center" prop='offsetFlag' :label="$t('derivative.futuresAccountImport.offsetFlag')" width='80' show-overflow-tooltip v-if="adjustType !== 'subImport'">
        <template slot-scope="scope">
          <span v-if="!isNaN(scope.row.offsetFlag)">{{scope.row.offsetFlag | dataDictFormat($t('datadict.derivativeOffsetShort'))}}</span>
          <span v-else>{{scope.row.offsetFlag }}</span>
        </template>
      </el-table-column>
      <!-- 手续费 -->
      <el-table-column align='right' prop='commission' :label="$t('derivative.futuresAccountImport.commission')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.commission ===''">{{scope.row.commission }}</span>
          <span v-else>{{scope.row.commission |numFilter(2) | thousands }}</span>
        </template>
      </el-table-column>
      <!-- 投机/套保 -->
      <el-table-column align="center" prop='hedgeFlag' :label="$t('derivative.futuresAccountImport.hedgeFlag')" width='100' show-overflow-tooltip v-if="adjustType === 'subImport'">
        <template slot-scope="scope">
          <span v-if="!isNaN(scope.row.hedgeFlag)">{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
          <span v-else>{{scope.row.hedgeFlag }}</span>
        </template>
      </el-table-column>
      <!-- 成交日期 -->
      <el-table-column align='center' prop='tradeDate' :label="$t('derivative.futuresAccountImport.tradeDate')" width='100' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.tradeDate | dateFormat }}</span>
        </template>
      </el-table-column>
      <!-- 交易日期 -->
      <el-table-column prop='tradingDay' align='center' :label="$t('derivative.futuresAccountImport.tradingDay')" width='100' show-overflow-tooltip v-if="adjustType !== 'subImport'">
        <template slot-scope='scope'>
          <span>{{scope.row.tradingDay | dateFormat}}</span>
        </template>
      </el-table-column>
      <!-- 检查结果 -->
      <el-table-column v-if="this.useType!='view'" prop='checkResult' :label="$t('derivative.futuresAccountImport.checkResult')" width='160' show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import elementFun from '@/utils/frame/base/elementFun'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      loading: false,
      // 调整单明细
      detailData: []
    }
  },
  props: ['id', 'adjustType', 'detailDatas', 'useType'],

  components: {},
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  watch: {
    detailDatas(value) {
      this.detailData = value
    }
  },
  mounted() {},
  methods: {
    ...elementFun
  }
}
</script>

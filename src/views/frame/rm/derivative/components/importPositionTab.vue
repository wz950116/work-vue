<!-- 导入页面持仓汇总tab -->
<template>
  <div>
    <!-- 持仓汇总 -->
    <el-table :data="detailData" height="260" class='table-content' stripe border v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" ref="multipleTable" highlight-current-row @row-click="handleCurrent" @selection-change="handleSelectionChange">
      <el-table-column type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
      <!-- 合约 -->
      <el-table-column prop='futuresContractCode' :label="$t('derivative.futuresAccountImport.futuresContractCode')" width='120' show-overflow-tooltip></el-table-column>

      <!-- 买持仓 -->
      <el-table-column align='right' prop='longVolume' :label="$t('derivative.futuresAccountImport.longVolume')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.longVolume}}</span>
        </template>
      </el-table-column>
      <!-- 买均价 -->
      <el-table-column align='right' prop='longPrice' :label="$t('derivative.futuresAccountImport.longPrice')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.longPrice === ''">{{scope.row.longPrice }}</span>
          <span v-else>{{scope.row.longPrice | numFilter(2) | thousands}}</span>
        </template>
      </el-table-column>
      <!-- 卖持仓 -->
      <el-table-column align='right' prop='shortVolume' :label="$t('derivative.futuresAccountImport.shortVolume')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.shortVolume}}</span>
        </template>
      </el-table-column>
      <!-- 卖均价 -->
      <el-table-column align='right' prop='shortPrice' :label="$t('derivative.futuresAccountImport.shortPrice')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.shortPrice === ''">{{scope.row.shortPrice}}</span>
          <span v-else>{{scope.row.shortPrice |numFilter(2) | thousands }}</span>
        </template>
      </el-table-column>
      <!-- 昨结算价 -->
      <el-table-column align='right' prop='preSettlementPrice' :label="$t('derivative.futuresAccountImport.preSettlementPrice')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.preSettlementPrice === ''">{{scope.row.preSettlementPrice }}</span>
          <span v-else>{{scope.row.preSettlementPrice |numFilter(2) | thousands }}</span>
        </template>
      </el-table-column>
      <!-- 今结算价 -->
      <el-table-column align='right' prop='settlementPrice' :label="$t('derivative.futuresAccountImport.settlementPrice')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.settlementPrice === ''">{{scope.row.settlementPrice }}</span>
          <span v-else>{{scope.row.settlementPrice |numFilter(2) | thousands }}</span>
        </template>
      </el-table-column>
      <!-- 浮动盈亏 -->
      <el-table-column align='right' prop='positionProfit' :label="$t('derivative.futuresAccountImport.positionProfit')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.positionProfit === ''">{{scope.row.positionProfit }}</span>
          <span v-else>{{scope.row.positionProfit |numFilter(2) | thousands }}</span>
        </template>
      </el-table-column>
      <!-- 交易保证金 -->
      <el-table-column align='right' prop='useMargin' :label="$t('derivative.futuresAccountImport.useMargin')" width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.useMargin === ''">{{scope.row.useMargin}}</span>
          <span v-else>{{scope.row.useMargin |numFilter(2) | thousands }}</span>
        </template>
      </el-table-column>
      <!-- 投机/套保 -->
      <el-table-column align="center" prop='hedgeFlag' :label="$t('derivative.futuresAccountImport.hedgeFlag')" width='100' show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!isNaN(scope.row.hedgeFlag)">{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
          <span v-else>{{scope.row.hedgeFlag }}</span>
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

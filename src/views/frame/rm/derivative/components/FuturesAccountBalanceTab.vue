<template>
  <main>
    <el-table stripe border v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" class='table-content' ref="multipleTable" :data="tableData" :height='tableHeight' @row-click="handleCurrent" @selection-change="handleSelectionChange">
      <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
      <!-- 期货账号	-->
      <el-table-column prop='derivativeAccount' :label="$t('derivative.futuresAccountBalance.derivativeAccount')" min-width='180'></el-table-column>
      <!-- 交易日期	-->
      <el-table-column align='center' prop='tradingDay' :label="$t('derivative.futuresAccountBalance.tradingDay')" min-width='100'>
        <template slot-scope='scope'>
          <span>{{scope.row.tradingDay | dateFormat}}</span>
        </template>
      </el-table-column>
      <!-- 上日结存	-->
      <el-table-column align="right" prop='preBalance' :label="$t('derivative.futuresAccountBalance.preBalance')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.preBalance | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 资金存取	-->
      <el-table-column align="right" prop='fundInOut' :label="$t('derivative.futuresAccountBalance.fundInOut')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.fundInOut | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 平仓盈亏	-->
      <el-table-column align="right" prop='closeProfit' :label="$t('derivative.futuresAccountBalance.closeProfit')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.closeProfit | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 持仓盈亏	-->
      <el-table-column align="right" prop='positionProfit' :label="$t('derivative.futuresAccountBalance.positionProfit')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.positionProfit | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 手续费	-->
      <el-table-column align="right" prop='commission' :label="$t('derivative.futuresAccountBalance.commission')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.commission | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 持仓保证金	-->
      <el-table-column align="right" prop='posiMargin' :label="$t('derivative.futuresAccountBalance.posiMargin')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.posiMargin | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 可用资金	-->
      <el-table-column align="right" prop='available' :label="$t('derivative.futuresAccountBalance.available')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.available | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 期末权益	-->
      <el-table-column align="right" prop='balance' :label="$t('derivative.futuresAccountBalance.balance')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.balance | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 当日结存	-->
      <el-table-column align="right" prop='reserve' :label="$t('derivative.futuresAccountBalance.reserve')" min-width='150' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.reserve | numFilter(2) | thousandth}}</span>
        </template>
      </el-table-column>
      <!-- 客户名称	-->
      <el-table-column prop='mainName' :label="$t('derivative.futuresAccountBalance.mainName')" min-width='180'></el-table-column>
      <!-- 期初标志	-->
      <el-table-column prop='preliminaryFlag' align='center' :label="$t('spotProj.cost.list.preliminaryFlag')" min-width='100' show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.preliminaryFlag | dataDictFormat($t('datadict.yesNo'))}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class='mainContainer'>
      <!-- 分页 -->
      <el-pagination background class="PageTions" layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import elementFun from '@/utils/frame/base/elementFun'
import { getList } from '@/api/frame/rm/derivative/futuresAccountBalance'
export default {
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      loading: false,
      tableData: [],
      total: 0,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          tradingDayFrom: '',
          tradingDayTo: '',
          derivativeAccount: '',
          preliminaryFlag: '1'
        },
        sorString: ''
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1355
        ? this.clientHeight - 180
        : this.clientHeight - 210 // 防止底部滚动条遮挡
    }
  },
  watch: {},
  components: {},
  mounted() {
    // 初始化数据
    this.getList()
  },
  methods: {
    ...elementFun,
    // 列表请求
    getList() {
      this.loading = true
      getList(this.listQuery, this.func)
        .then(response => {
          this.tableData = response.data
          this.loading = false
          this.total = response.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 页码跳转
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    }
  }
}
</script>

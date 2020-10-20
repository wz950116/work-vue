<template>
  <main>
    <el-table stripe border v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" class='table-content' ref="multipleTable" :data="tableData" :height='tableHeight' @row-click="handleCurrent" @selection-change="handleSelectionChange">
      <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
      <!-- 交易日期 -->
      <el-table-column align='center' prop='tradingDay' :label="$t('derivative.futuresAccountTrade.tradingDay')" min-width='100'>
        <template slot-scope='scope'>
          <span>{{scope.row.tradingDay | dateFormat}}</span>
        </template>
      </el-table-column>
      <!-- 期货账号 -->
      <el-table-column prop='derivativeAccount' :label="$t('derivative.futuresAccountTrade.derivativeAccount')" min-width='180'></el-table-column>
      <!-- 合约 -->
      <el-table-column prop='futuresContractCode' :label="$t('derivative.futuresAccountTrade.futuresContractCode')" min-width='90'></el-table-column>
      <!-- 委托单号 -->
      <el-table-column prop='orderSysId' :label="$t('derivative.futuresAccountTrade.orderSysId')" min-width='150'></el-table-column>
      <!-- 方向 -->
      <el-table-column align='center' prop='direction' :label="$t('derivative.futuresAccountTrade.direction')" min-width='90'>
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <!-- 开平 -->
      <el-table-column align='center' prop='offsetFlag' :label="$t('derivative.futuresAccountTrade.offsetFlag')" min-width='90'>
        <template slot-scope="scope">
          <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.futureOffsetType'))}}</span>
        </template>
      </el-table-column>
      <!-- 价格 -->
      <el-table-column align="right" prop='price' :label="$t('derivative.futuresAccountTrade.price')" min-width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.price | priceFilter | thousands}}</span>
        </template>
      </el-table-column>
      <!-- 数量 -->
      <el-table-column align="right" prop='volume' :label="$t('derivative.futuresAccountTrade.volume')" min-width='120' show-overflow-tooltip></el-table-column>
      <!-- 成交金额 -->
      <el-table-column align="right" prop='amount' :label="$t('derivative.futuresAccountTrade.amount')" min-width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.amount | moneyFilter | thousands}}</span>
        </template>
      </el-table-column>
      <!-- 手续费 -->
      <el-table-column align="right" prop='commission' :label="$t('derivative.futuresAccountTrade.commission')" min-width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.commission | moneyFilter | thousands}}</span>
        </template>
      </el-table-column>
      <!-- 成交时间 -->
      <el-table-column align='center' prop='tradeTime' :label="$t('derivative.futuresAccountTrade.tradeTime')" min-width='90'>
        <template slot-scope='scope'>
          <span>{{scope.row.tradeTime | dateFormat('HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <!-- 成交日期 -->
      <el-table-column align='center' prop='tradeDate' :label="$t('derivative.futuresAccountTrade.tradeDate')" min-width='100'>
        <template slot-scope='scope'>
          <span>{{scope.row.tradeDate | dateFormat}}</span>
        </template>
      </el-table-column>
      <!-- 投机/套保 -->
      <el-table-column align='center' prop='hedgeFlag' :label="$t('derivative.futuresAccountTrade.hedgeFlag')" min-width='90'>
        <template slot-scope="scope">
          <span>{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
        </template>
      </el-table-column>
      <!-- 成交单号 -->
      <el-table-column prop='tradeId' :label="$t('derivative.futuresAccountTrade.tradeId')" min-width='150'></el-table-column>
      <!-- 客户名称 -->
      <el-table-column prop='mainName' :label="$t('derivative.futuresAccountTrade.mainName')" min-width='180'></el-table-column>
      <!-- 数据来源 -->
      <el-table-column align='center' prop='dataSourceType' :label="$t('derivative.futuresAccountTrade.dataSourceType')" min-width='120'>
        <template slot-scope="scope">
          <span>{{scope.row.dataSourceType | dataDictFormat($t('datadict.futureDataSourceType'))}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class='bottom-operate'>
      <!-- 分页 -->
      <el-pagination small background class="PageTions" layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList } from '@/api/frame/rm/derivative/futuresAccountTrade'
import elementFun from '@/utils/frame/base/elementFun'
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
        total: 0,
        sorString: '',
        data: {
          dataSourceType: 'I',
          preliminaryFlag: '1'
        }
      },
      defaultSortString: 'tradeDate.desc'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1355 ? this.clientHeight - 164 : this.clientHeight - 194 // 防止底部滚动条遮挡
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
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

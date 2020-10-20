<!-- 期货账号数据调整单查看/期货子账号数据调整单(调整单明细)(调整前数据)(调整后数据) -->
<template>
  <div>
    <!-- 调整单明细 -->
    <el-table :height="tableHeight" :data="detailData" stripe v-loading="loading"
      :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.1)" border class='table-content tb-edit' ref="multipleTable"
      style="border:1px solid" highlight-current-row @row-click="handleCurrent"
      @selection-change="handleSelectionChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label="$t('table.id')"></el-table-column>
      <!-- <el-table-column type="selection" fixed="left" width="42"></el-table-column> -->
      <!-- 调整类型 -->
      <el-table-column align='center' prop='adjustType' :label="$t('derivative.futuresAccountAdjust.adjustType')"
        width='100' show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            v-if="scope.row.adjustType==='A' ||scope.row.adjustType==='D'||scope.row.adjustType==='U'||scope.row.adjustType==='O'">{{scope.row.adjustType | dataDictFormat($t('datadict.dvtAdjustType'))}}</span>
          <span v-else>{{ scope.row.adjustType }}</span>
        </template>
      </el-table-column>
      <!-- 交易日期 -->
      <el-table-column align='center' prop='tradingDay' :label="$t('derivative.futuresAccountAdjust.tradingDay')"
        width='100' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.tradingDay | dateFormat}}</span>
        </template>
      </el-table-column>
      <!-- 期货账号 -->
      <el-table-column prop='derivativeAccount' :label="$t('derivative.futuresAccountAdjust.derivativeAccount')"
        width='120' show-overflow-tooltip></el-table-column>
      <!--子账号  -->
      <el-table-column prop='derivativeSubAccount' :label="$t('derivative.futuresSubAdjust.derivativeSubAccount')"
        width='120' show-overflow-tooltip v-if="useType === 'subAdjust'"></el-table-column>
      <!-- 合约 -->
      <el-table-column prop='futuresContractCode' :label="$t('derivative.futuresAccountAdjust.futuresContractCode')"
        width='120' show-overflow-tooltip></el-table-column>
      <!-- 成交单号 -->
      <el-table-column prop='tradeId' :label="$t('derivative.futuresAccountAdjust.tradeId')" width='120'
        show-overflow-tooltip></el-table-column>
      <!-- 方向 -->
      <el-table-column align='center' prop='direction' :label="$t('derivative.futuresAccountAdjust.direction')"
        width='80' show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            v-if="!isNaN(scope.row.direction)">{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
          <span v-else>{{scope.row.direction}}</span>
        </template>
      </el-table-column>
      <!-- 开/平 -->
      <el-table-column align='center' prop='offsetFlag' :label="$t( 'derivative.futuresAccountAdjust.offsetFlag') "
        width='80' show-overflow-tooltip>
        <template slot-scope="scope ">
          <span
            v-if="!isNaN(scope.row.offsetFlag)">{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
          <span v-else>{{scope.row.offsetFlag}}</span>
        </template>
      </el-table-column>
      <!-- 价格 -->
      <el-table-column align='right' prop='price' :label="$t( 'derivative.futuresAccountAdjust.price') " width='120'
        show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.price === ''">{{scope.row.price }}</span>
          <span v-else>{{scope.row.price | numFilter(2) | thousands}}</span>
          <!-- <input-formatter v-show="adjustTypes !=='view' " v-model='scope.row.price' :max='999999999999.9999' :min='0' :precision='2' :controls='false' type='thousands' size='mini'></input-formatter> -->
        </template>
      </el-table-column>
      <!-- 数量 -->
      <el-table-column align='right' prop='volume' :label="$t( 'derivative.futuresAccountAdjust.volume') " width='120'
        show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.volume }}</span>
          <!-- <input-formatter v-show="adjustTypes !=='view' " v-model='scope.row.volume' :max='999999999999.9999' :min='0' :precision='3' :controls='false' type='thousands' size='mini'></input-formatter> -->
        </template>
      </el-table-column>
      <!-- 成交金额 -->
      <el-table-column align="right " prop='amount' :label="$t( 'derivative.futuresAccountAdjust.amount') " width='120'
        show-overflow-tooltip>
        <template slot-scope="scope ">
          <span v-if="scope.row.amount===''">{{scope.row.amount }}</span>
          <span v-else>{{scope.row.amount | numFilter(2) | thousands}}</span>
          <!-- <input-formatter v-show="adjustTypes !=='view' " v-model='scope.row.amount' :max='999999999999.9999' :min='0' :precision='2' :controls='false' type='thousands' size='mini'></input-formatter> -->
        </template>
      </el-table-column>
      <!-- 手续费 -->
      <el-table-column align='right' prop='commission' :label="$t( 'derivative.futuresAccountAdjust.commission') "
        width='120' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span v-if="scope.row.commission===''">{{scope.row.commission}}</span>
          <span v-else>{{scope.row.commission | numFilter(2) | thousands}}</span>
          <!-- <input-formatter v-show="adjustTypes !=='view' " v-model='scope.row.commission' :max='999999999999.9999' :min='0' :precision='6' :controls='false' type='thousands' size='mini'></input-formatter> -->
        </template>
      </el-table-column>
      <!-- 成交时间 -->
      <el-table-column align='center' prop='tradeTime' :label="$t( 'derivative.futuresAccountAdjust.tradeTime') "
        width='100' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.tradeTime | dateFormat('HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <!-- 成交日期 -->
      <el-table-column align='center' prop='tradeDate' :label="$t( 'derivative.futuresAccountAdjust.tradeDate') "
        width='100' show-overflow-tooltip>
        <template slot-scope='scope'>
          <span>{{scope.row.tradeDate | dateFormat}}</span>
        </template>
      </el-table-column>
      <!-- 投机/套保 -->
      <el-table-column align='center' prop='hedgeFlag' :label="$t( 'derivative.futuresAccountAdjust.hedgeFlag') "
        width='100' show-overflow-tooltip>
        <template slot-scope="scope ">
          <span
            v-if="!isNaN(scope.row.hedgeFlag)">{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
          <span v-else>{{scope.row.hedgeFlag}}</span>
        </template>
      </el-table-column>
      <!-- 委托单号 -->
      <el-table-column prop='orderSysId' :label="$t( 'derivative.futuresAccountAdjust.orderSysId') " width='120'
        show-overflow-tooltip>
      </el-table-column>
      <!-- 客户名称 -->
      <el-table-column prop='mainName' :label="$t( 'derivative.futuresAccountAdjust.mainName') " width='120'
        show-overflow-tooltip>
      </el-table-column>
      <!-- 数据来源 -->
      <el-table-column align="center " prop='dataSourceType'
        :label="$t( 'derivative.futuresAccountAdjust.dataSourceType') " width='100' show-overflow-tooltip>
        <template slot-scope="scope ">
          <span>{{scope.row.dataSourceType | dataDictFormat($t('datadict.futureDataSourceType'))}}</span>
        </template>
      </el-table-column>
      <!-- 检查结果 -->
      <el-table-column prop='checkResult' :label="$t( 'derivative.futuresAccountAdjust.checkResult') " width='160'
        show-overflow-tooltip v-if="adjustTypes !=='view' ">
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
      flg: true,
      loading: false,
      // 调整单明细
      detailData: []
    }
  },
  props: ['id', 'adjustTypes', 'detailDatas', 'useType', 'disabled'],

  components: {},
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1355
        ? this.clientHeight - 240
        : this.clientHeight - 270 // 防止底部滚动条遮挡
    }
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

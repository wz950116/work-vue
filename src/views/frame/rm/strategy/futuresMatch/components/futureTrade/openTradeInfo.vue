<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;' v-if="['add', 'update'].includes(optType)">
      <el-button v-db-click size="mini" @click="addRow" v-if="openTradeVisible">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="openTradeVisible">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
      </el-button>
    </div>
    <el-table stripe border class='table-content tb-edit' ref="futureTradeInfo" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :height="150" :element-loading-text="$t('route.load')" :data="tableData" @current-change="tableChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column :label="$t('strategy.futureMatch.tab.matchLots')" width="120">
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.matchLots" :max="scope.row.canMatchLots" type="thousands" size="mini" @change="matchChange"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.futureMatch.tab.canMatchLots')" width="120" prop="canMatchLots"></el-table-column>
      <el-table-column width="100" :label="$t('derivative.futuresAccountTrade.tradingDay')" prop="tradingDay"></el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.derivativeAccount')" prop="derivativeAccount"></el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.futuresContractCode')" prop="futuresContractCode"></el-table-column>
      <el-table-column align="center" width="100" :label="$t('derivative.futuresAccountTrade.orderSysId')" prop="orderSysId">
      </el-table-column>
      <el-table-column align="center" width="80" :label="$t('derivative.futuresAccountTrade.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="80" :label="$t('derivative.futuresAccountTrade.offsetFlag')" prop="offsetFlag">
        <template slot-scope="scope">
          <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.futureOffsetType'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('derivative.futuresAccountTrade.price')" prop="price">
        <template slot-scope="scope">
          {{scope.row.price | priceFilter | thousands}}
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.volume')" prop="volume">
        <template slot-scope="scope">
          {{scope.row.volume | quantityFilter | thousands}}
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.amount')" prop="amount">
        <template slot-scope="scope">
          {{scope.row.amount | moneyFilter | thousands}}
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.commission')" prop="commission">
        <template slot-scope="scope">
          {{scope.row.commission | moneyFilter | thousands}}
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.hedgeFlag')" prop="hedgeFlag">
        <template slot-scope="scope">
          <span>{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.tradeId')" prop="tradeCode"></el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.mainName')" prop="mainName"></el-table-column>
      <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.dataSourceType')" prop="dataSourceType">
        <template slot-scope="scope">
          <span>{{scope.row.dataSourceType | dataDictFormat($t('datadict.futureDataSourceType'))}}</span>
        </template>
      </el-table-column>

    </el-table>

    <openTradeDialog v-if="dialogVisible" :productCode='productCode' :direction='_direction' :offsetFlag='offsetFlag' :contractCode='contractCode' @close="dialogClose" @confirm="confirm" :tradeNature='tradeNature'></openTradeDialog>
  </div>
</template>

<script>
import openTradeDialog from '@/views/frame/rm/strategy/futuresMatch/components/futureTrade/openTradeDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    openTradeDialog
  },
  data() {
    return {
      size: 'mini',
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      productCode: '',
      _direction: '',
      offsetFlag: ''
    }
  },

  mounted() {
    // 渲染表格数据
    this.getEditData()
  },
  props: {
    openTradeVisible: {
      type: Boolean,
      default: false
    },
    contractCode: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    optType: {
      type: String,
      default: ''
    },
    relationList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    relationList(newId) {
      if (newId) this.getEditData()
    }
  },
  mounted() {
    this.getEditData()
  },
  methods: {
    // 获取初始化数据
    getEditData() {
      if (this.relationList) {
        this.tableData = this.relationList
      }
    },
    addRow() {
      this.offsetFlag = '0'
      if (this.direction === '1') {
        this._direction = '2'
      } else {
        this._direction = '1'
      }

      this.dialogVisible = true
    },
    deleteRow() {
      if (!this.selectedRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.tableData.splice(this.tableData.indexOf(this.selectedRow), 1)
      this.selectedRow = null
      this.syncData()
    },
    tableChange(val) {
      this.selectedRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(datas) {
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i]
        data.id = null
        data.tenantCode = null
        data.matchLots = data.canMatchLots
        var containsFlag = true
        this.tableData.forEach(element => {
          if (element.tradeId === data.tradeId) {
            containsFlag = false
          }
        })
        if (containsFlag) {
          this.tableData.push(data)
        }
      }
      this.dialogVisible = false
      this.syncData()
    },
    matchChange() {
      this.syncData()
    },
    syncData() {
      this.$emit('syncData', this.tableData)
    }
  }
}
</script>

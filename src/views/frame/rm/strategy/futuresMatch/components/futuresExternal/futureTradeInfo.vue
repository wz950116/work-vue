<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;' v-if="['add', 'update'].includes(optType)">
      <el-button v-db-click size="mini" @click="addRow">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
      </el-button>
    </div>
    <el-table stripe border class='table-content tb-edit' ref="futureTradeInfo" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :height="150" :element-loading-text="$t('route.load')" :data="tableData" @current-change="tableChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column :label="$t('strategy.futureMatch.tab.matchLots')" width="120">
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.matchLots" type="thousands" size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.futureMatch.tab.canMatchLots')" width="120" prop="canMatchLots"></el-table-column>
      <el-table-column width="100" :label="$t('derivative.externalTrade.tradingDay')" prop="tradingDay"></el-table-column>
      <el-table-column width="120" :label="$t('derivative.externalTrade.derivativeAccount')" prop="derivativeAccount"></el-table-column>
      <el-table-column width="120" :label="$t('derivative.externalTrade.futuresContractCode')" prop="futuresContractCode"></el-table-column>
      <el-table-column align="center" width="100" :label="$t('derivative.externalTrade.tradeId')" prop="tradeId"></el-table-column>
      <el-table-column align="center" width="80" :label="$t('derivative.externalTrade.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="80" :label="$t('derivative.externalTrade.price')" prop="price">
        <template slot-scope="scope">
          {{scope.row.price | priceFilter | thousands}}
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('derivative.externalTrade.volume')" prop="volume">
        <template slot-scope="scope">
          {{scope.row.volume | priceFilter | thousands}}
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('derivative.externalTrade.commission')" prop="commission">
        <template slot-scope="scope">
          {{scope.row.commission | quantityFilter | thousands}}
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('derivative.externalTrade.adjustFee')" prop="adjustFee">
        <template slot-scope="scope">
          {{scope.row.adjustFee | moneyFilter | thousands}}
        </template>
      </el-table-column>
    </el-table>

    <futureTradeDialog v-if="dialogVisible" :productCode='productCode' :direction='direction' :contractCode='contractCode' @close="dialogClose" @confirm="confirm" :tradeNature='tradeNature'></futureTradeDialog>
  </div>
</template>

<script>
import futureTradeDialog from '@/views/frame/rm/strategy/futuresMatch/components/futuresExternal/futureTradeDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    futureTradeDialog
  },
  data() {
    return {
      size: 'mini',
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      productCode: '',
      contractCode: '',
      direction: '',
      offsetFlag: ''
    }
  },

  mounted() {
    // 渲染表格数据
    this.getEditData()
  },
  props: {
    tradeNature: {
      type: String,
      default: ''
    },
    optType: {
      type: String,
      default: ''
    },
    tradeList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    tradeList(newId) {
      if (newId) this.getEditData()
    }
  },
  methods: {
    // 获取初始化数据
    getEditData() {
      this.tableData = this.tradeList
    },
    addRow() {
      this.dialogVisible = true
      if (this.tradeNature === '1') {
        this.productCode = this.$parent.$parent.$parent.$refs.strategyInfo.$refs.strategyInfo1.tableData[0].productCode
        this.contractCode = this.$parent.$parent.$parent.$refs.strategyInfo.$refs.strategyInfo1.tableData[0].contractCode
      }
      if (this.tradeNature === '2') {
        this.productCode = this.$parent.$parent.$parent.$refs.planInfo.$refs.strategyInfo1.tableData[0].productCode
        this.contractCode = this.$parent.$parent.$parent.$refs.planInfo.$refs.strategyInfo1.tableData[0].contractCode
      }
      if (this.tradeNature === '3') {
        this.productCode = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].productCode
        this.contractCode = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].contractCode
        this.direction = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].direction
        this.offsetFlag = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].offsetFlag
      }
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
    }
  }
}
</script>

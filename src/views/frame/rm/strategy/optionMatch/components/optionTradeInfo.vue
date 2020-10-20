<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
      </el-button>
    </div>
    <el-table stripe border height="150" class='table-content' ref="futureTradeInfo" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" @current-change="tableChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column :label="$t('strategy.optionMatch.list.matchLots')" width="120">
        <template slot-scope="scope">
          <input-formatter :max='scope.row.noMatchLots' :precision='0' v-model="scope.row.matchLots" type="thousands" size="mini" @change="e => changeMatchLots(e, scope.row)"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column align="right" width="100" :label="$t('strategy.optionMatch.list.noMatchLots')" prop="noMatchLots"></el-table-column>
      <el-table-column :label="$t('strategy.optionMatch.list.contractCode')" width="240" prop="optionContract"></el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.optionMatch.list.optionOffset')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.optionOffset | dataDictFormat($t('datadict.optionOffset'))}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" :label="$t('strategy.optionMatch.list.currencyName')" prop="currencyName"></el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.optionMatch.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.optionMatch.list.callPut')" prop="callPut">
        <template slot-scope="scope">
          <span>{{scope.row.callPut | dataDictFormat($t('datadict.callPut'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.optionMatch.list.strikePrice')" prop="strikePrice">
        <template slot-scope='scope'>
          <span>{{scope.row.strikePrice | priceFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.optionMatch.list.price')" prop="price">
        <template slot-scope='scope'>
          <span>{{scope.row.price | priceFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.optionMatch.list.volume')" prop="volume">
        <template slot-scope='scope'>
          <span>{{scope.row.volume | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.optionMatch.list.counterpartyName')" width="120" prop="counterpartyName"></el-table-column>
      <el-table-column :label="$t('strategy.optionMatch.list.derivativeAccount')" width="120" prop="derivativeAccount"></el-table-column>
      <el-table-column align="center" width="120" :label="$t('strategy.optionMatch.list.tradingDay')" prop="tradingDay">
        <template slot-scope='scope'>
          <span>{{scope.row.tradingDay | dateFormat}}</span>
        </template>
      </el-table-column>
    </el-table>
    <optionTradeDialog v-if="dialogVisible" :instructionInfo='instructionInfo' @closeHandlerDialog="dialogClose" @confirm="confirm"></optionTradeDialog>
  </div>
</template>

<script>
import optionTradeDialog from '@/views/frame/rm/strategy/optionMatch/components/optionTradeDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    optionTradeDialog
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      instructionInfo: {}
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
      if (this.$parent.$parent.$parent.$refs.instructionInfo.tableData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.optionMatch.msg.instDetailEmpty')
          })
        )
        return
      }
      this.instructionInfo = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0]
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
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        this.tableData.splice(this.tableData.indexOf(this.selectedRow), 1)
        this.selectedRow = null
        this.changeMatchLots()
      })
    },
    tableChange(val) {
      this.selectedRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(datas) {
      var tradeIds = []
      this.tableData.forEach(e => {
        tradeIds.push(e.tradeId)
      })
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i]
        if (tradeIds.includes(data.tradeId)) {
          continue
        }
        data.id = null
        data.tenantCode = null
        data.noMatchLots = parseInt(data.volume) - parseInt(!data.matchLots ? 0 : data.matchLots)
        data.matchLots = 0
        this.tableData.push(data)
      }
      this.dialogVisible = false
      this.changeMatchLots()
    },
    changeMatchLots(value, row) {
      var lots = 0
      this.tableData.forEach(e => {
        if (e === row) {
          lots = parseInt(lots) + parseInt(value)
        } else {
          lots = parseInt(lots) + parseInt(e.matchLots)
        }
      })
      this.$emit('changeMatch', lots)
    }
  }
}
</script>

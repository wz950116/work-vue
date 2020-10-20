<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
      </el-button>
    </div>
    <el-table stripe border class='table-content' ref="futureTradeInfo" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :height="height" :element-loading-text="$t('route.load')" :data="tableData" @current-change="tableChange">
      <el-table-column width="120" :label="$t('strategy.simpleMatch.list.matchLots')" prop="matchLots">
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.matchLots" :min="0" :max="scope.row.noMatchLots" size="mini" @change="e => lotsChange(e,scope.row)"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.simpleMatch.list.matchQuantity')" prop="matchQuantity">
        <template slot-scope='scope'>
          <span>{{scope.row.matchQuantity | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.simpleMatch.list.noMatchLots')" prop="noMatchLots">
        <template slot-scope='scope'>
          <span>{{scope.row.noMatchLots | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.simpleMatch.list.orderSysId')" prop="orderSysId"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.simpleMatch.list.futuresContractCode')" prop="futuresContractCode"></el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.simpleMatch.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.simpleMatch.list.offsetFlag')" prop="offsetFlag">
        <template slot-scope="scope">
          <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.simpleMatch.list.price')" prop="price">
        <template slot-scope='scope'>
          <span>{{scope.row.price | priceFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.simpleMatch.list.derivativeAccount')" prop="derivativeAccount"></el-table-column>
    </el-table>
    <futuresTradeDialog v-if="dialogVisible" @close="dialogClose" @confirm="confirm"></futuresTradeDialog>
  </div>
</template>

<script>
import futuresTradeDialog from '@/views/frame/rm/derivative/components/futuresTradeDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    futuresTradeDialog
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      direction: '',
      contractCode: '',
      offset: ''
    }
  },
  props: {
    strategyCode: {
      type: String,
      default: ''
    },
    height: Number,
    spotFlag: Boolean,
    spotDirection: String
  },
  methods: {
    addRow() {
      if (!this.spotFlag) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.simpleMatch.msg.spotNotSelect')
          })
        )
        return
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
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        this.tableData.splice(this.tableData.indexOf(this.selectedRow), 1)
        this.selectedRow = null
        this.futuresQuantityChange()
      })
    },
    tableChange(val) {
      this.selectedRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(datas) {
      for (let i = 0; i < datas.length; i++) {
        if (this.spotDirection === '1') {
          if (datas[i].direction === '1' && datas[i].offsetFlag === '0') {
            this.$notify(
              notifyInfo({
                msg: this.$t('strategy.simpleMatch.msg.buyCantMatch')
              })
            )
            return
          }
        } else {
          if (datas[i].direction === '2' && datas[i].offsetFlag === '0') {
            this.$notify(
              notifyInfo({
                msg: this.$t('strategy.simpleMatch.msg.sellCantMatch')
              })
            )
            return
          }
        }
      }
      var tradeIds = []
      for (let i = 0; i < this.tableData.length; i++) {
        tradeIds.push(this.tableData[i].tradeId)
      }
      for (let i = 0; i < datas.length; i++) {
        var data = datas[i]
        if (tradeIds.includes(data.id)) {
          continue
        }
        data.tradeId = data.id
        data.id = null
        data.tenantCode = null
        data.matchLots = data.noMatchLots
        data.matchQuantity = data.noMatchLots * data.contractMultiplier
        this.tableData.push(data)
      }
      this.futuresQuantityChange()
      this.dialogVisible = false
    },
    lotsChange(newValue, row) {
      if (newValue > row.noMatchLots) {
        newValue = row.noMatchLots
      }
      row.matchQuantity = newValue * row.contractMultiplier
      this.futuresQuantityChange()
    },
    futuresQuantityChange() {
      var quantity = 0
      for (var i = 0; i < this.tableData.length; i++) {
        const e = this.tableData[i]
        if (e.direction === '1') {
          quantity -= parseInt(e.matchQuantity)
        } else {
          quantity += parseInt(e.matchQuantity)
        }
      }
      if (this.spotDirection === '2') {
        quantity = -quantity
      }
      this.$emit('changeQuantity', quantity)
    }
  }
}
</script>

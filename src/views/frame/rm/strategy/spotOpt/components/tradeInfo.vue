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

    <el-table stripe border height="150" class='table-content' ref="singleTable" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" @current-change="selectChange">
      <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
      <el-table-column width="120" :label="$t('strategy.spotOpt.list.optQuantity')" prop="optQuantity">
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.optQuantity" :min='0' :max='scope.row.noOptQuantity * 1' type='thousands' :precision='3' size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.spotOpt.list.noOptQuantity')" prop="noOptQuantity">
        <template slot-scope='scope'>
          <span>{{scope.row.noOptQuantity | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.spotOpt.list.contractNo')" prop="contractNo"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.spotOpt.list.documentNo')" prop="documentNo"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.spotOpt.list.productName')" prop="productName"></el-table-column>
      <el-table-column align='center' width="80" :label="$t('strategy.spotOpt.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.spotDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align='right' width="120" :label="$t('strategy.spotOpt.list.matchQuantity')" prop="matchQuantity">
        <template slot-scope='scope'>
          <span>{{scope.row.matchQuantity | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column align='right' width="120" :label="$t('strategy.spotOpt.list.price')" prop="price">
        <template slot-scope='scope'>
          <span>{{scope.row.matchQuantity | priceFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column width="90" :label="$t('strategy.spotOpt.list.unitCode')" prop="unitCode">
        <template slot-scope="scope">
          <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.spotOpt.list.customerName')" prop="customerName"></el-table-column>
    </el-table>

    <tradeDetailDialog v-if="dialogVisible" :strategyCode="strategyCode" :direction="direction" @close="dialogClose" @confirm="confirm"></tradeDetailDialog>
  </div>
</template>

<script>
import tradeDetailDialog from '@/views/frame/rm/strategy/spotOpt/components/tradeDetailDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    tradeDetailDialog
  },
  data() {
    return {
      tableData: [],
      currentRow: null,
      dialogVisible: false
    }
  },
  mounted() {},
  props: {
    strategyCode: {
      type: String,
      default: ''
    },
    direction: String,
    height: {
      type: Number,
      default: 200
    }
  },
  methods: {
    addRow() {
      if (this.strategyCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotOpt.msg.noStrategyCode')
          })
        )
        return
      }
      this.dialogVisible = true
    },
    deleteRow() {
      if (!this.currentRow) {
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
      })
        .then(() => {
          this.tableData.splice(this.tableData.indexOf(this.currentRow), 1)
          this.currentRow = null
        })
        .catch(() => {})
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(datas) {
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i]
        data.matchDetailId = data.id
        data.id = null
        data.optQuantity = 0
        this.tableData.push(data)
      }
      this.dialogVisible = false
    },
    selectChange(val) {
      this.currentRow = val
    }
  }
}
</script>

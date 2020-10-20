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
    <el-table stripe border class='table-content' ref="futureTradeInfo" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :height="150" :element-loading-text="$t('route.load')" :data="tableData" @current-change="tableChange">
      <el-table-column width="120" :label="$t('strategy.futuresSpotMatch.list.orderSysId')" prop="orderSysId"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.futuresSpotMatch.list.futuresContractCode')" prop="futuresContractCode"></el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.futuresSpotMatch.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.futuresSpotMatch.list.offsetFlag')" prop="offsetFlag">
        <template slot-scope="scope">
          <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.futuresSpotMatch.list.matchLots')" prop="matchLots"></el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.futuresSpotMatch.list.price')" prop="price"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.futuresSpotMatch.list.derivativeAccount')" prop="derivativeAccount"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.futuresSpotMatch.list.derivativeSubAccount')" prop="derivativeSubAccount"></el-table-column>
    </el-table>
    <futuresTradeDialog v-if="dialogVisible" :strategyCode="strategyCode" :titleName="$t('strategy.futuresSpotMatch.tab.futuresTradeDialog')" @close="dialogClose" @confirm="confirm"></futuresTradeDialog>
  </div>
</template>

<script>
import futuresTradeDialog from '@/views/frame/rm/strategy/futuresSpotMatch/components/futuresTradeDialog'
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

  mounted() {
    // 渲染表格数据
    this.getEditData()
  },
  props: {
    strategyCode: {
      type: String,
      default: ''
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
      if (this.strategyCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.futuresSpotMatch.msg.strategyCodeEmpty')
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
        if (tradeIds.includes(data.id)) {
          continue
        }
        data.matchTradeDetailId = data.id
        data.id = null
        data.tenantCode = null
        this.tableData.push(data)
      }
      this.dialogVisible = false
    }
  }
}
</script>

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

    <spotArbitrageDetail :tableData="tableData" :match="true" v-if="strategyNature==='3'" @select="selectedData"></spotArbitrageDetail>
    <spotUnilateralDetail :tableData="tableData" :match="true" v-if="strategyNature==='5'" @select="selectedData"></spotUnilateralDetail>
    <hedgeDetail :tableData="tableData" :match="true" v-if="['1','6'].includes(strategyNature)" @select="selectedData"></hedgeDetail>

    <tradeDetailDialog v-if="dialogVisible" :strategyNature="strategyNature" :planCode="planCode" :tradeNature="tradeNature" :title="$t('strategy.spotTrade.dialog.strategyDetail')" @close="dialogClose" @confirm="confirm"></tradeDetailDialog>
  </div>
</template>

<script>
import tradeDetailDialog from '@/views/frame/rm/strategy/spotTrade/components/tradeDetailDialog'
import hedgeDetail from '@/views/frame/rm/strategy/spotTrade/components/hedgeDetail'
import spotArbitrageDetail from '@/views/frame/rm/strategy/spotTrade/components/spotArbitrageDetail'
import spotUnilateralDetail from '@/views/frame/rm/strategy/spotTrade/components/spotUnilateralDetail'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    tradeDetailDialog,
    hedgeDetail,
    spotArbitrageDetail,
    spotUnilateralDetail
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      selectedRow: null,
      dialogVisible: false
    }
  },
  mounted() {

  },
  props: {
    strategyNature: String,
    planCode: String,
    tradeNature: String
  },
  methods: {
    addRow() {
      if (this.planCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotTrade.msg.parentFirst')
          })
        )
        return
      }
      if (this.tableData.length === 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.spotTrade.msg.detailLimit')
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
      this.tableData.splice(this.tableData.indexOf(this.selectedRow), 1)
      this.selectedRow = null
    },
    tableChange(val) {
      this.selectedRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(val) {
      val.detailId = val.id
      val.id = null
      val.tenantCode = null
      this.tableData.push(val)
      this.dialogVisible = false
    },
    selectedData(val) {
      this.selectedRow = val
    }
  }
}
</script>

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

    <futuresSpotHedge v-if="['1','6'].includes(strategyNature)" :match="true" :tableData="tableData" @select="selectedData" :tradeNature="'2'"></futuresSpotHedge>
    <spotHedge v-if=" strategyNature==='3'" :match=" true" :tableData="tableData" @select="selectedData"></spotHedge>
    <spotSingle v-if="strategyNature === '5'" :match="true" :tableData="tableData" @select="selectedData"></spotSingle>

    <tradeDetailDialog v-if="dialogVisible" :strategyNature="strategyNature" :planCode="planCode" :tradeNature="tradeNature" :title="$t('strategy.spotTrade.dialog.planDetail')" @close="dialogClose" @confirm="confirm"></tradeDetailDialog>
  </div>
</template>

<script>

import tradeDetailDialog from '@/views/frame/rm/strategy/spotTrade/components/tradeDetailDialog'
import futuresSpotHedge from '@/views/frame/rm/strategy/plan/component/futuresSpotHedge'
import spotHedge from '@/views/frame/rm/strategy/plan/component/spotHedge'
import spotSingle from '@/views/frame/rm/strategy/plan/component/spotSingle'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    tradeDetailDialog,
    futuresSpotHedge,
    spotHedge,
    spotSingle
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
      this.$parent.$parent.$parent.$refs.exposureInfo.tableData = []
      this.selectedRow = null
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(val) {
      val.detailId = val.id
      val.id = null
      val.tenantCode = null
      this.tableData = []
      this.tableData.push(val)
      this.dialogVisible = false
    },
    selectedData(val) {
      this.selectedRow = val
    }
  }
}
</script>

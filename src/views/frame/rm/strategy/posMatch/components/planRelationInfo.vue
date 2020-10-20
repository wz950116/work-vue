<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.selectPlan') }}
      </el-button>
    </div>
    <el-table stripe border height="150" class='table-content' ref="futureTradeInfo" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" @current-change="tableChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column align="left" width="150" :label="$t('strategy.posMatch.list.strategyCode')" prop="strategyCode"></el-table-column>
      <el-table-column align="left" width="150" :label="$t('strategy.posMatch.list.strategyName')" prop="strategyName"></el-table-column>
      <el-table-column align="left" width="150" :label="$t('strategy.posMatch.list.planCode')" prop="planCode"></el-table-column>
      <el-table-column align="left" width="150" :label="$t('strategy.posMatch.list.planName')" prop="planName"></el-table-column>
      <el-table-column align="left" width="150" :label="$t('strategy.posMatch.list.futuresContractCode')" prop="futuresContractCode"></el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.posMatch.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="150" :label="$t('strategy.posMatch.list.positionLots')" prop="matchLots"></el-table-column>
    </el-table>
    <planRelationDialog v-if="dialogVisible" :contractCode='contractCode' :direction='direction' @close="dialogClose" @confirm="confirm"></planRelationDialog>
  </div>
</template>

<script>
import planRelationDialog from '@/views/frame/rm/strategy/posMatch/components/planRelationDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    planRelationDialog
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      contractCode: '',
      direction: '',
      showZero: ''
    }
  },

  mounted() {
  },
  methods: {
    addRow() {
      if (this.$parent.$parent.$parent.$refs.instructionInfo.tableData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.instDetailEmpty')
          })
        )
        return
      }
      this.contractCode = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].contractCode
      this.direction = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].direction
      let offsetFlag = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].offsetFlag
      if (this.direction === '1') {
        this.direction = '2'
      } else {
        this.direction = '1'
      }
      if (offsetFlag === '1') {
        this.direction = ''
        this.showZero = ''
      } else {
        this.showZero = 'true'
      }
      this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(datas) {
      this.tableData = [datas]
      this.dialogVisible = false
    }
  }
}
</script>

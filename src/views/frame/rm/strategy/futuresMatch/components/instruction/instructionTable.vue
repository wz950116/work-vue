<template>
  <div class='dialog-wrapper'>
    <div>
      <div class='tabs-operate' style='margin-top:5px;' v-if="['add', 'update'].includes(optType)">
        <el-button v-db-click size="mini" @click="addRow()">
          <svg-icon icon-class="线性-增行"></svg-icon>增行
        </el-button>
        <el-button v-db-click size="mini" @click="deleteRow()">
          <svg-icon icon-class="线性-删行"></svg-icon>删行
        </el-button>
      </div>
      <el-table stripe border height="150" highlight-current-row ref="instrDetail" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @current-change="handleSelectionChange">
        <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
        <!-- <el-table-column :label="$t('strategy.futureMatch.tab.matchLots')" width="220">
          <template slot-scope="scope">
            <input-formatter :max='999999999999.9999' v-model="scope.row.matchLots" type="thousands" size="mini"></input-formatter>
          </template>
        </el-table-column> -->
        <el-table-column :label="$t('strategy.futureMatch.tab.canMatchLots')" width="120" prop="canMatchLots">
        </el-table-column>
        <!-- 品种 -->
        <el-table-column width="120" :label="$t('strategy.instruction.tab.productCode')" prop="productName"></el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.contractCode')" width="120" prop="contractName">
        </el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.direction')" width="80" prop="direction">
          <template slot-scope="scope">
            <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.offsetFlag')" width="80" prop="offsetFlag">
          <template slot-scope="scope">
            <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.lots')" width="120" prop="lots">
        </el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.unit')" width="90">
          <template slot-scope="scope">
            <span>{{'手'}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.price')" width="120" prop="price">
        </el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.priceDiff')" width="120" prop="priceDiff">
        </el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.currencyCode')" width="90" prop="currencyName">

        </el-table-column>
        <el-table-column :label="$t('strategy.instruction.tab.remark')" width="160" prop="remark">

        </el-table-column>
      </el-table>
    </div>
    <instructionDetailTable v-if="dialogVisible" :itemClass="itemClass" :instructionCode="instructionCode" @closeHandlerDialog='close' @confirm='confirm'></instructionDetailTable>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { mapGetters } from 'vuex'
import instructionDetailTable from '@/views/frame/rm/strategy/futuresMatch/components/instruction/instructionDetailTable'
export default {
  data() {
    return {
      currentRow: {},
      tableData: [],
      loading: true,
      dialogVisible: false
    }
  },
  components: {
    instructionDetailTable
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.strategyManagement.tab.selectType')
    }
  },
  props: ['instructionCode', 'optType', 'tradeBatchDto', 'itemClass'],
  watch: {
    instructionCode(newValue) {
      this.listData()
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    close() {
      this.dialogVisible = false
    },
    confirm(val) {
      this.dialogVisible = false
      this.tableData = []
      this.tableData.push(val)
      this.$parent.$parent.$parent.formData.tradeDetailDtoList = []
      this.$emit('itemClassChange', val.itemClass)
    },

    listData() {
      if (this.optType === 'add') return
      if (JSON.stringify(this.tradeBatchDto) !== '{}') {
        this.tableData.push(this.tradeBatchDto)
      } else {
        this.tableData = []
      }
    },

    handleSelectionChange(val) {
      this.currentRow = val
    },

    // 增行
    addRow() {
      if (this.instructionCode) {
        this.dialogVisible = true
      } else {
        Notification(
          notifyInfo({
            msg: '请先选择指令'
          })
        )
      }
    },
    // 删行
    deleteRow() {
      if (this.currentRow) {
        this.$confirm(
          this.$t('biz.msg.confirmDelete'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            this.tableData = []
          })
          .catch(() => { })
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    }
  }
}
</script>

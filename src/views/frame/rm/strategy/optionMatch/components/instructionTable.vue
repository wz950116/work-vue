<template>
  <div class='dialog-wrapper'>
    <div>
      <div class='tabs-operate' style='margin-top:5px;'>
        <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
          <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
        </el-button>
        <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
          <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
        </el-button>
      </div>
      <el-table stripe border height="150" highlight-current-row ref="instrDetail" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @current-change="handleSelectionChange">
        <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
        <el-table-column align="right" :label="$t('strategy.optionMatch.list.matchLots')" width="120" prop="matchLots"></el-table-column>
        <el-table-column align='right' :label="$t('strategy.optionMatch.list.noMatchLots')" width="120" prop="noMatchLots"></el-table-column>
        <el-table-column :label="$t('strategy.optionMatch.list.contractCode')" width="120" prop="contractCode"></el-table-column>
        <el-table-column align='center' :label="$t('strategy.optionMatch.list.optionOffset')" width="80" prop="optionOffset">
          <template slot-scope="scope">
            <span>{{scope.row.optionOffset | dataDictFormat($t('datadict.optionOffset'))}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' :label="$t('strategy.optionMatch.list.direction')" width="80" prop="direction">
          <template slot-scope="scope">
            <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' :label="$t('strategy.optionMatch.list.callPut')" width="80" prop="callPut">
          <template slot-scope="scope">
            <span>{{scope.row.callPut | dataDictFormat($t('datadict.callPut'))}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' :label="$t('strategy.optionMatch.list.strikePrice')" width="120" prop="strikePrice">
          <template slot-scope='scope'>
            <span>{{scope.row.strikePrice | priceFilter | thousands}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' :label="$t('strategy.optionMatch.list.price')" width="120" prop="price">
          <template slot-scope='scope'>
            <span>{{scope.row.price | priceFilter | thousands}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' :label="$t('strategy.optionMatch.list.lots')" width="120" prop="lots">
          <template slot-scope='scope'>
            <span>{{scope.row.lots | quantityFilter | thousands}}</span>
          </template>
        </el-table-column>
        <!-- 单位 -->
        <el-table-column :width="90" :label="$t('strategy.optionInstruction.list.unitCode')" prop="unitCode">
          <template slot-scope="scope">
            {{$t('strategy.optionInstruction.list.hand')}}
          </template>
        </el-table-column>
        <el-table-column align='center' :label="$t('strategy.optionMatch.list.endDate')" width="120" prop="endDate">
          <template slot-scope='scope'>
            <span>{{scope.row.endDate | dateFormat}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <instructionDetailTable v-if="dialogVisible" :instructionCode="instructionCode" @closeHandlerDialog='close' @confirm='confirm'></instructionDetailTable>
  </div>
</template>

<script>
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { mapGetters } from 'vuex'
import instructionDetailTable from '@/views/frame/rm/strategy/optionMatch/components/instructionDetailTable'
export default {
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      multipleSelection: [],
      tableData: [],
      loading: true,
      dialogVisible: false
    }
  },
  components: {
    instructionDetailTable
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  props: {
    instructionCode: {
      type: String,
      default: ''
    }
  },
  methods: {
    close() {
      this.dialogVisible = false
    },
    confirm(val) {
      this.dialogVisible = false
      val.id = null
      val.canMatchLots = parseInt(val.lots) - parseInt(val.posMatchLots) - parseInt(val.preMatchLots) - parseInt(val.matchLots)
      val.tenantCode = null
      val.matchLots = 0
      this.tableData = []
      this.tableData.push(val)
      this.$emit('dataChange')
    },
    handleSelectionChange(val) {
      this.currentRow = val
    },
    // 增行
    addRow() {
      if (this.instructionCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.instructionNotSelect')
          })
        )
        return
      }
      this.dialogVisible = true
    },
    // 删行
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
          this.$emit('dataChange')
        })
        .catch(() => {})
    }
  }
}
</script>

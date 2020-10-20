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
        <el-table-column align="right" :label="$t('strategy.posMatch.list.matchLots')" width="120" prop="matchLots"></el-table-column>
        <el-table-column align='right' :label="$t('strategy.posMatch.list.canMatchLots')" width="120" prop="canMatchLots">
        </el-table-column>
        <el-table-column :label="$t('strategy.posMatch.list.contractCode')" width="120" prop="contractCode">
        </el-table-column>
        <el-table-column align='center' :label="$t('strategy.posMatch.list.direction')" width="80" prop="direction">
          <template slot-scope="scope">
            <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
          </template>
        </el-table-column>
        <el-table-column align='center' :label="$t('strategy.posMatch.list.offsetFlag')" width="80" prop="offsetFlag">
          <template slot-scope="scope">
            <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' :label="$t('strategy.posMatch.list.lots')" width="120" prop="lots">
        </el-table-column>
        <el-table-column :label="$t('strategy.posMatch.list.unit')" width="90">
          <template>
            <span>{{'11' | dataDictFormat($t('datadict.measurementUnit'))}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' :label="$t('strategy.posMatch.list.price')" width="120" prop="price">
          <template slot-scope='scope'>
            <span>{{scope.row.price | priceFilter | thousands}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' :label="$t('strategy.posMatch.list.priceDiff')" width="120" prop="priceDiff">
          <template slot-scope='scope'>
            <span>{{scope.row.priceDiff | priceFilter | thousands}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.posMatch.list.faccount')" width="120" prop="faccount"></el-table-column>
        <el-table-column :label="$t('strategy.posMatch.list.subFaccount')" width="120" prop="subFaccount"></el-table-column>
      </el-table>
    </div>
    <instructionDetailTable v-if="dialogVisible" :itemClass="'2'" :instructionCode="instructionCode" @closeHandlerDialog='close' @confirm='confirm'></instructionDetailTable>
  </div>
</template>

<script>
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { mapGetters } from 'vuex'
import instructionDetailTable from '@/views/frame/rm/strategy/futuresMatch/components/instruction/instructionDetailTable'
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
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.strategyManagement.tab.selectType')
    }
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
      val.canMatchLots =
        parseInt(val.lots) -
        parseInt(val.posMatchLots) -
        parseInt(val.preMatchLots) -
        parseInt(val.matchLots)
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
        .catch(() => { })
    }
  }
}
</script>

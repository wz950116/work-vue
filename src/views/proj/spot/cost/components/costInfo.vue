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
    <el-table stripe border height="150" highlight-current-row ref="buyMultipleTable" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @current-change="tableDataChange">
      <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
      <!-- 费用类型 -->
      <el-table-column prop='fundTypefundType' :label="$t('spotProj.cost.edit.costType')" width='150'>
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.costType')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.fundType" :placeholder="$t('biz.placeholder.choose')">
            <el-option v-for="item in $t('datadict.costType')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 费用类型 -->
      <el-table-column prop='fundTypefundType' :label="$t('spotProj.cost.edit.direction')" width='150'>
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.direction')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')">
            <el-option v-for="item in $t('datadict.costDirection')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 现货敞口编号 -->
      <el-table-column prop='spotExposureCode' :label="$t('spotProj.cost.edit.spotExposureCode')" width='150'>
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.spotExposureCode')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.spotExposureCode" :clearable='true' @focus="dialogOpen(scope.row)" size="mini"></el-input>
        </template>
      </el-table-column>
      <!-- 认领金额 -->
      <el-table-column :label="$t('spotProj.cost.edit.cliamAmt')" width='150'>
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.cliamAmt')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <input-formatter :max='999999999999.9999' :precision="2" v-model="scope.row.claimAmt" type="thousands" :digitType="'money'" size="mini"></input-formatter>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column :label="$t('spotProj.cost.edit.detailRemark')" width='250'>
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" :placeholder="$t('biz.placeholder.input')" size="mini"></el-input>
        </template>
      </el-table-column>
    </el-table>

    <exposureDialog v-if="dialogVisible" :direction="direction" @close="dialogClose" @confirm="confirm"></exposureDialog>
  </div>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import exposureDialog from '@/views/proj/spot/spotExopsure/components/exposureDialog'

export default {
  components: {
    exposureDialog
  },
  props: {
    direction: String
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      multipleSelection: [],
      currentRow: {},
      dialogVisible: false,
      inputRow: {}
    }
  },
  methods: {
    // 增行
    addRow() {
      this.tableData.push({
        fundType: '',
        spotExposureCode: '',
        claimAmt: 0,
        detailRemark: ''
      })
    },
    dialogOpen(row) {
      this.inputRow = row
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
      }).then(() => {
        this.tableData.splice(this.tableData.indexOf(this.currentRow), 1)
        this.currentRow = null
      })
    },
    tableDataChange(val) {
      this.currentRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    clearData() {
      this.tableData = []
    },
    confirm(data) {
      this.inputRow.spotExposureCode = data.documentNo
      this.inputRow.documentQuantity = data.documentQuantity
      this.dialogVisible = false
    },
    setAmount() {
      var amount = this.$parent.$parent.$parent.formData.domesticCurrencyAmt
      if (!amount) {
        return
      }
      if (!this.tableData || this.tableData.length === 0) {
        return
      }
      var totalQuanttity = 0.0
      this.tableData.forEach(e => {
        if (!e.documentQuantity) {
          return
        }
        totalQuanttity =
          parseFloat(totalQuanttity) + parseFloat(e.documentQuantity)
      })
      this.tableData.forEach(e => {
        if (!e.documentQuantity) {
          return
        }
        this.$set(
          e,
          'claimAmt',
          parseFloat(amount) *
          (parseFloat(e.documentQuantity) / parseFloat(totalQuanttity))
        )
      })
    },
    getDetailList() {
      if (this.tableData.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('strategy.plan.msg.tradeListEmpty')
          })
        )
        return
      }
      var reList = []
      this.tableData.forEach(e => {
        reList.push(e)
      })
      return reList
    },
    setList(data) {
      data.forEach(e => {
        this.tableData.push(e)
      })
    }
  }
}
</script>

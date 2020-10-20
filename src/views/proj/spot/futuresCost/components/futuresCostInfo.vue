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
          <el-select size='mini' v-model="scope.row.costType" :placeholder="$t('biz.placeholder.choose')">
            <el-option v-for="item in $t('datadict.futureCostType')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 费用性质 -->
      <el-table-column prop='fundTypefundType' :label="$t('spotProj.cost.edit.costNature')" width='150'>
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.costNature')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.costNature" :placeholder="$t('biz.placeholder.choose')">
            <el-option v-for="item in $t('datadict.futuresItemClass')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- 收支方向 -->
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
      <!-- 策略名称 -->
      <el-table-column prop='strategyCode' :label="$t('spotProj.cost.edit.strategyCode')" width='150' v-if="this.$route.params.typeFlag==='1'">
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.strategyCode')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <base-select v-model="scope.row.strategyCode" :attrs="{data: 'STRATEGY',filterable: true, params:{auditStatus: '3', strgLevel: '4', strategyNature: '1,2,4,6'}}" size="mini"></base-select>
        </template>
      </el-table-column>
      <!-- 计划名称 -->
      <el-table-column prop='planCode' :label="$t('spotProj.cost.edit.planCode')" width='150' v-if="this.$route.params.typeFlag==='2'">
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.planCode')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <base-select v-model="scope.row.planCode" :attrs="{data: 'PLAN',filterable: true, params:{auditStatus: '3', strgLevel: '3', strategyNature: '1,2,4,6'}}" size="mini"></base-select>
        </template>
      </el-table-column>
      <!-- 指令名称 -->
      <el-table-column prop='instructionCode' :label="$t('spotProj.cost.edit.instructionCode')" width='150' v-if="this.$route.params.typeFlag==='3'">
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.instructionCode')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <base-select v-model="scope.row.instructionCode" :attrs="{data: 'INSTRUCTION',filterable: true, params:{auditStatus: '3', strgLevel: '1,2', strategyNature: '1,2,4,6'}}" size="mini"></base-select>
        </template>
      </el-table-column>
      <!-- 认领金额 -->
      <el-table-column :label="$t( 'spotProj.cost.edit.cliamAmt')" width='150'>
        <template slot="header" slot-scope="scope">
          {{$t('spotProj.cost.edit.cliamAmt')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <input-formatter :max='999999999999.9999' :precision="2" v-model="scope.row.claimAmt" type="thousands" :digitType=" 'money'" size="mini"></input-formatter>
        </template>
      </el-table-column>
      <!-- 备注 -->
      <el-table-column :label="$t( 'spotProj.cost.edit.detailRemark')" width='250'>
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" :placeholder="$t( 'biz.placeholder.input')" size="mini"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {},
  props: {},
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
    }
  }
}
</script>

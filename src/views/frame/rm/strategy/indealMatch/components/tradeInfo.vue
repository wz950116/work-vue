<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="virtualTrade" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.virtualTrade') }}
      </el-button>
    </div>
    <el-table stripe border highlight-current-row ref="buyMultipleTable" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @current-change="currentChange" height="150">
      <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.indealMatch.list.canMatchLots')" prop="canMatchLots"></el-table-column>
      <el-table-column width="150" :label="$t('strategy.indealMatch.list.instructionName')" prop="instructionCode">
        <template slot-scope="scope">
          <base-select v-model="scope.row.instructionCode" :attrs="{data: 'INSTRUCTION', disabled:true}" size="mini"></base-select>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.productCode')" prop="productCode">
        <template slot-scope="scope">
          <base-select v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES', disabled:true}" size="mini"></base-select>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.contractCode')" prop="contractCode"></el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.indealMatch.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.indealMatch.list.offset')" prop="offsetFlag">
        <template slot-scope="scope">
          <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.futureOffsetType'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.indealMatch.list.volume')">
        <template slot-scope="scope">
          <span>{{scope.row.volume | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" :label="$t('strategy.plan.list.unitCode')" prop="unitCode">
        <template slot-scope='scope'>
          <span>{{'5' | dataDictFormat($t('datadict.measurementUnit'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.indealMatch.list.price')">
        <template slot-scope="scope">
          <span>{{scope.row.instructionPrice | moneyFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.derivativeAccount')" prop="faccount"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.derivativeSubAccount')" prop="subFaccount"></el-table-column>
    </el-table>
    <instructionTable v-if="dialogVisible" @closeHandlerDialog="dialogClose" @confirm="dialogConfirm"></instructionTable>
  </div>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import instructionTable from '@/views/frame/rm/strategy/indealMatch/components/instructionTable'

export default {
  components: {
    instructionTable
  },
  props: {
    height: Number
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      multipleSelection: [],
      currentRow: {},
      dialogVisible: false,
      unitCode: '5',
      group: 1
    }
  },
  methods: {
    // 增行
    addRow() {
      if (this.strategyCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.plan.msg.strategyFirst')
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
      }).then(() => {
        this.$emit('deleteRow', this.currentRow.group)
        this.tableData.splice(this.tableData.indexOf(this.currentRow), 1)
        this.currentRow = null
      })
    },
    dialogClose() {
      this.dialogVisible = false
    },
    clearData() {
      this.tableData = []
    },
    dialogConfirm(datas) {
      var detailIds = []
      this.tableData.forEach(e => {
        detailIds.push(e.detailId)
      })
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i]
        if (detailIds.includes(data.detailId)) {
          continue
        }
        var obj = {}
        obj.productCode = data.productCode
        obj.contractCode = data.contractCode
        obj.direction = data.direction
        obj.offsetFlag = data.offsetFlag
        obj.maxVolume = data.lots
        obj.volume = data.lots
        obj.instructionPrice = data.price
        obj.instructionCode = data.instructionCode
        obj.detailId = data.id
        obj.faccount = data.faccount
        obj.subFaccount = data.subFaccount
        obj.group = this.group++
        obj.canMatchLots = data.canMatchLots
        obj.price = data.price
        this.tableData.push(obj)
      }
      this.dialogVisible = false
    },
    virtualTrade() {
      if (this.tableData.length !== 2) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.indealMatch.msg.countNotTwo')
          })
        )
        return
      }
      this.$emit('virtualTrade', this.tableData)
    },
    currentChange(val) {
      this.currentRow = val
    }
  }
}
</script>

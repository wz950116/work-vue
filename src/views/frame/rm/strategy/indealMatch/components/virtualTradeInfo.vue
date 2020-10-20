<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
    </div>
    <el-table stripe border highlight-current-row ref="buyMultipleTable" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @current-change="currentChange" height="150">
      <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
      <el-table-column :label="$t('strategy.indealMatch.list.matchLots')" width="120">
        <template slot-scope="scope">
          <input-formatter :max='scope.row.volume' :precision='0' v-model="scope.row.matchLots" type="thousands" size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column width="150" :label="$t('strategy.indealMatch.list.instructionName')" prop="instructionCode">
        <template slot-scope="scope">
          <base-select v-model="scope.row.instructionCode" :attrs="{data: 'INSTRUCTION', disabled:true}" size="mini"></base-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.indealMatch.list.volume')" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.volume | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.contractCode')" prop="contractCode"></el-table-column>
      <el-table-column width="80" :label="$t('strategy.indealMatch.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80" :label="$t('strategy.indealMatch.list.offset')" prop="offsetFlag">
        <template slot-scope="scope">
          <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.futureOffsetType'))}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.price')">
        <template slot-scope="scope">
          <input-formatter :min='0' :max='99999999999.9999' type='thousands' :precision='2' v-model="scope.row.price" size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.commission')" prop="commission">
        <template slot-scope="scope">
          <input-formatter :min='0' :max='99999999999.9999' type='thousands' :precision='2' v-model="scope.row.commission" size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.adjustFee')" prop="adjustFee">
        <template slot-scope="scope">
          <input-formatter :min='0' :max='99999999999.9999' type='thousands' :precision='2' v-model="scope.row.adjustFee" size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.tradeId')" prop="tradeNo"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.orderSysId')" prop="orderSysId"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.derivativeAccount')" prop="derivativeAccount">
        <template slot-scope="scope">
          <base-select v-model="scope.row.derivativeAccount" :attrs="{data: 'DERIVATIVE_ACCOUNT',params:{derivativeCategory: '3'}, clearable: true}" size="mini"></base-select>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.indealMatch.list.derivativeSubAccount')" prop="derivativeSubAccount">
        <template slot-scope="scope">
          <base-select v-model="scope.row.derivativeSubAccount" :attrs="{data: 'DERIVATIVE_SUB_ACCOUNT',params:{derivativeCategory: '3'}, clearable: true}" size="mini"></base-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
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
      unitCode: '11'
    }
  },
  methods: {
    virtualTrade(datas) {
      this.tableData = []
      for (let i = 0; i < datas.length; i++) {
        const data = datas[i]
        const virtualTrade = {
          matchLots: 0,
          instructionCode: data.instructionCode,
          volume: data.canMatchLots,
          contractCode: data.contractCode,
          direction: data.direction,
          offsetFlag: data.offsetFlag,
          price: data.instructionPrice,
          detailId: data.detailId,
          group: data.group
        }
        this.tableData.push(virtualTrade)
      }
    },
    deleteRow(group) {
      for (let i = this.tableData.length - 1; i >= 0; i--) {
        if (this.tableData[i].group === group) {
          this.tableData.splice(i, 1)
        }
      }
    }
  }
}
</script>

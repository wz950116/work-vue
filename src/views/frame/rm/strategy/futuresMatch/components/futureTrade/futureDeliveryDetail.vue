<template>
  <div>
    <div>
      <div class='tabs-operate' style='margin-top:5px;' v-if="['add', 'update'].includes(optType)">
        <el-button v-db-click size="mini" @click="virtualTrade" v-if="['add', 'update'].includes(optType)">
          <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.virtualTrade') }}
        </el-button>
      </div>
      <el-table stripe border height="150" ref="buyTable" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @selection-change="handleSelectionChange">
        <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
        <el-table-column type="selection" width="45" align='center'></el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.matchLots')" width="120">
          <template slot="header">
            {{$t('strategy.futureDelivery.tab.matchLots')}}
            <span style='color:#f56c6c;'>*</span>
          </template>
          <template slot-scope="scope">
            <input-formatter :max='999999999999' v-model="scope.row.matchLots" type="thousands" size="mini"></input-formatter>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.tradeCode')" width="120" prop="tradeCode"></el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.orderCode')" width="120" prop="orderCode"></el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.productCode')" width="120">
          {{productCodeList}}
          <template slot="header">
            {{$t('strategy.futureDelivery.tab.productCode')}}
            <span style='color:#f56c6c;'>*</span>
          </template>
          <template slot-scope="scope">
            <base-select size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',disabled: true}"></base-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.contractCode')" width="120">
          <template slot="header">
            {{$t('strategy.futureDelivery.tab.contractCode')}}
            <span style='color:#f56c6c;'>*</span>
          </template>
          <template slot-scope="scope">
            <base-select size="mini" v-model="scope.row.contractCode" :attrs="{data: 'FUTURES_CONTRACT',clearable: true,disabled: tradeNature !== '1',params:{futuresVarietiesCode:scope.row.productCode,usingFlag:'1'}}"></base-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.direction')" width="80">
          <template slot="header">
            {{$t('strategy.futureDelivery.tab.direction')}}
            <span style='color:#f56c6c;'>*</span>
          </template>
          <template slot-scope="scope">
            <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
              <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align='center' width="80" :label="$t('strategy.plan.list.offset')" prop="offsetFlag">
          <template slot-scope="scope">
            <el-select size='mini' v-model="scope.row.offsetFlag" :placeholder="$t('biz.placeholder.choose')" :clearable="true" :disabled='true'>
              <el-option v-for="item in $t('datadict.futureOffsetType')" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.unitCode')" width="90">
          <template slot-scope="scope">
            <el-select size='mini' v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')" :clearable="true" :disabled='true'>
              <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.price')" width="120">
          <template slot="header">
            {{$t('strategy.futureDelivery.tab.price')}}
            <span style='color:#f56c6c;'>*</span>
          </template>
          <template slot-scope="scope">
            <input-formatter :min="0" :max='999999999999.9999999' :precision="2" type='thousands' v-model="scope.row.price" size="mini"></input-formatter>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.commission')" width="120">
          <template slot-scope="scope">
            <input-formatter :min="0" :max='999999999999.999999' :precision="2" type='thousands' v-model="scope.row.commission" size="mini"></input-formatter>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.derivativeAccount')" width="120">
          <template slot-scope="scope">
            <base-select size="mini" v-model="scope.row.derivativeAccount" :attrs="{data: 'DERIVATIVE_ACCOUNT',clearable: true,params:{derivativeCategory:'1',derivativeType: '1'}}"></base-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.derivativeSubAccount')" width="120">
          <template slot-scope="scope">
            <base-select size="mini" v-model="scope.row.derivativeSubAccount" :attrs="{data: 'DERIVATIVE_SUB_ACCOUNT',clearable: true,params:{derivativeCategory:'1',usingFlag:'1'}}"></base-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      productCodeList: []
    }
  },
  props: ['tradeNature', 'optType'],
  mounted() {
    // 渲染表格数据
    this.getEditData()
  },
  methods: {
    // 处理勾选后
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    virtualTrade() {
      let data;
      let msg;
      if (this.tradeNature === '1') {
        data = this.$parent.$parent.$parent.$refs.strategyInfo.$refs.strategyInfo1.tableData[0]
        msg = '策略'
      }
      if (this.tradeNature === '2') {
        data = this.$parent.$parent.$parent.$refs.planInfo.$refs.strategyInfo1.tableData[0]
        msg = '计划'
      }
      if (this.tradeNature === '3') {
        data = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0]
        msg = '指令'
      }
      if (!data) {
        this.$notify(
          notifyInfo({
            msg: msg + '信息列表为空，无法生成虚拟成交'
          })
        )
        return
      }
      var tradeInfo = {
        productCode: data.productCode,
        contractCode: data.contractCode,
        direction: data.direction,
        unitCode: '5',
        detailId: data.detailId,
        offsetFlag: '1'
      }
      this.tableData = [tradeInfo]
    }
  }
}
</script>

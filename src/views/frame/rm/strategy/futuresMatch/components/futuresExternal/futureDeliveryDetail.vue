<template>
  <div>
    <div>
      <div class='tabs-operate' style='margin-top:5px;' v-if="['add', 'update'].includes(optType)">
        <el-button v-db-click size="mini" @click="addRow">
          <svg-icon icon-class="线性-增行"></svg-icon>增行
        </el-button>
        <el-button v-db-click size="mini" @click="deleteRow">
          <svg-icon icon-class="线性-删行"></svg-icon>删行
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
            <el-select size="mini" v-model="scope.row.productCode" :placeholder="$t('biz.placeholder.choose')">
              <el-option v-for="item in productList" :key="item.productCode" :label="item.productName" :value="item.productCode"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.contractCode')" width="120">
          <template slot="header">
            {{$t('strategy.futureDelivery.tab.contractCode')}}
            <span style='color:#f56c6c;'>*</span>
          </template>
          <template slot-scope="scope">
            <base-select size="mini" v-model="scope.row.contractCode" :attrs="{data: 'FUTURES_CONTRACT',clearable: true,params:{futuresVarietiesCode:scope.row.productCode,usingFlag:'1'}}"></base-select>
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
              <el-option v-for="item in $t('datadict.offset')" :key="item.value" :label="item.label" :value="item.value">
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
            <base-select size="mini" v-model="scope.row.derivativeAccount" :attrs="{data: 'DERIVATIVE_ACCOUNT',clearable: true}"></base-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('strategy.futureDelivery.tab.derivativeSubAccount')" width="120">
          <template slot-scope="scope">
            <base-select size="mini" v-model="scope.row.derivativeSubAccount" :attrs="{data: 'DERIVATIVE_SUB_ACCOUNT',clearable: true,params:{usingFlag:'1'}}"></base-select>
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
  props: ['matchCode', 'productList', 'strategyCode', 'optType'],
  mounted() {
    // 渲染表格数据
    this.getEditData()
    // 获取品种集合
    this.getProductList()
  },
  methods: {
    // 获取品种集合
    getProductList() {
      if (!this.strategyCode) return
      request({
        url: '/api/strg/strDetail/listByCode',
        method: 'post',
        data: {
          data: {
            strategyCode: this.strategyCode,
            itemClass: '2'
          },
          funcModule: '策略管理',
          funcOperation: '获取策略明细'
        }
      })
        .then(response => {
          this.productCodeList = response.data
        })
        .catch(() => { })
    },
    // 获取初始化数据
    getEditData() {
      if (!this.matchCode) return
      request({
        url: '/api/strategy/dlvryMatchBatch/get',
        method: 'post',
        data: {
          data: this.matchCode,
          funcModule: '策略管理',
          funcOperation: '获取单个'
        }
      })
        .then(response => {
          this.getProductList()
          this.tableData = response.data.dlvryMatchBatchDtoList
          this.tableData.forEach((i, index) => {
            i.rowNum = index
            i.unitCode = '11'
          })
        })
        .catch(() => { })
    },

    // 处理勾选后
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<template>
  <el-col :span='12'>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>增行
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>删行
      </el-button>
      <span>目的标的</span>
    </div>

    <el-table stripe border height="150" highlight-current-row ref="sellTable" class='table-content tb-edit' :data="sellData" style="border:1px solid;" @selection-change="sellHandleSelectionChange">
      <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
      <el-table-column type="selection" width="45" align='center'></el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.itemClass')" width="100">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.strategyManagement.tab.itemClass')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size="mini" @change="v=>changeBuy({val:v,row:scope.row})" v-model="scope.row.itemClass" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
            <el-option v-for="item in $t('datadict.futuresItemClass')" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.productCode')" width="120">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.productCode')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <base-select v-if="scope.row.itemClass==='2'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'1'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
          <base-select v-if="scope.row.itemClass==='3'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'2'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.direction')" width="80">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.direction')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
            <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.maxHands')" width="120">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.maxHands')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.maxHands" @keyup.native="number" @change='v=>changeMaxHands({val:v,row:scope.row})' size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.maxPostion')" width="120">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.maxPostion')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.maxPostion" :min="0" :max='999999999999' :precision="2" type='thousands' size="mini" :disabled="true"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.unitCode')" width="90">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.unitCode')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')">
            <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.currencyCode')" width="90">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.currencyCode')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <base-select size="mini" v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY',clearable: true}"></base-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.marketCode')" width="140">
        <template slot-scope="scope">
          <base-select size="mini" v-model="scope.row.marketCode" :attrs="{data: 'DD_SPOT_MARKET',clearable: true}"></base-select>
        </template>
      </el-table-column>
    </el-table>
  </el-col>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      currencyCode: '',
      sellData: [],
      sellMultipleSelection: []
    }
  },
  props: ['strategyCode', 'type'],
  watch: {
    strategyCode(newId) {
      if (newId) this.getEditData()
    }
  },
  async mounted() {
    this.getEditData()
    this.currencyCode = await this.$store.dispatch('getCurrencyCode', {
      funcModule: this.$t('route.' + this.$route.meta.title),
      name: '人民币'
    })
  },
  methods: {
    changeProductCode(value) {
      value.row.contractMultiplier = value.val.data.contractMultiplier
      if (value.row.maxHands) {
        value.row.maxPostion = value.row.maxHands * value.val.data.contractMultiplier
      }
    },
    number(value) {
      value = value.replace(/[^\.\d]/g, '')
      value = value.replace('.', '')
    },
    changeMaxHands(value) {
      value.row.maxPostion = value.row.maxHands * value.row.contractMultiplier
    },
    // 获取初始化数据
    getEditData() {
      if (!this.strategyCode) return

      request({
        url: '/api/strg/strDetail/listByCode',
        method: 'post',
        data: {
          data: {
            strategyCode: this.strategyCode
          },
          funcModule: '策略管理',
          funcOperation: '获取单个'
        }
      })
        .then(response => {
          response.data.forEach(element => {
            if (element.optimizationFlag === '0') {
              this.sellData.push(element)
            }
          })
          this.sellData.forEach((i, index) => {
            i.rowNum = index
          })
        })
        .catch(() => {})
    },
    // 处理勾选后
    sellHandleSelectionChange(val) {
      this.sellMultipleSelection = val
    },

    // 增行
    addRow() {
      this.sellData.push({
        itemClass: '2',
        direction: '',
        productCode: '',
        quantity: '',
        unitCode: '1',
        maxPostion: '',
        marketCode: '',
        maxHands: '',
        currencyCode: this.currencyCode,
        optimizationFlag: '0',
        rowNum: this.sellData.length
      })
    },
    // 删行
    deleteRow() {
      if (this.sellMultipleSelection.length > 0) {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            const filterArr = this.sellMultipleSelection.map(select => select.rowNum)
            const templateData = []
            this.sellData.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })
            templateData.forEach((i, index) => {
              i.rowNum = index
            })
            this.sellData = templateData
          })
          .catch(() => {})
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

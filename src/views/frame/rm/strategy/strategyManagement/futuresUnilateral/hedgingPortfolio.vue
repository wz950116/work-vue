<template>
  <div>
    <!-- <el-col :span='24' style='border-right:1px solid #aaaaaa;'> -->
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>增行
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>删行
      </el-button>
    </div>
    <el-table stripe border height="150" ref="buyTable" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @selection-change="handleSelectionChange">
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
        <template slot="header" slot-scope="scope">
          {{$t('strategy.strategyManagement.tab.productCode')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <base-select v-if="scope.row.itemClass==='2'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'1'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
          <base-select v-if="scope.row.itemClass==='3'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'2'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.direction')" width="80">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.strategyManagement.tab.direction')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
            <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.maxHands')" width="120">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.strategyManagement.tab.maxHands')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.maxHands" @keyup.native="number" @change='v=>changeMaxHands({val:v,row:scope.row})' size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.maxPostion')" width="120">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.strategyManagement.tab.maxPostion')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.maxPostion" :min="0" :max='999999999999' :precision="2" type='thousands' size="mini" :disabled="true"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.unitCode')" width="90">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.strategyManagement.tab.unitCode')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')">
            <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.currencyCode')" width="90">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.strategyManagement.tab.currencyCode')}}
          <span style="color:#f56c6c;" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <base-select size="mini" v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY',clearable:true}"></base-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.marketCode')" width="140">
        <template slot-scope="scope">
          <base-select size="mini" v-model="scope.row.marketCode" :attrs="{data: 'EXCHANGE',clearable:true}"></base-select>
        </template>
      </el-table-column>
    </el-table>
    <!-- </el-col> -->
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
      currencyCode: '',
      tableData: [],
      multipleSelection: []
    }
  },
  props: ['strategyCode', 'type'],
  watch: {},
  async mounted() {
    // 渲染表格数据
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
          this.tableData = response.data
          this.tableData.forEach((i, index) => {
            i.rowNum = index
          })
        })
        .catch(() => {})
    },

    // 处理勾选后
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 增行
    addRow(file) {
      this.tableData.push({
        itemClass: '2',
        productCode: '',
        direction: '',
        maxPostion: '',
        unitCode: '1',
        currencyCode: this.currencyCode,
        marketCode: '',
        contractMultiplier: '',
        rowNum: this.tableData.length
      })
    },
    // 删行
    deleteRow(file) {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            const filterArr = this.multipleSelection.map(select => select.rowNum)
            const templateData = []
            this.tableData.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })
            templateData.forEach((i, index) => {
              i.rowNum = index
            })
            this.tableData = templateData
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

<template>
  <div>
    <el-row :gutter='20' style='border-top:1px solid #aaaaaa;'>
      <el-col :span='12' style='border-right:1px solid #aaaaaa;'>
        <div class='tabs-operate' style='margin-top:5px;'>
          <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
            <svg-icon icon-class="线性-增行"></svg-icon>增行
          </el-button>
          <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
            <svg-icon icon-class="线性-删行"></svg-icon>删行
          </el-button>
          <span>优化标的</span>
        </div>
        <el-table stripe border height="150" ref="buyTable" class='table-content tb-edit' :data="buyData" style="border:1px solid;" @selection-change="buyHandleSelectionChange">
          <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
          <el-table-column type="selection" width="45" align='center'></el-table-column>
          <!-- 类型1 -->
          <el-table-column v-if="this.strategyNatureF==='1'" :label="$t('strategy.strategyManagement.tab.itemClass')" prop="itemClass" width="90">
            <template slot-scope="scope">
              <span>{{scope.row.itemClass | dataDictFormat($t('datadict.itemClass'))}}</span>
            </template>
          </el-table-column>
          <!-- 品种1246 -->
          <el-table-column width="120" :label="$t('strategy.strategyManagement.tab.productCode')" prop="productName"></el-table-column>
          <!-- 方向1246 -->
          <el-table-column v-if="['1','2','6'].includes(this.strategyNatureF)" width="80" :label="$t('strategy.strategyManagement.tab.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="['4'].includes(this.strategyNatureF)" width="80" :label="$t('strategy.strategyManagement.tab.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <!-- 合约2 -->
          <el-table-column v-if="this.strategyNatureF==='2'" width="120" :label="$t('strategy.strategyManagement.tab.contractCode')" prop="contractCode"></el-table-column>
          <!-- 价格2 -->
          <el-table-column v-if="this.strategyNatureF==='2'" width="120" align="right" :label="$t('strategy.strategyManagement.tab.price')" prop="price"></el-table-column>
          <!-- 每组数量12 -->
          <el-table-column v-if="['1','2'].includes(this.strategyNatureF)" width="120" align="right" :label="$t('strategy.strategyManagement.tab.quantity')" prop="quantity"></el-table-column>

          <!-- 最大开仓手数1246 -->
          <el-table-column width="120" align="right" :label="$t('strategy.strategyManagement.tab.maxHands')" prop="maxHands">
          </el-table-column>

          <!-- 最大开仓量1246 -->
          <el-table-column width="120" align="right" :label="$t('strategy.strategyManagement.tab.maxPostion')" prop="maxPostion">
            <template slot-scope="scope">
              {{scope.row.maxPostion | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <!-- 单位1246 -->
          <el-table-column width="90" :label="$t('strategy.strategyManagement.tab.unitCode')" prop="unitCode">
            <template slot-scope="scope">
              <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
            </template>
          </el-table-column>
          <!-- 市场1246 -->
          <el-table-column width="140" :label="$t('strategy.strategyManagement.tab.marketCode')" prop="marketName"></el-table-column>
          <!-- 币种1246 -->
          <el-table-column width="90" :label="$t('strategy.strategyManagement.tab.currencyCode')" prop="currencyName">

          </el-table-column>
          <!-- 备注1 -->
          <el-table-column v-if="this.strategyNatureF==='1'" width="160" :label="$t('strategy.strategyManagement.tab.remark')" prop="remark"></el-table-column>

        </el-table>
      </el-col>
      <hedging-table v-if="['1','6'].includes(this.strategyNature)" ref='productDetailTable' :strategyCode='strategyCodeS' :type='type'></hedging-table>
      <futures-arbitrage-table v-if="this.strategyNature==='2'" ref='productDetailTable' :strategyCode='strategyCodeS' :type='type'></futures-arbitrage-table>
      <futures-unilateral-table v-if="this.strategyNature==='4'" ref='productDetailTable' :strategyCode='strategyCodeS' :type='type'></futures-unilateral-table>
      <spot-arbitrage-table v-if="this.strategyNature==='3'" ref='productDetailTable' :strategyCode='strategyCodeS' :type='type'>
      </spot-arbitrage-table>
      <spot-unilateral-table v-if="this.strategyNature==='5'" ref='productDetailTable' :strategyCode='strategyCodeS' :type='type'>
      </spot-unilateral-table>
    </el-row>
    <strategyDetailDialog v-if='this.viewDialog' :itemClass="'2'" :strategyNature='strategyNatureF' :strategyCode='parentStrategyCodeF' @closeHandlerDialog='closeHandler' @confirm='confirm' :parentFlag='parentFlag'></strategyDetailDialog>
  </div>

</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import strategyDetailDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDetailDialog'
import futuresArbitrageTable from '@/views/frame/rm/strategy/strategyManagement/optimizationStrategy/futuresArbitrageTable'
import futuresUnilateralTable from '@/views/frame/rm/strategy/strategyManagement/optimizationStrategy/futuresUnilateralTable'
import hedgingTable from '@/views/frame/rm/strategy/strategyManagement/optimizationStrategy/hedgingTable'
import spotArbitrageTable from '@/views/frame/rm/strategy/strategyManagement/optimizationStrategy/spotArbitrageTable'
import spotUnilateralTable from '@/views/frame/rm/strategy/strategyManagement/optimizationStrategy/spotUnilateralTable'
export default {
  components: {
    strategyDetailDialog,
    hedgingTable,
    futuresArbitrageTable,
    futuresUnilateralTable,
    spotArbitrageTable,
    spotUnilateralTable
  },
  data() {
    return {
      buyData: [],
      buyMultipleSelection: [],
      viewDialog: false,
      parentStrategyCodeF: '',
      strategyCodeS: ''
    }
  },
  props: [
    'strategyCode',
    'strategyNature',
    'parentStrategyCode',
    'type',
    'strategyNatureF',
    'parentFlag'
  ],
  watch: {},
  mounted() {
    if (this.type === 'add') {
      this.parentStrategyCodeF = this.strategyCode
      this.strategyCodeS = ''
    } else {
      this.parentStrategyCodeF = this.parentStrategyCode
      this.strategyCodeS = this.strategyCode
    }
    this.getEditData()
  },
  methods: {
    // 获取初始化数据
    getEditData() {
      if (this.type === 'add' || !this.strategyCode) return
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
            if (element.optimizationFlag === '1') {
              this.buyData.push(element)
            }
          })
          this.buyData.forEach((i, index) => {
            i.rowNum = index
          })
        })
        .catch(() => { })
    },
    // 处理勾选后
    buyHandleSelectionChange(val) {
      this.buyMultipleSelection = val
    },
    // 增行
    addRow() {
      this.viewDialog = true
    },
    // 删行
    deleteRow() {
      if (this.buyMultipleSelection.length > 0) {
        this.$confirm(
          this.$t('biz.msg.confirmDelete'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            const filterArr = this.buyMultipleSelection.map(
              select => select.rowNum
            )
            const templateData = []
            this.buyData.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })
            templateData.forEach((i, index) => {
              i.rowNum = index
            })
            this.buyData = templateData
          })
          .catch(() => { })
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    closeHandler() {
      this.viewDialog = false
    },
    confirm(valueArray) {
      this.viewDialog = false
      valueArray.forEach(element => {
        this.buyData.push(element)
      })
      // 后过滤
      const newData = []
      this.buyData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.productName + v.direction + v.price
            })
            .includes(row.productName + row.direction + v.price)
        ) {
          newData.push(row)
        }
      })
      this.buyData = newData
    }
  }
}
</script>

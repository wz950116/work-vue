<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <main>
        <el-table style='border: 1px solid;' stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" height='450' @selection-change="handleSelectionChange" @row-click='handleClick' @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column type="selection" width="45" align='center'></el-table-column>
          <!-- 类型1 -->
          <el-table-column v-if="this.strategyNature==='1'" width="90" :label="$t('strategy.strategyManagement.tab.itemClass')" prop="itemClass">
            <template slot-scope="scope">
              <span>{{scope.row.itemClass | dataDictFormat($t('datadict.itemClass'))}}</span>
            </template>
          </el-table-column>
          <!-- 品种1246 -->
          <el-table-column width="140" :label="$t('strategy.strategyManagement.tab.productCode')" prop="productName"></el-table-column>
          <!-- 方向126 -->
          <el-table-column v-if="['1','2','6'].includes(this.strategyNature)" width="80" :label="$t('strategy.strategyManagement.tab.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <!-- 方向4 -->
          <el-table-column v-if="['4'].includes(this.strategyNature)" width="80" :label="$t('strategy.strategyManagement.tab.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <!-- 合约2 -->
          <el-table-column v-if="this.strategyNature==='2'" width="120" align="right" :label="$t('strategy.strategyManagement.tab.contractCode')" prop="contractCode"></el-table-column>
          <!-- 价格2 -->
          <el-table-column v-if="this.strategyNature==='2'" width="120" align="right" :label="$t('strategy.strategyManagement.tab.price')" prop="price"></el-table-column>
          <!-- 每组数量12 -->
          <el-table-column v-if="['1','2'].includes(this.strategyNature)" width="120" align="right" :label="$t('strategy.strategyManagement.tab.quantity')" prop="quantity">
            <template slot-scope="scope">
              {{scope.row.quantity | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <!-- 单位1246 -->
          <el-table-column width="90" :label="$t('strategy.strategyManagement.tab.unitCode')" prop="unitCode">
            <template slot-scope="scope">
              <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
            </template>
          </el-table-column>
          <!-- 最大开仓量1246 -->
          <el-table-column width="120" align="right" :label="$t('strategy.strategyManagement.tab.maxPostion')" prop="maxPostion">
            <template slot-scope="scope">
              {{scope.row.maxPostion | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <!-- 估值基准1 -->
          <el-table-column v-if="this.strategyNature==='1'" width="140" align="right" :label="$t('strategy.strategyManagement.tab.valuationCode')" prop="valuationName"></el-table-column>
          <!-- 市场1246 -->
          <el-table-column width="140" align="right" :label="$t('strategy.strategyManagement.tab.marketCode')" prop="marketName"></el-table-column>
          <!-- 币种1246 -->
          <el-table-column width="90" align="right" :label="$t('strategy.strategyManagement.tab.currencyCode')" prop="currencyName"></el-table-column>
          <!-- 备注1 -->
          <el-table-column v-if="this.strategyNature==='1'" width="160" align="right" :label="$t('strategy.strategyManagement.tab.remark')" prop="remark"></el-table-column>
        </el-table>
      </main>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="cancel">
          {{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type='primary' v-db-click size="mini" @click="save">
          {{$t('biz.btn.choose')}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {},
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      loading: true,
      height: 200,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          strategyCode: this.strategyCode,
          itemClass: this.itemClass
        },
        defaultSortString: 'strategyCode.desc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.strategyManagement.dialog.title')
    }
  },
  props: ['strategyCode', 'strategyNature', 'itemClass', 'parentFlag'],
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true
      if (this.parentFlag) {
        this.listQuery.data.optimizationFlag = '0'
      }
      this.listQuery.data.strategyNature = this.strategyNature
      this.listQuery.data.strategyCode = this.strategyCode
      this.listQuery.data.itemClass = this.itemClass
      request({
        url: '/api/strg/strDetail/listByCode',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.tableData.forEach((i, index) => {
          i.rowNum = index
          i.optimizationFlag = '1'
          i.id = ''
          i.versionNum = ''
        })
        this.loading = false
      })
    },
    cancel() {
      this.$emit('closeHandlerDialog')
    },
    save() {
      if (this.multipleSelection.length === 0) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.multipleSelection)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleClick(row) {
      this.$refs.singleTable.toggleRowSelection(row)
    },
    handleDbclick(data) {
      this.$emit('confirm', [data])
    }
  }
}
</script>

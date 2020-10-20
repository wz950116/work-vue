<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <main>
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='height' @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
          <el-table-column type="selection" width="43" fixed></el-table-column>
          <el-table-column align="right" width="120" :label="$t('strategy.spotOpt.list.noOptQuantity')" prop="noOptQuantity">
            <template slot-scope='scope'>
              <span>{{scope.row.noOptQuantity | quantityFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('strategy.spotOpt.list.contractNo')" prop="contractNo"></el-table-column>
          <el-table-column width="120" :label="$t('strategy.spotOpt.list.documentNo')" prop="documentNo"></el-table-column>
          <el-table-column width="120" :label="$t('strategy.spotOpt.list.productName')" prop="productName"></el-table-column>
          <el-table-column align='center' width="80" :label="$t('strategy.spotOpt.list.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.spotDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align='right' width="120" :label="$t('strategy.spotOpt.list.matchQuantity')" prop="matchQuantity">
            <template slot-scope='scope'>
              <span>{{scope.row.matchQuantity | quantityFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column align='right' width="120" :label="$t('strategy.spotOpt.list.price')" prop="price">
            <template slot-scope='scope'>
              <span>{{scope.row.matchQuantity | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column width="90" :label="$t('strategy.spotOpt.list.unitCode')" prop="unitCode">
            <template slot-scope="scope">
              <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('strategy.spotOpt.list.customerName')" prop="customerName"></el-table-column>
        </el-table>
        <!-- 底部 -->
        <div class='bottom-operate'>
          <!-- 分页 -->
          <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
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
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      selectData: [],
      tableData: [],
      activeName: 'tradeDetail',
      loading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          strategyCode: this.strategyCode,
          direction: this.direction
        },
        defaultSortString: 'id.asc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.spotOpt.list.tradeList')
    }
  },
  props: {
    strategyCode: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 200
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true
      request({
        url: '/api/strategy/strgSpotOpt/listTrade',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (this.selectData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.selectData)
    },
    handleDbclick(data) {
      this.$emit('confirm', [data])
    },
    // 页码跳转
    handleSizeChange(val) {
      this.listQuery.size = val
      this.listData()
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.listData()
    },
    handleSelectionChange(val) {
      this.selectData = val
    }
  }
}
</script>

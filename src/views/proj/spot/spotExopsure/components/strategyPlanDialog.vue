<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <header style='border-radius:5px;'>
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('spotProj.exposure.list.planName')" prop="planName">
                <input-validate v-model="listQuery.data.planName" :clearable='true'></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('spotProj.exposure.list.planCode')" prop='planCode'>
                <input-validate v-model="listQuery.data.planCode" :clearable='true'></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('spotProj.exposure.list.productCode')" prop='productCode'>
                <base-select v-model="listQuery.data.productCode" :attrs="{data: 'DD_PRODUCT',clearable:true ,filterable: true}"></base-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn" v-permission="['query']">
            <el-button type="primary" @click="listData" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
          <!-- 展开收起 -->
          <div class='expand' @click='expand' v-show='false'>
            <i v-if='expandStatus' class='el-icon-arrow-up'></i>
            <i v-else class='el-icon-arrow-down'></i>
          </div>
        </el-form>
      </header>

      <main>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="$t('biz.lbl.mainInfo')" name="mainInfo">
            <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="400" :element-loading-text="$t('route.load')" :data="tableData" @current-change="handleSelectionChange">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column width="150" :label="$t('spotProj.exposure.list.planName')" prop="planName"></el-table-column>
              <el-table-column width="150" :label="$t('spotProj.exposure.list.planCode')" prop="planCode"></el-table-column>
              <el-table-column width="120" :label="$t('spotProj.exposure.list.productName')" prop="productName"></el-table-column>
              <el-table-column align='center' width="80" :label="$t('spotProj.exposure.list.direction')" prop="direction">
                <template slot-scope="scope">
                  <span>{{scope.row.direction | dataDictFormat($t('datadict.purchaseSaleType'))}}</span>
                </template>
              </el-table-column>
              <el-table-column width="120" :label="$t('spotProj.exposure.list.priceItemName')" prop="priceItemName"></el-table-column>
              <el-table-column v-if="virtualFlag ==='0'" align='center' width="200" :label="$t('strategy.plan.list.priceLimit')">
                <template slot-scope="scope">
                  {{scope.row.minPrice | priceFilter | thousands}} ~ {{scope.row.maxPrice | priceFilter | thousands}}
                </template>
              </el-table-column>
              <el-table-column v-if="virtualFlag ==='0'" align='center' width="200" :label="$t('strategy.plan.list.quantityLimit')">
                <template slot-scope="scope">
                  {{scope.row.minQuantity | quantityFilter | thousands}} ~ {{scope.row.maxQuantity | quantityFilter | thousands}}
                </template>
              </el-table-column>
              <el-table-column v-if="virtualFlag ==='1'" align='right' width="120" :label="$t('spotProj.exposure.list.maxQuantity')">
                <template slot-scope="scope">
                  {{scope.row.maxQuantity | quantityFilter | thousands}}
                </template>
              </el-table-column>
              <el-table-column width="90" :label="$t('spotProj.exposure.list.unitCode')" prop="unitCode">
                <template slot-scope="scope">
                  <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
                </template>
              </el-table-column>
            </el-table>

            <!-- 底部 -->
            <div class='bottom-operate'>
              <!-- 分页 -->
              <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </main>

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
  components: {},
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      tableData: [],
      detailData: [],
      selectData: {},
      activeName: 'mainInfo',
      subActiveName: 'subInfo',
      total: 0,
      loading: true,
      height: 200,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          planName: '',
          planCode: '',
          productCode: '',
          virtualFlag: this.virtualFlag
        },
        defaultSortString: 'id.asc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      if (this.virtualFlag === '0') {
        return this.$t('spotProj.exposure.dialog.planSelect')
      } else {
        return this.$t('spotProj.exposure.dialog.strategySelect')
      }
    }
  },
  props: {
    virtualFlag: String
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true
      request({
        url: '/api/strategy/strgPlanDetail/list',
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
      if (this.selectData === {}) {
        if (!this.buyCurrentRow) {
          this.$notify(
            notifyInfo({
              msg: this.$t('biz.msg.noRowSelected')
            })
          )
          return
        }
      }
      this.$emit('confirm', this.selectData)
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
    },
    // 展开收起
    expand() {
      this.expandStatus = !this.expandStatus
      this.tableComputed()
    },
    tableComputed() {
      this.$nextTick(() => {
        const getElHeadHeight = window.getComputedStyle(document.getElementById('elHead')).height.split('px')[0]
        if (this.$parent.$refs.qmTable) {
          this.$parent.$refs.qmTable.tableHeight = this.clientWidth < 1366 ? (this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 188 : this.clientHeight - getElHeadHeight - 158) : this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 172 : this.clientHeight - getElHeadHeight - 142
        }
      })
    }
  }
}
</script>

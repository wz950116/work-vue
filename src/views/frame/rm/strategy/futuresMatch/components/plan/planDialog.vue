<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' style="height: 640px">

      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <!-- 顶部按钮 -->
      <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.plan.form.planName')" prop="planName">
                <input-validate v-model="listQuery.data.planName" :clearable='true'></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.plan.form.deptCode')" prop='deptCode'>
                <base-select v-model="listQuery.data.deptCode" :attrs="{data: 'TREE_DEPT',clearable:true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.plan.form.productCode')" prop='productCode'>
                <base-select v-model="listQuery.data.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true ,filterable: true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.plan.list.enterMode')" prop='enterMode'>
                <el-select v-model="listQuery.data.enterMode" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                  <el-option v-for="item in $t('datadict.enterMode')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.plan.form.applicant')" prop='applicant'>
                <base-select v-model="listQuery.data.applicant" :attrs="{data: 'TREE_STAFF',clearable:true}"></base-select>
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
            <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="250" :element-loading-text="$t('route.load')" :data="tableData" @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column width="150" :label="$t('strategy.plan.list.planName')" prop="planName"></el-table-column>
              <el-table-column width="150" :label="$t('strategy.plan.list.planCode')" prop="planCode"></el-table-column>
              <el-table-column width="100" :label="$t('strategy.plan.list.deptName')" prop="deptName"></el-table-column>
              <el-table-column width="100" :label="$t('strategy.plan.list.maxShare')" prop="maxShare"></el-table-column>
              <el-table-column width="100" :label="$t('strategy.plan.list.enterMode')" prop="enterMode">
                <template slot-scope="scope">
                  <span>{{scope.row.enterMode | dataDictFormat($t('datadict.enterMode'))}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" :label="$t('strategy.plan.list.stopPoint')" prop="stopPoint"></el-table-column>
              <el-table-column width="80" :label="$t('strategy.plan.list.applicantName')" prop="applicantName"></el-table-column>
              <el-table-column width="100" :label="$t('strategy.plan.list.createDate')" prop="makeDate">
                <template slot-scope="scope">
                  <span>{{scope.row.makeDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" :label="$t('strategy.plan.list.startDate')" prop="startDate">
                <template slot-scope="scope">
                  <span>{{scope.row.startDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" :label="$t('strategy.plan.list.endDate')" prop="endDate">
                <template slot-scope="scope">
                  <span>{{scope.row.endDate | dateFormat}}</span>
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

        <el-tabs v-model="subActiveName" type="border-card">
          <el-tab-pane :label="$t('strategy.plan.tab.planDetail')" name="subInfo">
            <!-- 套期 -->
            <futuresSpotHedge v-if="['1','6'].includes(strategyNature)" :height="height" :tableData="detailData"></futuresSpotHedge>
            <!-- 期货套利 -->
            <futuresHedge v-if="strategyNature === '2'" :height="height" :tableData="detailData"></futuresHedge>
            <!-- 期货单边 -->
            <futuresSingle v-if="strategyNature === '4'" :height="height" :tableData="detailData"></futuresSingle>

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
import futuresSpotHedge from '@/views/frame/rm/strategy/plan/component/futuresSpotHedge'
import futuresHedge from '@/views/frame/rm/strategy/plan/component/futuresHedge'
import futuresSingle from '@/views/frame/rm/strategy/plan/component/futuresSingle'
import { dateFormate } from '@/utils/frame/base/index'
export default {
  components: {
    futuresSpotHedge,
    futuresHedge,
    futuresSingle
  },
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
      height: 150,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          planName: '',
          deptCode: '',
          productCode: '',
          applicant: '',
          auditStatus: '3'
        },
        sortString: 'id.asc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.plan.dialog.title')
    }
  },
  props: {
    tradeNature: String,
    strategyNature: String,
    strategyNatures: Array,
    strgLevels: Array
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true
      if (this.tradeNature) {
        this.listQuery.data.tradeNature = this.tradeNature
      }
      if (this.strategyNature) {
        this.listQuery.data.strategyNature = this.strategyNature
      }
      if (this.strategyNatures && this.strategyNatures.length > 0) {
        this.listQuery.data.strategyNatures = this.strategyNatures
      }
      if (this.strgLevels && this.strgLevels.length > 0) {
        this.listQuery.data.strgLevels = this.strgLevels
      }
      var date = dateFormate(new Date(), 'YYYYMMDD')
      this.listQuery.data.queryDate = date
      request({
        url: '/api/strategy/strgPlan/list',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
    },
    handleDbclick(data) {
      this.$emit('confirm', data)
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
      this.strategyNature = val.strategyNature
      this.selectData = val
      request({
        url: '/api/strategy/strgPlan/listDetail',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            planCode: val.planCode,
            itemClass: '2'
          }
        }
      }).then(request => {
        this.detailData = request.data
      })
    },
    // 展开收起
    expand() {
      this.expandStatus = !this.expandStatus
      this.tableComputed()
    },
    tableComputed() {
      this.$nextTick(() => {
        const getElHeadHeight = window
          .getComputedStyle(document.getElementById('elHead'))
          .height.split('px')[0]
        if (this.$parent.$refs.qmTable) {
          this.$parent.$refs.qmTable.tableHeight =
            this.clientWidth < 1366
              ? this.$parent.$refs.qmTable.mainData.isTopBar
                ? this.clientHeight - getElHeadHeight - 188
                : this.clientHeight - getElHeadHeight - 158
              : this.$parent.$refs.qmTable.mainData.isTopBar
                ? this.clientHeight - getElHeadHeight - 172
                : this.clientHeight - getElHeadHeight - 142
        }
      })
    }
  }
}
</script>

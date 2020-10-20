<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '1000px' : '1150px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <header style='border-radius:5px;'>
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.posMatch.list.strategyCode')" prop="strategyCode">
                <input-validate v-model="listQuery.data.strategyCode" :clearable='true'></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.posMatch.list.strategyName')" prop='strategyName'>
                <input-validate v-model="listQuery.data.strategyName" :clearable='true'></input-validate>
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
        <el-tabs v-model="activeNameBottom" type="border-card">
          <el-tab-pane :label="$t('strategy.posMatch.tab.strategyRelation')" name="exposureInfo">
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='370' @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column align="left" width="150" :label="$t('strategy.posMatch.list.strategyCode')" prop="strategyCode"></el-table-column>
              <el-table-column align="left" width="150" :label="$t('strategy.posMatch.list.strategyName')" prop="strategyName"></el-table-column>
              <el-table-column align="left" width="100" :label="$t('strategy.posMatch.list.futuresContractCode')" prop="futuresContractCode"></el-table-column>
              <el-table-column align="center" width="80" :label="$t('strategy.posMatch.list.direction')" prop="direction">
                <template slot-scope="scope">
                  <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" width="150" :label="$t('strategy.posMatch.list.positionLots')" prop="matchLots"></el-table-column>
            </el-table>

            <!-- 底部 -->
            <div class='bottom-operate'>
              <!-- 分页 -->
              <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </main>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="cancel">
          {{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type='primary' v-db-click size="mini" @click="confirmClick">
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

export default {
  name: '',
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      tableData: [],
      loading: false,
      currentRow: null,
      activeNameBottom: 'exposureInfo',
      selectData: {},
      total: 0,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          futuresContractCode: this.contractCode,
          direction: this.direction,
          strgLevelList: ['2', '4'],
          showZero: this.showZero
        },
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.save')
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440
        ? this.clientHeight - 500
        : this.clientHeight - 520 // 防止底部滚动条遮挡
    },
    titleName() {
      return this.$t('strategy.posMatch.tab.strategyRelation')
    }
  },
  props: {
    contractCode: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    showZero: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      request({
        url: '/api/strategy/posMatch/listPosition',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
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
    cancel() {
      this.$emit('close')
    },
    handleDbclick(row) {
      this.$emit('confirm', row)
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    confirmClick() {
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

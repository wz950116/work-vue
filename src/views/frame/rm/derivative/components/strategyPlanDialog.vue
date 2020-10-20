<template>
  <div class="dialog-wrapper">
    <div class="dialog-container" type="formTableDialog" :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName="titleName" @TitleFun="cancel" />
      <div style="width:100%;overflow-y:auto;">
        <header id="elHead" :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
          <el-form ref="queryForm" label-position="left" :inline="true" :model="listQuery.data" class="header-form-inline">
            <el-row :gutter="20" style="width:94%;">
              <el-col :span="8">
                <el-form-item :label="$t('spotProj.exposure.list.planName')" prop="instructionName">
                  <input-validate v-model="listQuery.data.instructionName" :clearable="true"></input-validate>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('spotProj.exposure.list.planCode')" prop="instructionCode">
                  <input-validate v-model="listQuery.data.instructionCode" :clearable="true"></input-validate>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('derivative.futuresAccountImport.futuresContractCode')" prop="contractCode">
                  <base-select v-model="listQuery.data.contractCode" :attrs="{data: 'FUTURES_CONTRACT',clearable:true ,filterable: true}"></base-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 右侧搜索按钮 -->
            <div class="search-btn" v-permission="['query']">
              <el-button type="primary" @click="listData" v-db-click>{{$t('biz.lbl.search')}}</el-button>
            </div>
            <!-- 展开收起 -->
            <div class="expand" @click="expand" v-show="false">
              <i v-if="expandStatus" class="el-icon-arrow-up"></i>
              <i v-else class="el-icon-arrow-down"></i>
            </div>
          </el-form>
        </header>

        <main>
          <el-table stripe border class="table-content" ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="400" :element-loading-text="$t('route.load')" :data="tableData" @current-change="handleSelectionChange">
            <el-table-column align="center" type="index" fixed="left" width="50" :label="$t('table.id')">
            </el-table-column>
            <el-table-column :width="150" :label="$t('derivative.futuresAccountImport.instructionName')" prop="instructionName"></el-table-column>
            <el-table-column :width="150" :label="$t('derivative.futuresAccountImport.instructionCode')" prop="instructionCode"></el-table-column>
            <el-table-column :width="150" :label="$t('derivative.futuresAccountImport.productCode')" prop="productCode">
            </el-table-column>
            <el-table-column :width="150" :label="$t('derivative.futuresAccountImport.futuresContractCode')" prop="contractCode"></el-table-column>
            <el-table-column align="center" :width="80" :label="$t('derivative.futuresAccountImport.direction')" prop="direction">
              <template slot-scope="scope">
                <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="strgLevel !=='4'" align="center" :width="80" :label="$t('derivative.futuresAccountImport.offsetFlag')" prop="offsetFlag">
              <template slot-scope="scope">
                <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="strgLevel ==='3'" align="center" :width="200" :label="$t('strategy.plan.list.priceLimit')">
              <template slot-scope="scope">{{scope.row.price | priceFilter | thousands}} ~
                {{scope.row.priceDiff | priceFilter | thousands}}</template>
            </el-table-column>
            <el-table-column v-if="strgLevel ==='3'" align="center" :width="200" :label="$t('strategy.plan.list.quantityLimit')">
              <template slot-scope="scope">{{scope.row.reservedNum4 | quantityFilter | thousands}} ~
                {{scope.row.reservedNum1 | quantityFilter | thousands}}</template>
            </el-table-column>
            <el-table-column v-if="strgLevel ==='4'" align="right" :width="120" :label="$t('spotProj.exposure.list.maxQuantity')">
              <template slot-scope="scope">{{scope.row.lots | quantityFilter | thousands}}</template>
            </el-table-column>
            <el-table-column v-if="strgLevel ==='1'" align="right" :width="120" :label="$t('derivative.futuresAccountImport.price')">
              <template slot-scope="scope">{{scope.row.price | quantityFilter | thousands}}</template>
            </el-table-column>
            <el-table-column v-if="strgLevel ==='1'" align="right" :width="120" :label="$t('derivative.futuresAccountImport.volume')">
              <template slot-scope="scope">{{scope.row.lots | quantityFilter | thousands}}</template>
            </el-table-column>
          </el-table>

          <!-- 底部 -->
          <div class="bottom-operate">
            <!-- 分页 -->
            <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
          </div>
        </main>
      </div>
      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="cancel">{{$t('biz.btn.cancel')}}</el-button>
        <el-button type="primary" v-db-click size="mini" @click="save">{{$t('biz.btn.choose')}}</el-button>
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
      total: 0,
      loading: false,
      height: 200,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          instructionName: '',
          instructionCode: '',
          contractCode: ''
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
    strgLevel: String
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true
      if (this.strgLevel === '1') {
        this.listQuery.data.virtualFlag = '0'
      } else {
        this.listQuery.data.strgLevel = this.strgLevel
      }
      request({
        url: '/api/strg/strgInstrDetail/listInstrDetail',
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

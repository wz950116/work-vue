<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('derivative.futuresAccountTrade.futuresContractCode')" prop="futuresContractCode">
                <input-validate v-model="listQuery.data.futuresContractCode" :clearable="true"></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('derivative.futuresAccountTrade.direction')" prop='direction'>
                <el-select v-model="listQuery.data.direction" :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('derivative.futuresAccountTrade.offsetFlag')" prop='offsetFlag'>
                <el-select v-model="listQuery.data.direction" :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="item in $t('datadict.offset')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
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
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="400" :element-loading-text="$t('route.load')" :data="tableData" @current-change="currentChange" @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'>
          </el-table-column>
          <el-table-column type="selection" width="42" fixed></el-table-column>
          <el-table-column align='center' :width="120" :label="$t('derivative.futuresAccountTrade.tradeDate')" prop="tradeDate">
            <template slot-scope='scope'>
              <span>{{scope.row.tradeDate | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column :width="120" :label="$t('derivative.futuresAccountTrade.orderSysId')" prop="orderSysId">
          </el-table-column>
          <el-table-column :width="120" :label="$t('derivative.futuresAccountTrade.tradeId')" prop="tradeId">
          </el-table-column>
          <el-table-column align="center" :width="100" :label="$t('derivative.futuresAccountTrade.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :width="100" :label="$t('derivative.futuresAccountTrade.offsetFlag')" prop="offsetFlag">
            <template slot-scope="scope">
              <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
            </template>
          </el-table-column>
          <el-table-column :width="120" :label="$t('derivative.futuresAccountTrade.futuresContractCode')" prop="futuresContractCode"></el-table-column>
          <el-table-column align="right" :width="120" :label="$t('spotProj.exposure.list.price')" prop="price">
            <template slot-scope='scope'>
              <span>{{scope.row.price | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部 -->
        <div class='bottom-operate'>
          <!-- 分页 -->
          <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
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
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      tableData: [],
      selectData: null,
      total: 0,
      loading: true,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          documentNo: '',
          productCode: '',
          tradeDate: '',
          confirmStat: '1'
        },
        defaultSortString: 'id.asc'
      }
    }
  },
  props: {},
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('spotProj.exposure.dialog.title')
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true
      request({
        url: '/api/dvt/dvtFutureTrade/listNoMatch',
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
    },
    currentChange(val) {
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

<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.indealMatch.list.instructionName')" prop='instructionCode'>
                <base-select v-model="listQuery.data.instructionCode" :attrs="{data: 'INSTRUCTION',clearable:true, params:{auditStatus: '3',queryDate:queryDate}}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.instruction.tab.contractCode')" prop='contractCode'>
                <base-select v-model="listQuery.data.contractCode" :attrs="{data: 'FUTURES_CONTRACT',clearable:true}"></base-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn" v-permission="['query']">
            <el-button type="primary" @click="listData" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
        </el-form>
      </header>

      <main>
        <el-table stripe border ref="instrDetail" class='table-content tb-edit' :data="tableData" style="border:1px solid;" :height="250" @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
          <el-table-column type="selection" width="45" align='center'></el-table-column>
          <el-table-column align="right" width="120" :label="$t('strategy.indealMatch.list.canMatchLots')" prop="canMatchLots"></el-table-column>
          <el-table-column width="150" :label="$t('strategy.indealMatch.list.instructionName')" prop="instructionName"></el-table-column>
          <!-- 品种 -->
          <el-table-column width="120" :label="$t('strategy.instruction.tab.productCode')" prop="productCode"></el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.contractCode')" width="120" prop="contractCode">
          </el-table-column>
          <el-table-column align="center" :label="$t('strategy.instruction.tab.direction')" width="80" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('strategy.instruction.tab.offsetFlag')" width="80" prop="offsetFlag">
            <template slot-scope="scope">
              <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" :label="$t('strategy.instruction.tab.lots')" width="120" prop="lots">
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.unit')" width="90">
            <template slot-scope='scope'>
              <span>{{'5' | dataDictFormat($t('datadict.measurementUnit'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" :label="$t('strategy.instruction.tab.price')" width="120" prop="price">
            <template slot-scope='scope'>
              <span>{{scope.row.price | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" :label="$t('strategy.instruction.tab.priceDiff')" width="120" prop="priceDiff">
            <template slot-scope='scope'>
              <span>{{scope.row.priceDiff | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.currencyCode')" width="90" prop="currencyName"></el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.remark')" width="160" prop="remark"></el-table-column>
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
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import { dateFormate } from '@/utils/frame/base/index'

export default {
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      total: 0,
      loading: true,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          instructionCode: '',
          contractCode: '',
          auditStatus: '3',
          closeStat: '0'
        },
        defaultSortString: 'id.asc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.indealMatch.tab.instructionDialog')
    },
    queryDate() {
      return dateFormate(new Date(), 'YYYYMMDD')
    }
  },
  props: {
    instructionCode: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.listData()
  },
  watch: {
    instructionCode(val) {
      this.listData()
    }
  },
  methods: {
    listData() {
      this.loading = true
      this.listQuery.data.queryDate = this.queryDate
      request({
        url: '/api/strg/strgInstrDetail/listIndeal',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    cancel() {
      this.$emit('closeHandlerDialog')
    },
    save() {
      if (this.multipleSelection.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.multipleSelection)
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

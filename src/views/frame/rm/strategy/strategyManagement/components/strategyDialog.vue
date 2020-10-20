<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' style="height: 580px">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.strategyManagement.form.strategyName')" prop="strategyName">
                <input-validate v-model="listQuery.data.strategyName" :clearable='true'></input-validate>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item :label="$t('strategy.strategyManagement.form.deptCode')" prop='deptCode'>
                <TreeOrgBaseDept v-model="listQuery.data.deptCode" :clearable='true'></TreeOrgBaseDept>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.strategyManagement.form.productCode')" prop='productCode'>
                <base-select v-model="listQuery.data.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1'} ,filterable: true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.strategyManagement.form.projectCode')" prop='projectCode'>
                <base-select v-model="listQuery.data.projectCode" :attrs="{data: 'PROJECT',clearable: true,params:{auditStatus:'3', usingFlag:'1'}}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('strategy.strategyManagement.form.strategyNature')" prop='strategyNature'>
                <el-select v-model="listQuery.data.strategyNature" :placeholder="$t('biz.placeholder.choose')" :clearable='true'>
                  <el-option v-for="item in $t('datadict.strategyNature')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn">
            <el-button type="primary" @click="listData" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
        </el-form>
      </header>

      <main>
        <el-table style='border: 1px solid;' stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="250" :element-loading-text="$t('route.load')" :data="tableData" @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column width="80" :label="$t('strategy.strategyManagement.list.auditStat')" prop="auditStatus">
            <template slot-scope="scope">
              <span>{{scope.row.auditStatus | dataDictFormat($t('datadict.auditStatus'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.organName')" prop="organName"></el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.deptName')" prop="deptName"></el-table-column>
          <el-table-column width="150" :label="$t('strategy.strategyManagement.list.strategyName')" prop="strategyName"></el-table-column>
          <el-table-column width="150" :label="$t('strategy.strategyManagement.list.strategyCode')" prop="strategyCode"></el-table-column>
          <el-table-column width="80" :label="$t('strategy.strategyManagement.list.strategyNature')" prop="strategyNature">
            <template slot-scope="scope">
              <span>{{scope.row.strategyNature | dataDictFormat($t('datadict.strategyNature'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.purpose')" prop="typeName">
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.maxFund')" prop="maxFund">
            <template slot-scope="scope">
              {{scope.row.maxFund | moneyFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.limitLoss')" prop="limitLoss">
            <template slot-scope="scope">
              {{scope.row.limitLoss | moneyFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.expectProfit')" prop="expectProfit">
            <template slot-scope="scope">
              {{scope.row.expectProfit | moneyFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.riskProfitRatio')" prop="riskProfitRatio">
            <template slot-scope="scope">
              {{scope.row.riskProfitRatio | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.expectReturnRatio')" prop="expectReturnRatio">
            <template slot-scope="scope">
              {{scope.row.expectReturnRatio | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.projectName')" prop="projectName"></el-table-column>
          <el-table-column width="110" :label="$t('strategy.strategyManagement.list.strgLevel')" prop="strgLevel">
            <template slot-scope="scope">
              <span>{{scope.row.strgLevel | dataDictFormat($t('datadict.strgLevel'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.makeDate')" prop="makeDate">
            <template slot-scope="scope">
              <span>{{scope.row.makeDate | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.startDate')" prop="startDate">
            <template slot-scope="scope">
              <span>{{scope.row.startDate | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('strategy.strategyManagement.list.endDate')" prop="endDate">
            <template slot-scope="scope">
              <span>{{scope.row.endDate | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column width="80" :label="$t('strategy.strategyManagement.list.applicantName')" prop="applicantName"></el-table-column>
          <el-table-column width="80" :label="$t('strategy.strategyManagement.list.optEmployeeName')" prop="optEmployeeName"></el-table-column>
        </el-table>

        <!-- 底部 -->
        <div class='bottom-operate'>
          <!-- 分页 -->
          <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>

        <hedgeDetail style='border: 1px solid;' ref="detailList" :height="150" :itemClass='itemClassF' :strategyCode=this.strategyCodeF v-if="this.selectData.strategyNature==='1'||this.selectData.strategyNature==='6'"></hedgeDetail>
        <futuresArbitrageDetail ref="detailList" :height="150" :itemClass='itemClassF' :strategyCode=this.strategyCodeF v-if="this.selectData.strategyNature==='2'"></futuresArbitrageDetail>
        <spotArbitrageDetail ref="detailList" :height="150" :itemClass='itemClassF' :strategyCode=this.strategyCodeF v-if="this.selectData.strategyNature==='3'"></spotArbitrageDetail>
        <futuresUnilateralDetail ref="detailList" :height="150" :itemClass='itemClassF' :strategyCode=this.strategyCodeF v-if="this.selectData.strategyNature==='4'"></futuresUnilateralDetail>
        <spotUnilateralDetail ref="detailList" :height="150" :itemClass='itemClassF' :strategyCode=this.strategyCodeF v-if="this.selectData.strategyNature==='5'"></spotUnilateralDetail>
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
import hedgeDetail from '@/views/frame/rm/strategy/strategyManagement/components/hedgeDetail'
import futuresArbitrageDetail from '@/views/frame/rm/strategy/strategyManagement/components/futuresArbitrageDetail'
import spotArbitrageDetail from '@/views/frame/rm/strategy/strategyManagement/components/spotArbitrageDetail'
import futuresUnilateralDetail from '@/views/frame/rm/strategy/strategyManagement/components/futuresUnilateralDetail'
import spotUnilateralDetail from '@/views/frame/rm/strategy/strategyManagement/components/spotUnilateralDetail'
import { dateFormate } from '@/utils/frame/base/index'
import TreeOrgBaseDept from '@/views/frame/base/organ/components/TreeOrgBaseDept'
export default {
  components: {
    hedgeDetail,
    futuresArbitrageDetail,
    spotArbitrageDetail,
    futuresUnilateralDetail,
    spotUnilateralDetail,
    TreeOrgBaseDept
  },
  data() {
    return {
      tableData: [],
      selectData: {},
      total: 0,
      loading: true,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          strategyCode: '',
          direction: '',
          strategyNature: '',
          strgLevel: '',
          strgLevels: []
        },
        defaultSortString: 'strategyCode.desc'
      },
      strategyCodeF: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.strategyManagement.dialog.title')
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
    strategyNature: {
      type: String,
      default: ''
    },
    strategyNatures: Array,
    strgLevel: {
      type: String,
      default: ''
    },
    itemClassF: {
      type: String,
      default: ''
    },
    queryUrl: {
      type: String,
      default: 'list'
    },
    planApplicant: {
      type: String,
      default: ''
    },
    strgLevels: Array
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true

      this.listQuery.data.strategyCode = this.strategyCode
      if (this.direction) {
        this.listQuery.data.direction = this.direction
      }
      if (this.itemClassF) {
        this.listQuery.data.itemClass = this.itemClassF
      }
      if (this.strategyNature) {
        this.listQuery.data.strategyNature = this.strategyNature
      }
      if (this.strategyNatures != null && this.strategyNatures.length > 0) {
        this.listQuery.data.strategyNatures = this.strategyNatures
      }
      if (this.strgLevels != null && this.strgLevels.length > 0) {
        this.listQuery.data.strgLevels = this.strgLevels
      }
      if (this.planApplicant != null && this.planApplicant.length > 0) {
        this.listQuery.data.planApplicant = this.planApplicant
      }

      this.listQuery.data.closeStat = '0'
      this.listQuery.data.auditStatus = '3'
      var date = dateFormate(new Date(), 'YYYYMMDD')
      this.listQuery.data.queryDate = date
      request({
        url: '/api/strg/strategy/' + this.queryUrl,
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
        this.selectData = {}
        this.$refs.detailList.tableData = []
      })
    },
    handleDbclick(data) {
      this.$emit('confirm', data)
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (!this.selectData) {
        if (!this.buyCurrentRow) {
          Notification(
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
      this.strategyCodeF = val.strategyCode
    }
  }
}
</script>

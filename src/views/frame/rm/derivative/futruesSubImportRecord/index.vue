<template>
  <div class='app-container'>
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <!-- 子账号		  -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futruesSubImportRecord.derivativeSubAccount')" prop='derivativeSubAccount'>
              <!-- <input-validate v-model.trim="listQuery.data.derivativeSubAccount" :placeholder="$t('biz.placeholder.input')"></input-validate> -->
              <derivative-sub-account-list clearable v-model="listQuery.data.derivativeSubAccount" :placeholder="$t('biz.placeholder.input')"></derivative-sub-account-list>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futruesSubImportRecord.tradingDay')" prop='tradingDay'>
              <el-row :gutter="0">
                <el-col :span="11">
                  <el-date-picker v-model="listQuery.data.tradingDayFrom" @change="changeStartTime" :picker-options='dateStartBefore' type="date" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                  </el-date-picker>
                </el-col>
                <el-col :span="2" align='center'>~</el-col>
                <el-col :span="11">
                  <el-date-picker v-model="listQuery.data.tradingDayTo" @change="changeEndTime" :picker-options='dateEndBefore' type="date" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <!-- 导入时间 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futruesSubImportRecord.importDate')" prop='importDate'>
              <el-row :gutter="0">
                <el-col :span="11">
                  <el-date-picker v-model="listQuery.data.importDateFrom" @change="changeStartTime" :picker-options='dateStartBefore' type="date" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                  </el-date-picker>
                </el-col>
                <el-col :span="2" align='center'>~</el-col>
                <el-col :span="11">
                  <el-date-picker v-model="listQuery.data.importDateTo" @change="changeEndTime" :picker-options='dateEndBefore' type="date" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 右侧搜索按钮 -->
        <div class="search-btn" v-permission="['query']">
          <el-button type="primary" @click="getList" v-db-click>
            {{$t('biz.lbl.search')}}
          </el-button>
        </div>
        <!-- 展开收起 -->
        <div class='expand' @click='expand' v-show='true'>
          <i v-if='expandStatus' class='el-icon-arrow-up'></i>
          <i v-else class='el-icon-arrow-down'></i>
        </div>
      </el-form>
    </header>

    <!-- 下面的主题内容 各个弹出框 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <!-- 每个功能按钮 -->
      <div class="top-operate">
        <el-row type='flex'>
          <div>
            <el-button v-db-click size="mini" v-permission="['import']" @click='addItem' style='margin-right:3px;'>
              <svg-icon icon-class="线性-上传"></svg-icon>{{this.$t('biz.btn.exportData')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['refresh']" @click='getList' style='margin-right:3px;'>
              <svg-icon icon-class="线性-刷新"></svg-icon>{{this.$t('biz.btn.refresh')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['export']" @click='handleDownload' style='margin-right:3px;'>
              <svg-icon icon-class="线性-导出"></svg-icon>{{this.$t('biz.btn.export')}}
            </el-button>
          </div>
        </el-row>
      </div>
      <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight' @current-change="handleSelectRow">
        <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
        <!-- 子账号	-->
        <el-table-column prop='derivativeSubAccount' :label="$t('derivative.futruesSubImportRecord.derivativeSubAccount')" width='120' show-overflow-tooltip></el-table-column>
        <!-- 交易日期	-->
        <el-table-column align='center' prop='tradingDay' :label="$t('derivative.futruesSubImportRecord.tradingDay')" width='100' show-overflow-tooltip>
          <template slot-scope='scope'>
            <span>{{scope.row.tradingDay | dateFormat}}</span>
          </template>
        </el-table-column>
        <!-- 导入时间	 -->
        <el-table-column align='center' prop='uploadDt' :label="$t('derivative.futruesSubImportRecord.uploadDt')" width='160' show-overflow-tooltip>
          <template slot-scope='scope'>
            <span>{{scope.row.uploadDt}}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部 -->
      <div class='bottom-operate'>
        <div class="bottom-operate-left" v-show='emptyTextVisible'>
          <svg-icon icon-class="线性-惊叹号"></svg-icon>{{$t('table.emptyText')}}
        </div>
        <!-- 分页 -->
        <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/frame/base/downloadExcel'
// import { parseTime } from '@/utils/frame/base/index'
import { getList } from '@/api/frame/rm/derivative/futruesSubImportRecord'
// import { notifySuccess } from '@/utils/frame/base/notifyParams'
import elementFun from '@/utils/frame/base/elementFun'
import derivativeSubAccountList from '@/views/frame/rm/derivative/components/futureSubAcount'

export default {
  name: 'futruesSubImportRecord',
  data() {
    return {
      expandStatus: process.env.EXPAND_FLG,
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      currentRow: null,
      tableHeight: 0,
      colMap: {
        derivativeSubAccount: this.$t(
          'derivative.futruesSubImportRecord.derivativeSubAccount'
        ),
        tradingDay: this.$t('derivative.futruesSubImportRecord.tradingDay'),
        uploadDt: this.$t('derivative.futruesSubImportRecord.uploadDt')
      },
      tableKey: 0,
      tableHeaders: [],
      tableId: 'futruesSubImportRecord',
      showTabColSetDialog: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      // 当前系统时间
      loading: false,
      status: false,
      tableData: [],
      type: '',
      total: null,
      dateStartBefore: {},
      dateEndBefore: {},
      isShow: false, // 是否显示取消按钮
      submitId: '',
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          tradingDayFrom: '',
          tradingDayTo: '',
          importDateFrom: '',
          importDateTo: '',
          derivativeAccount: ''
        },
        sorString: ''
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  created() {
    if (process.env.EXPAND_FLG) {
      this.tableComputed()
    }
  },
  watch: {
    $route(to, from) {
      // 保存成功刷新列表
      if (this.$route.query.refresh) {
        this.getList()
      }
    }
  },
  components: {
    derivativeSubAccountList
  },
  mounted() {
    // 初始化数据
    this.getList()
  },
  methods: {
    ...elementFun,
    // 展开收起
    expand() {
      this.expandStatus = !this.expandStatus
      this.tableComputed()
    },
    // 单选
    handleSelectRow(val) {
      this.currentRow = val
    },
    // 计算列表高度
    tableComputed() {
      this.$nextTick(() => {
        const getElHeadHeight = window
          .getComputedStyle(document.getElementById('elHead'))
          .height.split('px')[0]
        this.tableHeight =
          this.clientWidth < 1366
            ? this.clientHeight - getElHeadHeight - 188
            : this.clientHeight - getElHeadHeight - 172
      })
    },
    // 页码跳转
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },
    stateShow(val) {
      this.showTabColSetDialog = val.show
    },
    handleHeaderSaved(val) {
      this.showTabColSetDialog = val.show
      this.getTableHeaders()
      this.getList()
    },
    // 列表请求
    getList() {
      this.loading = true
      getList(this.listQuery, this.func)
        .then(response => {
          this.tableData = response.data
          this.total = response.total
          this.loading = false
          if (this.total && this.total > 0) {
            this.emptyTextVisible = false
          } else {
            this.emptyTextVisible = true
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 重置查询表单
    resetForm() {
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields()
        this.listQuery.data.tradingDayFrom = ''
        this.listQuery.data.tradingDayTo = ''
        this.listQuery.data.importDateFrom = ''
        this.listQuery.data.importDateTo = ''
        this.listQuery.data.derivativeAccount = ''
        this.getList()
      }
    },

    // 新增
    addItem() {
      this.$router.push({
        name: 'futuresSubImport',
        params: {
          url: 'futruesSubImportRecord'
        }
      })
    },

    // 导出excel
    exportfunc() {
      this.loading = true
      this.listQuery.isPage = false
      return getList(this.listQuery, this.func)
    },
    callBackfunc() {
      this.listQuery.isPage = true
      this.loading = false
    },
    // 导出
    handleDownload() {
      exportExcel({
        fileName: this.$t('derivative.futruesSubImportRecord.title'),
        header: [
          this.$t('derivative.futruesSubImportRecord.derivativeSubAccount'),
          this.$t('derivative.futruesSubImportRecord.tradingDay'),
          this.$t('derivative.futruesSubImportRecord.uploadDt')
        ],
        filterVal: ['derivativeSubAccount', 'tradingDay', 'uploadDt'],
        exportfunc: this.exportfunc,
        callBackfunc: this.callBackfunc
      })
    }
  }
}
</script>

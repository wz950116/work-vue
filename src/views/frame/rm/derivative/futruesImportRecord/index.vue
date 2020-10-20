<template>
  <div class='app-container'>
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <!-- 期货账号	  -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futruesImportRecord.derivativeAccount')" prop='derivativeAccount'>
              <el-select v-model="listQuery.data.derivativeAccount" clearable filterable :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="(item, index) in derAccount" :key="index" :label="item.key" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futruesImportRecord.tradingDay')" prop='tradingDay'>
              <el-row :gutter="0">
                <el-col :span="11">
                  <el-date-picker v-model="listQuery.data.tradingDayFrom" type="date" @change="changeStartTime" :picker-options='dateStartBefore' range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
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
            <el-form-item :label="$t('derivative.futruesImportRecord.importDate')" prop='importDate'>
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
          <!-- 客户名称	  -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futruesImportRecord.customerName')" prop='mainName'></el-form-item>
          </el-col>
          <template v-if="expandStatus">
            <!-- 期货公司名称 -->
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futruesImportRecord.brokerName')" prop='brokerName'></el-form-item>
            </el-col>
          </template>
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
            <el-button v-db-click size="mini" @click='addItem' style='margin-right:3px;' v-permission="['import']">
              <svg-icon icon-class="线性-上传"></svg-icon>{{this.$t('biz.btn.exportData')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" @click='doDelete' style='margin-right:3px;' v-permission="['remove']">
              <svg-icon icon-class="线性-删除"></svg-icon>{{this.$t('biz.btn.delete')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" @click='doView' style='margin-right:3px;' v-permission="['view']">
              <svg-icon icon-class="线性-查看"></svg-icon>{{this.$t('biz.btn.view')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" @click='getList' style='margin-right:3px;' v-permission="['refresj']">
              <svg-icon icon-class="线性-刷新"></svg-icon>{{this.$t('biz.btn.refresh')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" @click='handleDownload' style='margin-right:3px;' v-permission="['export']">
              <svg-icon icon-class="线性-导出"></svg-icon>{{this.$t('biz.btn.export')}}
            </el-button>
          </div>
        </el-row>
      </div>
      <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight' @current-change="handleSelectRow">
        <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
        <!-- 期货账号	-->
        <el-table-column prop='derivativeAccount' :label="$t('derivative.futruesImportRecord.derivativeAccount')" width='120'></el-table-column>
        <!-- 交易日期	-->
        <el-table-column align='center' prop='tradingDay' :label="$t('derivative.futruesImportRecord.tradingDay')" width='100'>
          <template slot-scope='scope'>
            <span>{{scope.row.tradingDay | dateFormat}}</span>
          </template>
        </el-table-column>
        <!-- 导入时间	 -->
        <el-table-column align='center' prop='uploadDt' :label="$t('derivative.futruesImportRecord.uploadDt')" width='160'>
          <template slot-scope='scope'>
            <span>{{scope.row.uploadDt}}</span>
          </template>
        </el-table-column>
        <!-- 客户名称	 -->
        <el-table-column prop='mainName' :label="$t('derivative.futruesImportRecord.customerName')" width='120'></el-table-column>
        <!-- 期货公司名称 -->
        <el-table-column prop='brokerName' :label="$t('derivative.futruesImportRecord.brokerName')" width='120'></el-table-column>
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
    <!-- 编辑框 -->
    <edit-dialog v-el-drag-dialog v-if='dialogVisible' @close='dialogHandler' :type='dialogType' :id='dialogId'></edit-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/frame/base/downloadExcel'
import { parseTime } from '@/utils/frame/base/index'
import {
  getList,
  listDerivativeAccount,
  listMainName,
  listAllBrokerName,
  deleteImportData
} from '@/api/frame/rm/derivative/futruesImportRecord'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import elementFun from '@/utils/frame/base/elementFun'

export default {
  name: 'futruesImportRecord',
  data() {
    return {
      expandStatus: process.env.EXPAND_FLG,
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      currentRow: null,
      tableHeight: 0,
      colMap: {
        derivativeAccount: this.$t(
          'derivative.futruesImportRecord.derivativeAccount'
        ),
        tradingDay: this.$t('derivative.futruesImportRecord.tradingDay'),
        uploadDt: this.$t('derivative.futruesImportRecord.uploadDt'),
        mainName: this.$t('derivative.futruesImportRecord.mainName'),
        brokerName: this.$t('derivative.futruesImportRecord.brokerName')
      },
      tableKey: 0,
      tableHeaders: [],
      tableId: 'futruesImportRecord',
      showTabColSetDialog: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      listAllBrokerName: [],
      listMainName: [],
      dateStartBefore: {},
      dateEndBefore: {},
      // 当前系统时间
      date: parseTime(new Date(), '{y}{m}{d}'),
      loading: false,
      status: false,
      tableData: [],
      derAccount: [],
      type: '',
      total: null,
      dialogId: null,
      multipleSelection: [],
      dialogVisible: false,
      bpmProcessDefineKey: 'CTRMApproveFuturesAccountTradeSheet',
      isShow: false, // 是否显示取消按钮
      submitId: '',
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          customerName: '',
          tradingDayFrom: '',
          tradingDayTo: '',
          importDateFrom: '',
          importDateTo: '',
          brokerName: '',
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
  components: {},
  mounted() {
    // 查询期货账号列表
    listDerivativeAccount()
      .then(response => {
        this.derAccount = response.data
      })
      .catch(() => { })
    // 客户名称
    listMainName()
      .then(response => {
        this.listMainName = response.data
      })
      .catch(() => { })
    // 查询期货公司
    listAllBrokerName()
      .then(response => {
        this.listAllBrokerName = response.data
      })
      .catch(() => { })
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
      this.getList()
    },
    // 查看行
    doView() {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      const row = this.currentRow
      this.$router.push({
        name: 'futuresAccountImport',
        params: {
          type: 'view',
          id: row.id
        }
      })
    },
    doDelete() {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      const row = this.currentRow
      if (row) {
        this.$confirm(
          this.$t('biz.msg.confirmDelete'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            deleteImportData(
              { data: row.id },
              {
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.delete')
              }
            )
              .then(response => {
                this.$notify(
                  notifySuccess({ msg: this.$t('biz.msg.deleteSuccess') })
                )
                this.loading = false
                this.getList()
              })
              .catch(() => { })
          })
          .catch(() => { })
      }
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
    // 删除多行
    deleteItem() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(
          this.$t('biz.msg.confirmDelete'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            const deleteArr = []
            this.multipleSelection.forEach(select => {
              deleteArr.push(select.id)
            })
            this.confirmDelete(deleteArr)
          })
          .catch(() => { })
      } else {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    // 新增
    addItem() {
      this.$router.push({
        name: 'futuresAccountImport',
        params: {
          url: 'futruesImportRecord'
        }
      })
    },
    // 更新
    doUpdate(row, event) {
      event.stopPropagation()
      if (row) {
        this.dialogVisible = true
        this.dialogType = 'update'
        this.dialogId = row.id
      }
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
    // 关闭弹窗回调
    dialogHandler(params) {
      this.dialogVisible = false
      if (params) {
        this.getList()
      }
    },

    // 文件校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 文件上传
    handleSuccess({ results, header }) {
      if (results) {
        // 导入的价格必须为数字
        const obj = {}
        this.pageLoading = true
        this.excelData = []
        var date = parseTime(new Date(), '{y}{m}{d}')
        results.forEach(element => {
          obj.moduleCode = this.moduleCode
          obj.mainName = element['主体名称']
          obj.derivativeAccount = element['期货账号']
          obj.tradingDay = element['交易日期']
          obj.uploadDt = element['导入时间']
          obj.customerName = element['客户名称']
          obj.brokerName = element['期货公司名称']
          obj.disabled = true
          obj.id = null
          obj.authVirture = 0

          // 交易日期非空校验
          if (obj.tradingDay === undefined) {
            obj.result = '交易日期不能为空!'
            this.pageLoading = false
          }
          if (obj.tradingDay !== date) {
            obj.result = '交易日期必须为当日!'
            this.pageLoading = false
          }
          // 导入日期非空校验
          if (obj.uploadDt === undefined) {
            obj.result = '导入日期不能为空!'
            this.pageLoading = false
          }
          this.excelData.push(obj)
        })
        this.showDialog = true
      }
    },
    // 导出
    handleDownload() {
      exportExcel({
        fileName: this.$t('derivative.futruesImportRecord.title'),
        header: [
          this.$t('derivative.futruesImportRecord.derivativeAccount'),
          this.$t('derivative.futruesImportRecord.tradingDay'),
          this.$t('derivative.futruesImportRecord.uploadDt'),
          this.$t('derivative.futruesImportRecord.customerName'),
          this.$t('derivative.futruesImportRecord.brokerName')
        ],
        filterVal: [
          'derivativeAccount',
          'tradingDay',
          'uploadDt',
          'mainName',
          'brokerName'
        ],
        exportfunc: this.exportfunc,
        callBackfunc: this.callBackfunc
      })
    }
  }
}
</script>

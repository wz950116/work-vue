<template>
  <div class="app-container calendar-list-container">
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <!-- form的版面 -->
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data"
        class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <!-- 期货账号 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountBalance.derivativeAccount')" prop='derivativeAccount'>
              <derivative-account-list clearable v-model="listQuery.data.derivativeAccount"
                :placeholder="$t('biz.placeholder.input')"></derivative-account-list>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountBalance.tradingDay')" prop='tradingDay'>
              <el-row>
                <el-col :span="11">
                  <el-date-picker v-model="listQuery.data.tradingDayFrom" @change="changeStartTime"
                    :picker-options='dateStartBefore' type="date" range-separator="-"
                    :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                  </el-date-picker>
                </el-col>
                <el-col :span="2" align='center'>~</el-col>
                <el-col :span="11">
                  <el-date-picker v-model="listQuery.data.tradingDayTo" type="date" @change="changeEndTime"
                    :picker-options='dateEndBefore' range-separator="-" :placeholder="$t('biz.placeholder.dateInput')"
                    format="yyyy-MM-dd" value-format='yyyyMMdd'>
                  </el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 右侧搜索按钮 -->
        <div class="search-btn" v-permission="['query']">
          <el-button type="primary" @click="onSubmit" v-db-click>
            {{this.$t('biz.lbl.search')}}
          </el-button>
        </div>
      </el-form>
    </header>

    <!-- 下面的主题内容 各个弹出框 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <!-- 每个功能按钮 -->
      <div class="top-operate">
        <el-row type='flex'>
          <div>
            <!-- 修改 -->
            <el-button v-db-click size="mini" v-permission="['update']" @click='doUpdate' style='margin-right:3px;'>
              <svg-icon icon-class="线性-修改"></svg-icon>{{this.$t('biz.btn.update')}}
            </el-button>
          </div>
          <div>
            <!-- 文件导入 -->
            <el-button v-db-click size="mini" v-permission="['import']" @click='addItem' style='margin-right:3px;'>
              <svg-icon icon-class="线性-导入"></svg-icon>{{this.$t('biz.btn.import')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['refresh']" @click='getList' style='margin-right:3px;'>
              <svg-icon icon-class="线性-刷新"></svg-icon>{{this.$t('biz.btn.refresh')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['export']" @click='handleDownload'
              style='margin-right:3px;'>
              <svg-icon icon-class="线性-导出"></svg-icon>{{this.$t('biz.btn.export')}}
            </el-button>
          </div>
        </el-row>
      </div>
      <el-table :key="key" stripe border class='table-content' ref="singleTable" highlight-current-row
        v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')"
        :data="tableData" :height='tableHeight' @current-change="handleSelectRow">
        <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
        <el-table-column v-for="col in formThead" :key="col.prop" v-bind='col' :fixed='col.fixed' sortable
          show-overflow-tooltip>
          {{col.label}}
          <el-table-column-set :bind='col' :id='tableId' :checked="checked" :checkList="tableCols" @change="checkChange"
            @ascending='handleAscending' @descending='handleDescending' @lockEvent='handleLockChange(col.prop)'>
          </el-table-column-set>
          <template slot-scope='scope'>
            <div :style='col.style'>
              <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
              <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict) }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部 -->
      <div class='bottom-operate'>
        <div class="bottom-operate-left" v-show='emptyTextVisible'>
          <svg-icon icon-class="线性-惊叹号"></svg-icon>{{$t('table.emptyText')}}
        </div>
        <!-- 分页 -->
        <el-pagination small background layout="total, sizes, prev, pager, next, jumper"
          :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size"
          :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </main>

    <!-- 编辑框 -->
    <edit-dialog v-if='dialogVisible' @closeHandler='dialogHandler' :type='dialogType' :id='dialogId'></edit-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { mapGetters } from 'vuex'
import elementFun from '@/utils/frame/base/elementFun'
import editDialog from './editDialog'
import exportExcel from '@/utils/frame/base/downloadExcel'
import { parseTime } from '@/utils/frame/base/index'
import {
  getList,
  doDelete
} from '@/api/frame/rm/derivative/futuresAccountBalance'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import sysInitSetting from '@/api/proj/sys/sysInitSetting'
import derivativeAccountList from '@/views/frame/rm/derivative/components/futureAcount'

export default {
  name: 'futuresAccountBalance',
  data() {
    return {
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      tableHeight: 0,
      currentRow: null,
      key: 1,
      tableHeaders: [],
      tableId: 'futuresAccountBalance',
      // 当前展示的头
      formThead: [],
      // 表头数据
      tableCols: [
        {
          prop: 'derivativeAccount',
          label: this.$t('derivative.futuresAccountBalance.derivativeAccount'),
          fixed: false,
          width: '120'
        },
        {
          prop: 'tradingDay',
          label: this.$t('derivative.futuresAccountBalance.tradingDay'),
          fixed: false,
          align: 'center',
          width: '100',
          format: {
            func: 'dateFormat',
            dict: 'YYYY-MM-DD'
          }
        },
        {
          prop: 'preBalance',
          label: this.$t('derivative.futuresAccountBalance.preBalance'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'fundInOut',
          label: this.$t('derivative.futuresAccountBalance.fundInOut'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'closeProfit',
          label: this.$t('derivative.futuresAccountBalance.closeProfit'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'positionProfit',
          label: this.$t('derivative.futuresAccountBalance.positionProfit'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'commission',
          label: this.$t('derivative.futuresAccountBalance.commission'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'posiMargin',
          label: this.$t('derivative.futuresAccountBalance.posiMargin'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'available',
          label: this.$t('derivative.futuresAccountBalance.available'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'balance',
          label: this.$t('derivative.futuresAccountBalance.balance'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'reserve',
          label: this.$t('derivative.futuresAccountBalance.reserve'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'riskDegree',
          label: this.$t('derivative.futuresAccountBalance.riskDegree'),
          fixed: false,
          align: 'right',
          width: '100',
          format: {
            func: 'percent',
            dict: 4
          }
        },
        {
          prop: 'mainName',
          label: this.$t('derivative.futuresAccountBalance.mainName'),
          width: '100',
          fixed: false
        },
        {
          prop: 'preliminaryFlag',
          label: this.$t('derivative.futuresAccountTrade.preliminaryFlag'),
          fixed: false,
          width: '100',
          align: 'center',
          format: {
            dict: this.$t('datadict.yesNo')
          }
        }
      ],
      // 列设置
      checked: [],
      showTabColSetDialog: false,

      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      openFlag: false,
      // 当前系统时间
      date: parseTime(new Date(), '{y}{m}{d}'),
      loading: true,
      status: false,
      tableData: [],
      type: '',
      total: null,
      dialogId: null,
      multipleSelection: [],
      dialogVisible: false,
      dateStartBefore: {},
      dateEndBefore: {},
      bpmProcessDefineKey: 'CTRMApproveFuturesAccountTradeSheet',
      isShow: false, // 是否显示取消按钮
      submitId: '',
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          tradingDayFrom: '',
          tradingDayTo: '',
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
    },
    tableCols(valArr) {
      this.formThead = this.tableCols.filter(i => {
        if (i.checkFlag) {
          return !!+i.checkFlag
        } else {
          return true
        }
      })
      this.key++ // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  components: {
    editDialog,
    derivativeAccountList
  },
  beforeMount() {
    // 列设置
    this.formThead = this.tableCols
    this.checkChange()
  },
  mounted() {
    sysInitSetting.getFlag().then(response => {
      this.openFlag = response.data
    })
    // 初始化数据
    this.getList()
  },
  methods: {
    // 返回指定过滤条件结果
    dataFormat(func = 'dataDictFormat', value, list) {
      return Vue.filter(func)(value, list)
    },
    // 列设置
    checkChange() {
      this.checked = []
      request({
        url: '/api/sys/tableConfig/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.tableId
        }
      })
        .then(res => {
          if (res.data.length === 0) {
            this.tableCols.forEach(col => {
              col.checkFlag = '1'
            })
            this.checked = this.tableCols.map(v => {
              return v.prop
            })
          } else {
            res.data.forEach(col => {
              this.tableCols.forEach(c => {
                if (col.itemId === c.prop) {
                  c.checkFlag = col.checkFlag
                  c.sortNo = col.sortNo
                  if (c.checkFlag === '1') {
                    this.checked.push(c.prop)
                  }
                }
              })
            })
            this.tableCols = this.tableCols.sort((obj1, obj2) => {
              const value1 = obj1['sortNo']
              const value2 = obj2['sortNo']
              return value1 - value2
            })
          }
        })
        .catch(() => {})
    },
    // 后台排序
    handleSortChange(column, prop, order) {},
    // 是否锁定
    handleLockChange(prop) {
      const arr = []
      this.tableCols.forEach((c, index) => {
        if (c.prop === prop) {
          c.fixed = !c.fixed
        }
        arr.push(c)
      })
      this.tableCols = arr
    },
    // 处理升序
    handleAscending(column) {
      this.$refs.singleTable.sort(column.prop, 'ascending')
    },
    // 处理降序
    handleDescending(column) {
      this.$refs.singleTable.sort(column.prop, 'descending')
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

    ...elementFun,
    stateShow(val) {
      this.showTabColSetDialog = val.show
    },
    handleHeaderSaved(val) {
      this.showTabColSetDialog = val.show
      // this.getTableHeaders()
      this.getList()
    },
    // getTableHeaders() {
    //   this.func.funcOperation = this.$t('biz.btn.search')
    //   tableConfigApi.getTableConfig(this.tableId, this.func).then(res => {
    //     this.tableHeaders = tableConfigApi.getDefaultHeaders(
    //       this.colMap,
    //       res.data
    //     )
    //   })
    // },

    // 列表请求
    getList() {
      this.loading = true
      getList(this.listQuery, this.func)
        .then(response => {
          this.tableData = response.data
          this.total = response.total
          if (this.total > 0) {
            this.emptyTextVisible = false
          }
          this.loading = false
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
          .catch(() => {})
      } else {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    // 删除单行
    doDelete(row, event) {
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
            this.confirmDelete([row.id])
          })
          .catch(() => {})
      }
    },
    confirmDelete(params) {
      this.loading = true
      doDelete(params, this.func)
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.deleteSuccess') }))
          this.loading = false
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 新增
    addItem() {
      this.$router.push({
        name: 'futuresAccountImport',
        params: {
          url: 'futuresAccountBalance'
        }
      })
    },
    // 更新
    doUpdate() {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      const row = this.currentRow
      if (row.preliminaryFlag === '1' && this.openFlag) {
        this.$notify(
          notifyInfo({
            msg: this.$t('期初不允许修改！')
          })
        )
        return
      }
      this.dialogVisible = true
      this.dialogType = 'update'
      this.dialogId = row.id
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
          obj.preBalance = element['上日结存']
          obj.fundInOut = element['资金存取']
          obj.closeProfit = element['平仓盈亏']
          obj.positionProfit = element['持仓盈亏']
          obj.commission = element['手续费']
          obj.posiMargin = element['持仓保证金']
          obj.available = element['可用资金']
          obj.balance = element['期末权益']
          obj.reserve = element['当日结存']
          obj.disabled = true
          obj.id = null
          obj.authVirture = 0

          // 交易日期非空校验
          if (element.tradingDay === undefined) {
            obj.result = '交易日期不能为空!'
            this.pageLoading = false
          }
          if (element.tradingDay !== date) {
            obj.result = '交易日期必须为当日!'
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
        fileName: this.$t('derivative.futuresAccountBalance.title'),
        header: [
          this.$t('derivative.futuresAccountBalance.derivativeAccount'),
          this.$t('derivative.futuresAccountBalance.tradingDay'),
          this.$t('derivative.futuresAccountBalance.preBalance'),
          this.$t('derivative.futuresAccountBalance.fundInOut'),
          this.$t('derivative.futuresAccountBalance.closeProfit'),
          this.$t('derivative.futuresAccountBalance.positionProfit'),
          this.$t('derivative.futuresAccountBalance.commission'),
          this.$t('derivative.futuresAccountBalance.posiMargin'),
          this.$t('derivative.futuresAccountBalance.available'),
          this.$t('derivative.futuresAccountBalance.balance'),
          this.$t('derivative.futuresAccountBalance.reserve'),
          this.$t('derivative.futuresAccountBalance.mainName'),
          this.$t('spotProj.cost.list.preliminaryFlag')
        ],
        filterVal: [
          'derivativeAccount',
          'tradingDay',
          'preBalance',
          'fundInOut',
          'closeProfit',
          'positionProfit',
          'commission',
          'posiMargin',
          'available',
          'balance',
          'reserve',
          'mainName',
          {
            val: 'preliminaryFlag',
            dicCode: this.$t('datadict.yesNo')
          }
        ],
        exportfunc: this.exportfunc,
        callBackfunc: this.callBackfunc
      })
    }
  }
}
</script>

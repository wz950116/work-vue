<template>
  <div class="app-container">
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <!-- 子账号 -->
          <el-col :span="7">
            <el-form-item :label="$t('derivative.futruesSubAccount.derivativeSubAccount')" prop='derivativeSubAccount'>
              <derivative-sub-accountList clearable v-model="listQuery.data.derivativeSubAccount" :placeholder="$t('biz.placeholder.input')"></derivative-sub-accountList>
            </el-form-item>
          </el-col>
          <!-- 项目	-->
          <el-col :span="7">
            <el-form-item :label="$t('derivative.futruesSubAccount.projectName')" prop='projectName'>
              <el-select clearable v-model="listQuery.data.projectName" filterable :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="(item,index) in projectNameList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="7">
            <el-form-item :label="$t('derivative.futruesSubAccount.tradingDay')" prop='tradingDay'>
              <el-col :span="11">
                <el-date-picker v-model="listQuery.data.tradingDayFrom" @change="changeStartTime" :picker-options='dateStartBefore' type="date" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                </el-date-picker>
              </el-col>
              <el-col :span="2" align='center'>~</el-col>
              <el-col :span="11">
                <el-date-picker v-model="listQuery.data.tradingDayTo" @change="changeEndTime" :picker-options='dateEndBefore' type="date" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 右侧搜索按钮 -->
        <div class="search-btn">
          <el-button type="primary" v-permission="['query']" @click="onSubmit" size="medium">
            {{this.$t('biz.lbl.search')}}
          </el-button>
        </div>
      </el-form>
    </header>

    <!-- 下面的主题内容 各个弹出框 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <!-- 顶部按钮 -->
      <div class="top-operate">
        <el-row type='flex'>
          <div>
            <el-button size="mini" v-permission="['update']" @click='doUpdate' style='margin-right:3px;' v-db-click>
              <svg-icon icon-class="线性-修改"></svg-icon>{{this.$t('biz.btn.update')}}
            </el-button>
          </div>
          <div>
            <el-button size="mini" v-permission="['import']" @click='gotoLoadFile' style='margin-right:3px;' v-db-click>
              <svg-icon icon-class="线性-导入"></svg-icon>{{this.$t('biz.btn.exportData')}}
            </el-button>
          </div>
        </el-row>
      </div>

      <el-table :key="key" stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight' @current-change="handleSelectRow" @sort-change="handleSortChange">
        <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
        <el-table-column v-for="col in formThead" :key="col.prop" v-bind='col' :fixed='col.fixed' sortable show-overflow-tooltip>
          <template slot="header">
            {{col.label}}
            <el-table-column-set :bind='col' :id='tableId' :checked="checked" :checkList="tableCols" @change="checkChange" @ascending='handleAscending' @descending='handleDescending' @lockEvent='handleLockChange(col.prop)'>
            </el-table-column-set>
          </template>
          <template slot-scope='scope'>
            <div :style='col.style'>
              <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
              <span v-else-if="col.format.type === 'dict'">{{ scope.row[col.prop] | dataDictFormat(col.format.dict) }}</span>
              <span v-else-if="col.format.type === 'date'">{{ scope.row[col.prop] | dateFormat('') }}</span>
              <span v-else-if="col.format.type === 'HHMMSS'">{{ scope.row[col.prop] | dateFormat('HH:mm:ss') }}</span>
              <span v-else-if="col.format.type === 'money'" style="text-align:right;display:block;">{{ scope.row[col.prop] | priceFilter | thousands}}</span>
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
        <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </main>

    <!-- 编辑框 -->
    <edit-dialog v-el-drag-dialog v-if='dialogVisible' @closeHandler='dialogHandler' :type='dialogType' :id='dialogId'></edit-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import editDialog from './editDialog'
import exportExcel from '@/utils/frame/base/downloadExcel'
import { parseTime } from '@/utils/frame/base/index'
import {
  getList,
  listProjectName
} from '@/api/frame/rm/derivative/futruesSubAccount'
import elementFun from '@/utils/frame/base/elementFun'
import derivativeSubAccountList from '@/views/frame/rm/derivative/components/futureSubAcount'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'futruesSubAccount',
  data() {
    return {
      key: 1,
      tableId: 'futruesSubAccount',
      // 当前展示的头
      formThead: [],
      // 表头数据
      tableCols: [
        {
          prop: 'derivativeSubAccount',
          label: this.$t('derivative.futruesSubAccount.derivativeSubAccount'),
          fixed: false,
          width: 120
        },
        {
          prop: 'projectName',
          label: this.$t('derivative.futuresSubPosi.projectName'),
          fixed: false,
          width: 100
        },
        {
          prop: 'closeProfit',
          label: this.$t('derivative.futruesSubAccount.closeProfit'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'positionProfit',
          label: this.$t('derivative.futruesSubAccount.positionProfit'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'commission',
          label: this.$t('derivative.futruesSubAccount.commission'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'posiMargin',
          label: this.$t('derivative.futruesSubAccount.posiMargin'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'tradingDay',
          label: this.$t('derivative.futruesSubAccount.tradingDay'),
          fixed: false,
          format: {
            type: 'date'
          },
          align: 'center',
          width: 100
        }
      ],
      expandStatus: !!process.env.EXPAND_FLG,
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      currentRow: null,
      tableHeight: 0,
      colMap: {
        derivativeSubAccount: this.$t(
          'derivative.futruesSubAccount.derivativeSubAccount'
        ),
        projectName: this.$t('derivative.futruesSubAccount.projectName'),
        closeProfit: this.$t('derivative.futruesSubAccount.closeProfit'),
        positionProfit: this.$t('derivative.futruesSubAccount.positionProfit'),
        commission: this.$t('derivative.futruesSubAccount.commission'),
        posiMargin: this.$t('derivative.futruesSubAccount.posiMargin'),
        tradingDay: this.$t('derivative.futruesSubAccount.tradingDay')
      },
      tableKey: 0,
      tableHeaders: [],
      showTabColSetDialog: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      // 当前系统时间
      date: parseTime(new Date(), '{y}{m}{d}'),
      loading: false,
      status: false,
      tableData: [],
      type: '',
      total: null,
      dialogId: null,
      multipleSelection: [],
      dialogVisible: false,
      dateStartBefore: {},
      projectNameList: [],
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
  beforeMount() {
    // 列设置
    this.formThead = this.tableCols
    this.checkChange()
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
    derivativeSubAccountList
  },
  mounted() {
    // this.getTableHeaders()
    // 项目
    listProjectName().then(res => {
      this.projectNameList = res.data
    })
    // 初始化数据
    this.getList()
  },
  methods: {
    ...elementFun,

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
        this.listQuery.data.derivativeSubAccount = ''
        this.getList()
      }
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
    gotoLoadFile() {
      this.$router.push({
        name: 'futuresSubImport',
        params: {
          url: 'futruesSubAccount'
        }
      })
    },
    // 导出
    handleDownload() {
      exportExcel({
        fileName: this.$t('derivative.futruesSubAccount.title'),
        header: [
          this.$t('derivative.futruesSubAccount.derivativeSubAccount'),
          this.$t('derivative.futruesSubAccount.projectName'),
          this.$t('derivative.futruesSubAccount.closeProfit'),
          this.$t('derivative.futruesSubAccount.positionProfit'),
          this.$t('derivative.futruesSubAccount.commission'),
          this.$t('derivative.futruesSubAccount.posiMargin'),
          this.$t('derivative.futruesSubAccount.tradingDay')
        ],
        filterVal: [
          'derivativeSubAccount',
          'projectName',
          'closeProfit',
          'positionProfit',
          'commission',
          'posiMargin',
          'tradingDay'
        ],
        exportfunc: this.exportfunc,
        callBackfunc: this.callBackfunc
      })
    }
  }
}
</script>

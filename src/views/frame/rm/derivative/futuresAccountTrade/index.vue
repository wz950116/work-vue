<template>
  <div class="app-container calendar-list-container">
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <!-- form的版面 -->
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <!-- 交易日期 -->
          <template>
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futuresAccountTrade.tradingDay')" prop='tradingDay'>
                <el-row :gutter="0">
                  <el-col :span="11">
                    <el-date-picker v-model="listQuery.data.tradingDayFrom" type="date" @change="changeStartTime" :picker-options='dateStartBefore' range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                    </el-date-picker>
                  </el-col>
                  <el-col :span="2" align='center'>~</el-col>
                  <el-col :span="11">
                    <el-date-picker v-model="listQuery.data.tradingDayTo" type="date" @change="changeEndTime" :picker-options='dateEndBefore' range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                    </el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <!-- 期货账号 -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futuresAccountTrade.derivativeAccount')" prop='derivativeAccount'>
                <derivative-accountList clearable v-model="listQuery.data.derivativeAccount" :placeholder="$t('biz.placeholder.input')"></derivative-accountList>
              </el-form-item>
            </el-col>
            <!-- 合约 -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futuresAccountTrade.futuresContractCode')" prop='futuresContractCode'>
                <contract-codeList clearable v-model="listQuery.data.futuresContractCode" :placeholder="$t('biz.placeholder.input')"></contract-codeList>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="expandStatus">
            <!-- 开平 -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futuresAccountTrade.offsetFlag')" prop='offsetFlag'>
                <el-select v-model="listQuery.data.offsetFlag" clearable filterable :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="item in $t('datadict.derivativeOffset')" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 成交单号 -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futuresAccountTrade.tradeId')" prop='tradeId'>
                <input-validate v-model.trim="listQuery.data.tradeId" :placeholder="$t('biz.placeholder.input')"></input-validate>
              </el-form-item>
            </el-col>
            <!-- 数据来源 -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futuresAccountTrade.dataSourceType')" prop='dataSourceType'>
                <el-select v-model="listQuery.data.dataSourceType" clearable filterable>
                  <el-option v-for="item in $t('datadict.futureDataSourceType')" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
        </el-row>

        <!-- 右侧搜索按钮 -->
        <div class="search-btn" v-permission="['query']">
          <el-button type="primary" @click="onSubmit" v-db-click>
            {{this.$t('biz.lbl.search')}}
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
            <el-button v-db-click size="mini" @click='addItem' style='margin-right:3px;'>
              <svg-icon icon-class="线性-新增"></svg-icon>{{this.$t('biz.btn.add')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['update']" @click='doUpdate' style='margin-right:3px;'>
              <svg-icon icon-class="线性-修改"></svg-icon>{{this.$t('biz.btn.update')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['remove']" @click='doDelete' style='margin-right:3px;'>
              <svg-icon icon-class="线性-删除"></svg-icon>{{this.$t('biz.btn.delete')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['copy']" @click='doCopy' style='margin-right:3px;'>
              <svg-icon icon-class="线性-复制"></svg-icon>{{this.$t('biz.btn.copy')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['loadTrade']" @click='loadTrade' style='margin-right:3px;'>
              <svg-icon icon-class="线性-更新"></svg-icon>{{this.$t('biz.btn.loadTrade')}}
            </el-button>
          </div>
          <!-- 文件导入 -->
          <div>
            <el-button v-db-click size="mini" v-permission="['import']" @click='gotoLoadFile' style='margin-right:3px;'>
              <!-- <i class='el-icon-upload'></i>{{this.$t('biz.btn.exportData')}} -->
              <svg-icon icon-class="线性-导入"></svg-icon>{{this.$t('biz.btn.import')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['refresh']" @click='onSubmit' style='margin-right:3px;'>
              <svg-icon icon-class="线性-刷新"></svg-icon>{{this.$t('biz.btn.refresh')}}
            </el-button>
          </div>
        </el-row>
      </div>
      <el-table :key="key" stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight' @current-change="handleSelectRow">
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
              <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict) }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

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
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { mapGetters } from 'vuex'
import editDialog from './editDialog'
import exportExcel from '@/utils/frame/base/downloadExcel'
import { parseTime } from '@/utils/frame/base/index'
import {
  getList,
  doDelete
} from '@/api/frame/rm/derivative/futuresAccountTrade'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import sysInitSetting from '@/api/proj/sys/sysInitSetting'
import elementFun from '@/utils/frame/base/elementFun'
import derivativeAccountList from '@/views/frame/rm/derivative/components/futureAcount'
import contractCodeList from '@/views/frame/rm/derivative/components/contractCodeList'

export default {
  name: 'futuresAccountTrade',
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      tableHeight: 0,
      currentRow: null,
      key: 1,
      tableHeaders: [],
      tableId: 'futuresAccountTrade',
      // 当前展示的头
      formThead: [],
      // 表头数据
      tableCols: [
        {
          prop: 'tradingDay',
          label: this.$t('derivative.futuresAccountTrade.tradingDay'),
          fixed: false,
          'min-width': '100',
          align: 'center',
          format: {
            func: 'dateFormat',
            dict: 'YYYY-MM-DD'
          }
        },
        {
          prop: 'derivativeAccount',
          label: this.$t('derivative.futuresAccountTrade.derivativeAccount'),
          fixed: false,
          'min-width': '120'
        },
        {
          prop: 'futuresContractCode',
          label: this.$t('derivative.futuresAccountTrade.futuresContractCode'),
          fixed: false,
          'min-width': '120'
        },
        {
          prop: 'orderSysId',
          label: this.$t('derivative.futuresAccountTrade.orderSysId'),
          fixed: false,
          'min-width': '120'
        },
        {
          prop: 'direction',
          label: this.$t('derivative.futuresAccountTrade.direction'),
          fixed: false,
          'min-width': '80',
          align: 'center',
          format: {
            dict: this.$t('datadict.futuresDirection')
          }
        },
        {
          prop: 'offsetFlag',
          label: this.$t('derivative.futuresAccountTrade.offsetFlag'),
          fixed: false,
          'min-width': '80',
          align: 'center',
          format: {
            dict: this.$t('datadict.futureOffsetType')
          }
        },
        {
          prop: 'price',
          label: this.$t('derivative.futuresAccountTrade.price'),
          fixed: false,
          'min-width': '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'volume',
          label: this.$t('derivative.futuresAccountTrade.volume'),
          fixed: false,
          'min-width': '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 2
          }
        },
        {
          prop: 'amount',
          label: this.$t('derivative.futuresAccountTrade.amount'),
          fixed: false,
          'min-width': '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'commission',
          label: this.$t('derivative.futuresAccountTrade.commission'),
          fixed: false,
          'min-width': '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'tradeTime',
          label: this.$t('derivative.futuresAccountTrade.tradeTime'),
          fixed: false,
          'min-width': '100',
          align: 'center',
          format: {
            func: 'dateFormat',
            dict: 'HH:mm:ss'
          }
        },
        {
          prop: 'tradeDate',
          label: this.$t('derivative.futuresAccountTrade.tradeDate'),
          fixed: false,
          'min-width': '100',
          align: 'center',
          format: {
            func: 'dateFormat',
            dict: 'YYYY-MM-DD'
          }
        },
        {
          prop: 'hedgeFlag',
          label: this.$t('derivative.futuresAccountTrade.hedgeFlag'),
          fixed: false,
          'min-width': '100',
          align: 'center',
          format: {
            dict: this.$t('datadict.futureHedgeType')
          }
        },
        {
          prop: 'tradeId',
          label: this.$t('derivative.futuresAccountTrade.tradeId'),
          fixed: false,
          'min-width': '100'
        },
        {
          prop: 'mainName',
          label: this.$t('derivative.futuresAccountTrade.mainName'),
          fixed: false,
          'min-width': '100'
        },
        {
          prop: 'dataSourceType',
          label: this.$t('derivative.futuresAccountTrade.dataSourceType'),
          fixed: false,
          'min-width': '100',
          align: 'center',
          format: {
            dict: this.$t('datadict.futureDataSourceType')
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
      dvtDataSourceCtp: this.getDatadictValueByCode(
        'futureDataSourceType',
        'CTP'
      ),
      openFlag: false,
      today: this.getToday(),
      loading: false,
      status: false,
      tableData: [],
      dateStartBefore: {},
      dateEndBefore: {},
      total: null,
      dialogId: null,
      multipleSelection: [],
      dialogVisible: false,
      isShow: false, // 是否显示取消按钮
      submitId: '',
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          tradingDayFrom: '',
          tradingDayTo: '',
          derivativeAccount: '',
          futuresContractCode: '',
          offsetFlag: '',
          tradeId: '',
          dataSourceType: ''
        },
        sorString: ''
      }
    }
  },

  created() {
    if (process.env.EXPAND_FLG) {
      this.tableComputed()
    }
  },

  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },

  watch: {
    $route(to, from) {
      // 保存成功刷新列表
      if (this.$route.query.refresh) {
        this.getList()
      }
    },
    tableHeaders() {
      this.tableKey++
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
    derivativeAccountList,
    contractCodeList
  },
  mounted() {
    // 获取期初设置开关是否打开 true 代表打开
    sysInitSetting.getFlag().then(response => {
      this.openFlag = response.data
    })
    // 初始化数据
    this.getList()
  },
  beforeMount() {
    // 列设置
    this.formThead = this.tableCols
    this.checkChange()
  },
  methods: {
    ...elementFun,
    doCopy() {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.dialogType = 'copy'
      this.dialogId = this.currentRow.id
      this.dialogVisible = true
    },
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

    getToday() {
      return parseTime(new Date(), '{y}{m}{d}')
    },

    getDatadictValueByCode(category, code) {
      const items = this.$t('datadict.' + category)
      let item = null
      for (let i = 0; i < items.length; i++) {
        if (items[i].key === code) {
          item = items[i]
        }
      }
      return item === null ? null : item.value
    },
    rowDelUpdAble(row, index) {
      return this.checkRowDelUpd(row, false)
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
        this.getList()
      }
    },

    // 点击当前行选中状态
    handleCurrent(row, event, column) {
      if (this.checkRowDelUpd(row, false)) {
        this.$refs.multipleTable.toggleRowSelection(row)
      } else {
        this.$refs.multipleTable.toggleRowSelection(row, false)
      }
    },
    checkRowDelUpd(row, showMsg) {
      // 数据来源为CTP的数据不可修改。（第N行）
      if (row.dataSourceType === this.dvtDataSourceCtp) {
        if (showMsg) {
          this.$notify(
            notifyInfo({
              msg: this.$t('数据来源为CTP的数据不可修改或删除。!')
            })
          )
        }
        return false
      }
      if (row.tradingDay < this.today) {
        if (showMsg) {
          this.$notify(
            notifyInfo({
              msg: this.$t('历史数据不可以修改或删除，请通过调整单操作!')
            })
          )
        }
        return false
      }
      return true
    },
    // 删除多行
    deleteItem() {
      if (this.multipleSelection.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (!this.checkRowDelUpd(this.multipleSelection[i], true)) {
          return
        }
      }
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.confirmDelete(this.multipleSelection)
        })
        .catch(() => {})
    },
    // 读取期货成交
    loadTrade() {
      request({
        url: '/api/dvt/dvtFutureTrade/loadCtpTrade',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: ''
        }
      }).then(request => {
        this.$notify(
          notifySuccess({
            msg: this.$t('biz.msg.loadTradeSuccess')
          })
        )
        this.getList()
      })
    },
    // 删除单行
    doDelete() {
      if (!this.currentRow) {
        this.$notify(
          notifySuccess({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      const row = this.currentRow
      if (!this.checkRowDelUpd(row, true)) {
        return
      }
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.confirmDelete([row])
        })
        .catch(() => {})
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
      this.dialogType = 'add'
      this.dialogVisible = true
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
      if (!this.checkRowDelUpd(row, true)) {
        return
      }
      this.dialogType = 'update'
      this.dialogId = row.id
      this.dialogVisible = true
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
    gotoLoadFile(file) {
      this.$router.push({
        name: 'futuresAccountImport',
        params: {
          url: 'futuresAccountTrade'
        }
      })
    },
    // 导出
    handleDownload() {
      exportExcel({
        fileName: this.$t('derivative.futuresAccountTrade.title'),
        header: [
          this.$t('derivative.futuresAccountTrade.tradingDay'),
          this.$t('derivative.futuresAccountTrade.derivativeAccount'),
          this.$t('derivative.futuresAccountTrade.futuresContractCode'),
          this.$t('derivative.futuresAccountTrade.orderSysId'),
          this.$t('derivative.futuresAccountTrade.direction'),
          this.$t('derivative.futuresAccountTrade.offsetFlag'),
          this.$t('derivative.futuresAccountTrade.price'),
          this.$t('derivative.futuresAccountTrade.volume'),
          this.$t('derivative.futuresAccountTrade.amount'),
          this.$t('derivative.futuresAccountTrade.commission'),
          this.$t('derivative.futuresAccountTrade.tradeTime'),
          this.$t('derivative.futuresAccountTrade.tradeDate'),
          this.$t('derivative.futuresAccountTrade.hedgeFlag'),
          this.$t('derivative.futuresAccountTrade.tradeId'),
          this.$t('derivative.futuresAccountTrade.mainName'),
          this.$t('derivative.futuresAccountTrade.dataSourceType')
        ],
        filterVal: [
          'tradingDay',
          'derivativeAccount',
          'futuresContractCode',
          'orderSysId',
          {
            val: 'direction',
            dicCode: this.$t('datadict.futuresDirection')
          },
          { val: 'offsetFlag', dicCode: this.$t('datadict.futureOffsetType') },
          'price',
          'volume',
          'amount',
          'commission',
          'tradeTime',
          'tradeDate',
          { val: 'hedgeFlag', dicCode: this.$t('datadict.futureHedgeType') },
          'tradeId',
          'mainName',
          {
            val: 'dataSourceType',
            dicCode: this.$t('datadict.futureDataSourceType')
          }
        ],
        exportfunc: this.exportfunc,
        callBackfunc: this.callBackfunc
      })
    }
  }
}
</script>

<template>
  <div class="app-container calendar-list-container">
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <!-- form的版面 -->
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <template>
            <!-- 交易日期 -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futruesSubTrade.tradingDay')" prop='tradingDay'>
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
            <!-- 期货账号 -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futruesSubTrade.derivativeAccount')" prop='derivativeAccount'>
                <derivative-account-list clearable v-model="listQuery.data.derivativeAccount" :placeholder="$t('biz.placeholder.input')">
                </derivative-account-list>
              </el-form-item>
            </el-col>
            <!-- 子账号		  -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futruesSubTrade.derivativeSubAccount')" prop='derivativeSubAccount'>
                <derivative-sub-account-list clearable v-model="listQuery.data.derivativeSubAccount" :placeholder="$t('biz.placeholder.input')"></derivative-sub-account-list>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="expandStatus">
            <!-- 合约		  -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futruesSubTrade.futuresContractCode')" prop='futuresContractCode'>
                <contract-code-list clearable v-model="listQuery.data.futuresContractCode" :placeholder="$t('biz.placeholder.input')"></contract-code-list>
              </el-form-item>
            </el-col>
            <!-- 开平		  -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futruesSubTrade.offsetFlag')" prop='offsetFlag'>
                <el-select v-model="listQuery.data.offsetFlag" clearable filterable :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="item in $t('datadict.derivativeOffset')" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 数据来源 -->
            <el-col :span="7">
              <el-form-item :label="$t('derivative.futruesSubTrade.dataSourceType')" prop='dataSourceType'>
                <el-select v-model="listQuery.data.dataSourceType" clearable filterable placeholder="" :disabled="type==='view'">
                  <el-option v-for="item in $t('datadict.futureDataSourceType3')" :key="item.value" :label="item.label" :value="item.value">
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
            <el-button v-db-click size="mini" v-permission="['add']" @click='addItem' style='margin-right:3px;'>
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

      <!-- 列设置 -->
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
    <edit-dialog v-el-drag-dialog v-if='dialogVisible' @closeHandler='dialogHandler' :type='operateType' :id='dialogId'></edit-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import editDialog from './editDialog'
import exportExcel from '@/utils/frame/base/downloadExcel'
import { parseTime } from '@/utils/frame/base/index'
import { getList, doDelete } from '@/api/frame/rm/derivative/futruesSubTrade'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import elementFun from '@/utils/frame/base/elementFun'
import derivativeAccountList from '@/views/frame/rm/derivative/components/futureAcount'
import derivativeSubAccountList from '@/views/frame/rm/derivative/components/futureSubAcount'
import contractCodeList from '@/views/frame/rm/derivative/components/contractCodeList'
import request from '@/utils/frame/base/request'
export default {
  name: 'futruesSubTrade',
  data() {
    return {
      key: 1,
      tableId: 'futruesSubTrade',
      // 当前展示的头
      formThead: [],
      // 表头数据
      tableCols: [
        {
          prop: 'tradingDay',
          label: this.$t('derivative.futruesSubTrade.tradingDay'),
          fixed: false,
          width: 100,
          format: {
            type: 'date'
          }
        },
        {
          prop: 'derivativeAccount',
          label: this.$t('derivative.futruesSubTrade.derivativeAccount'),
          width: 120,
          fixed: false
        },
        {
          prop: 'derivativeSubAccount',
          label: this.$t('derivative.futruesSubTrade.derivativeSubAccount'),
          width: 120,
          fixed: false
        },
        {
          prop: 'projectName',
          label: this.$t('derivative.futruesSubTrade.projectName'),
          width: 100,
          fixed: false
        },
        {
          prop: 'futuresContractCode',
          label: this.$t('derivative.futruesSubTrade.futuresContractCode'),
          width: 120,
          fixed: false
        },
        {
          prop: 'tradeId',
          label: this.$t('derivative.futruesSubTrade.tradeId'),
          width: 120,
          fixed: false
        },
        {
          prop: 'direction',
          label: this.$t('derivative.futruesSubTrade.direction'),
          width: 80,
          align: 'center',
          fixed: false,
          format: {
            type: 'dict',
            dict: this.$t('datadict.futuresDirection')
          }
        },
        {
          prop: 'offsetFlag',
          label: this.$t('derivative.futruesSubTrade.offsetFlag'),
          fixed: false,
          width: 80,
          align: 'center',
          format: {
            type: 'dict',
            dict: this.$t('datadict.futureOffsetType')
          }
        },
        {
          prop: 'price',
          label: this.$t('derivative.futruesSubTrade.price'),
          width: 100,
          fixed: false,
          format: {
            type: 'money'
          }
        },
        {
          prop: 'volume',
          label: this.$t('derivative.futruesSubTrade.volume'),
          width: 100,
          fixed: false,
          format: {
            type: 'money'
          }
        },
        {
          prop: 'amount',
          label: this.$t('derivative.futruesSubTrade.amount'),
          width: 100,
          fixed: false,
          format: {
            type: 'money'
          }
        },
        {
          prop: 'commission',
          label: this.$t('derivative.futruesSubTrade.commission'),
          width: 100,
          fixed: false,
          format: {
            type: 'money'
          }
        },
        {
          prop: 'tradeTime',
          label: this.$t('derivative.futruesSubTrade.tradeTime'),
          width: 100,
          align: 'center',
          fixed: false,
          format: {
            type: 'HHMMSS'
          }
        },
        {
          prop: 'tradeDate',
          label: this.$t('derivative.futruesSubTrade.tradeDate'),
          width: 100,
          align: 'center',
          fixed: false,
          format: {
            type: 'date'
          }
        },
        {
          prop: 'hedgeFlag',
          label: this.$t('derivative.futruesSubTrade.hedgeFlag'),
          width: 100,
          align: 'center',
          fixed: false,
          format: {
            type: 'dict',
            dict: this.$t('datadict.futureHedgeType')
          }
        },
        {
          prop: 'orderSysId',
          label: this.$t('derivative.futruesSubTrade.orderSysId'),
          width: 100,
          fixed: false
        },
        {
          prop: 'dataSourceType',
          label: this.$t('derivative.futruesSubTrade.dataSourceType'),
          width: 100,
          align: 'center',
          fixed: false,
          format: {
            type: 'dict',
            dict: this.$t('datadict.futureDataSourceType')
          }
        }
      ],
      expandStatus: !!process.env.EXPAND_FLG,
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      tableHeight: 0,
      currentRow: null,
      // colMap: {
      //   tradingDay: this.$t('derivative.futruesSubTrade.tradingDay'),
      //   derivativeAccount: this.$t(
      //     'derivative.futruesSubTrade.derivativeAccount'
      //   ),
      //   derivativeSubAccount: this.$t(
      //     'derivative.futruesSubTrade.derivativeSubAccount'
      //   ),
      //   projectName: this.$t('derivative.futruesSubTrade.projectName'),
      //   futuresContractCode: this.$t(
      //     'derivative.futruesSubTrade.futuresContractCode'
      //   ),
      //   tradeId: this.$t('derivative.futruesSubTrade.tradeId'),
      //   direction: this.$t('derivative.futruesSubTrade.direction'),
      //   offsetFlag: this.$t('derivative.futruesSubTrade.offsetFlag'),
      //   price: this.$t('derivative.futruesSubTrade.price'),
      //   volume: this.$t('derivative.futruesSubTrade.volume'),
      //   amount: this.$t('derivative.futruesSubTrade.amount'),
      //   commission: this.$t('derivative.futruesSubTrade.commission'),
      //   tradeTime: this.$t('derivative.futruesSubTrade.tradeTime'),
      //   tradeDate: this.$t('derivative.futruesSubTrade.tradeDate'),
      //   hedgeFlag: this.$t('derivative.futruesSubTrade.hedgeFlag'),
      //   orderSysId: this.$t('derivative.futruesSubTrade.orderSysId'),
      //   dataSourceType: this.$t('derivative.futruesSubTrade.dataSourceType')
      // },
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
      type: '',
      operateType: '',
      tableData: [],
      total: null,
      dialogId: null,
      multipleSelection: [],
      dialogVisible: false,
      editFig: true,
      dateStartBefore: {},
      dateEndBefore: {},
      bpmProcessDefineKey: 'CTRMApprovefutruesSubTradeSheet',
      isShow: true, // 是否显示取消按钮
      submitId: '',
      id: '',
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          tradingDayFrom: '',
          tradingDayTo: '',
          derivativeAccount: '',
          derivativeSubAccount: '',
          futuresContractCode: '',
          offsetFlag: '',
          dataSourceType: ''
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
    derivativeAccountList,
    derivativeSubAccountList,
    contractCodeList
  },
  mounted() {
    // 初始化数据
    this.getList()
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
      this.operateType = 'copy'
      this.dialogId = this.currentRow.id
      this.dialogVisible = true
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
        this.getList()
      }
    },
    // 读取期货成交
    loadTrade() {
      request({
        url: '/api/dvt/dvtFutureTrade/loadRonagHangTrade',
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
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (this.currentRow.tradingDay < this.date) {
        this.$notify(
          notifyInfo({
            msg: '历史数据不可以修改，如果需要修改，请通过调整单操作'
          })
        )
        return
      }
      if (this.currentRow.dataSourceType === 'F') {
        this.$notify(
          notifyInfo({
            msg: '数据来源为"接口获取"的数据不可删除。'
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
            this.confirmDelete([row])
          })
          .catch(() => {})
      }
    },
    // 删除多行
    deleteItem() {
      if (this.multipleSelection.length > 0) {
        // 2	如果选中的明细行中，存在“交易日期”< 系统日期的数据，报错
        // 历史数据不可以修改，如果需要修改，请通过调整单操作。(第N行）
        // 如果选中的明细行中，存在数据来源为"接口获取"的数据，报错
        // 数据来源为"接口获取"的数据不可删除。（第N行）
        const deleteArr = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const select = this.multipleSelection[i]
          deleteArr.push({
            id: select.id,
            versionNum: select.versionNum
          })
          if (select.tradingDay < this.date) {
            this.$notify(
              notifyInfo({
                msg: '历史数据不可以修改，如果需要修改，请通过调整单操作'
              })
            )
            return
          }
          if (select.dataSourceType === 'F') {
            this.$notify(
              notifyInfo({
                msg: '数据来源为"接口获取"的数据不可删除。'
              })
            )
            return
          }
        }
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
      this.dialogVisible = true
      this.operateType = 'add'
    },
    // 编辑
    doUpdate() {
      // 如果选中的明细行中，存在数据来源为CTP的数据，报错（第N行）
      // 数据来源为CTP的数据不可修改。（第N行）
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (this.currentRow.tradingDay < this.date) {
        this.$notify(
          notifyInfo({
            msg: '历史数据不可以修改，如果需要修改，请通过调整单操作'
          })
        )
        return
      }
      if (this.currentRow.dataSourceType === 'F') {
        this.$notify(
          notifyInfo({
            msg: '数据来源为"接口获取"的数据不可删除。'
          })
        )
        return
      }

      const row = this.currentRow

      if (row) {
        this.dialogVisible = true
        this.dialogType = 'update'
        this.rowInfo = row
      }
      if (row.dataSourceType === 'C') {
        this.$notify(
          notifyInfo({
            msg: this.$t('数据来源为CTP的数据不可修改!')
          })
        )
        return
      }
      this.dialogVisible = true
      this.operateType = 'update'
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
    dialogHandler() {
      this.dialogVisible = false
      this.getList()
    },
    // 导数据
    gotoLoadFile() {
      this.$router.push({
        name: 'futuresSubImport',
        params: {
          url: 'futruesSubTrade'
        }
      })
    },
    // 导出
    handleDownload() {
      exportExcel({
        fileName: this.$t('derivative.futruesSubTrade.title'),
        header: [
          this.$t('derivative.futruesSubTrade.tradingDay'),
          this.$t('derivative.futruesSubTrade.derivativeAccount'),
          this.$t('derivative.futruesSubTrade.derivativeSubAccount'),
          this.$t('derivative.futruesSubTrade.projectName'),
          this.$t('derivative.futruesSubTrade.futuresContractCode	'),
          this.$t('derivative.futruesSubTrade.orderSysId'),
          this.$t('derivative.futruesSubTrade.direction'),
          this.$t('derivative.futruesSubTrade.offsetFlag'),
          this.$t('derivative.futruesSubTrade.price'),
          this.$t('derivative.futruesSubTrade.volume'),
          this.$t('derivative.futruesSubTrade.amount'),
          this.$t('derivative.futruesSubTrade.commission'),
          this.$t('derivative.futruesSubTrade.tradeTime'),
          this.$t('derivative.futruesSubTrade.hedgeFlag'),
          this.$t('derivative.futruesSubTrade.tradeId'),
          this.$t('derivative.futruesSubTrade.dataSourceType')
        ],
        filterVal: [
          'tradingDay',
          'derivativeAccount',
          'derivativeSubAccount',
          'projectName',
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
          { val: 'hedgeFlag', dicCode: this.$t('datadict.futureHedgeType') },
          'tradeId',
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

<template>
  <div class='app-container'>
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubPosi.tradingDay')" prop='tradingDay'>
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
          <!-- 子账号 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubPosi.derivativeSubAccount')" prop='derivativeSubAccount'>
              <derivative-sub-account-list clearable v-model="listQuery.data.derivativeSubAccount" :placeholder="$t('biz.placeholder.input')"></derivative-sub-account-list>
            </el-form-item>
          </el-col>
          <!-- 项目	-->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubPosi.projectName')" prop='projectName'>
              <el-select clearable v-model="listQuery.data.projectName" filterable :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="(item,index) in projectNameList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 合约 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubPosi.futuresContractCode')" prop='futuresContractCode'>
              <contract-code-list clearable v-model="listQuery.data.futuresContractCode" :placeholder="$t('biz.placeholder.input')"></contract-code-list>
            </el-form-item>
          </el-col>
          <template v-if="expandStatus">
            <!-- 方向	   -->
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futuresSubPosi.posiDirection')" prop='posiDirection'>
                <el-select v-model="listQuery.data.posiDirection" clearable filterable placeholder="" :disabled="type==='view'">
                  <el-option v-for="item in $t('datadict.dvtPosiDirection')" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 数据来源 -->
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futuresSubPosi.dataSourceType')" prop='dataSourceType'>
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
            <el-button v-db-click size="mini" v-permission="['add']" @click='addItem' style='margin-right:3px;'>
              <svg-icon icon-class="线性-新增"></svg-icon>
              {{this.$t('biz.btn.add')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['update']" @click='doUpdate' style='margin-right:3px;'>
              <svg-icon icon-class="线性-修改"></svg-icon>
              {{this.$t('biz.btn.update')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['remove']" @click='doDelete' style='margin-right:3px;'>
              <svg-icon icon-class="线性-删除"></svg-icon>
              {{this.$t('biz.btn.delete')}}
            </el-button>
          </div>
          <!-- 文件导入 -->
          <div>
            <el-button v-db-click size="mini" v-permission="['import']" @click='gotoLoadFile' style='margin-right:3px;'>
              <svg-icon icon-class="线性-上传"></svg-icon>
              {{this.$t('biz.btn.exportData')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['refresh']" @click='getList' style='margin-right:3px;'>
              <svg-icon icon-class="线性-刷新"></svg-icon>
              {{this.$t('biz.btn.refresh')}}
            </el-button>
          </div>
          <div>
            <el-button v-db-click size="mini" v-permission="['export']" @click='handleDownload' style='margin-right:3px;'>
              <svg-icon icon-class="线性-导出"></svg-icon>
              {{this.$t('biz.btn.export')}}
            </el-button>
          </div>
          <!-- <div>
            <el-button v-db-click size="mini" style='margin-right:3px;'>
              <svg-icon icon-class="线性-打印"></svg-icon>
              {{this.$t('biz.btn.print')}}
            </el-button>
          </div> -->
          <!-- <div>
            <el-button v-db-click size="mini" style='margin-right:3px;'>
              <svg-icon icon-class="线性-设置"></svg-icon>
              {{this.$t('biz.btn.setting')}}
            </el-button>
          </div> -->
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
          <svg-icon icon-class="线性-惊叹号"></svg-icon>
          {{$t('table.emptyText')}}
        </div>
        <!-- 分页 -->
        <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </main>

    <!-- 编辑框 -->
    <edit-dialog v-el-drag-dialog v-if='dialogVisible' @close='dialogHandler' :type='operateType' :id='dialogId'></edit-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import editDialog from './editDialog'
import exportExcel from '@/utils/frame/base/downloadExcel'
import { parseTime } from '@/utils/frame/base/index'
import { getList, doDelete } from '@/api/frame/rm/derivative/futuresSubPosi'
import { listProjectName } from '@/api/frame/rm/derivative/futruesSubAccount'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import elementFun from '@/utils/frame/base/elementFun'
import derivativeSubAccountList from '@/views/frame/rm/derivative/components/futureSubAcount'
import contractCodeList from '@/views/frame/rm/derivative/components/contractCodeList'
import request from '@/utils/frame/base/request'
export default {
  name: 'futuresSubPosi',
  data() {
    return {
      key: 1,
      // 当前展示的头
      formThead: [],
      // 表头数据
      tableCols: [
        {
          prop: 'tradingDay',
          label: this.$t('derivative.futuresSubPosi.tradingDay'),
          fixed: false,
          format: {
            type: 'date'
          },
          width: 100,
          align: 'center'
        },
        {
          prop: 'derivativeSubAccount',
          label: this.$t('derivative.futuresSubPosi.derivativeSubAccount'),
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
          prop: 'futuresContractCode',
          label: this.$t('derivative.futuresSubPosi.futuresContractCode'),
          fixed: false,
          width: 120
        },
        {
          prop: 'posiDirection',
          label: this.$t('derivative.futuresSubPosi.posiDirection'),
          fixed: false,
          format: {
            type: 'dict',
            dict: this.$t('datadict.dvtPosiDirection')
          },
          width: 80,
          align: 'center'
        },
        {
          prop: 'position',
          label: this.$t('derivative.futuresSubPosi.position'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'positionPrice',
          label: this.$t('derivative.futuresSubPosi.positionPrice'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'preSettlementPrice',
          label: this.$t('derivative.futuresSubPosi.preSettlementPrice'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'settlementPrice',
          label: this.$t('derivative.futuresSubPosi.settlementPrice'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'positionProfit',
          label: this.$t('derivative.futuresSubPosi.positionProfit'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'useMargin',
          label: this.$t('derivative.futuresSubPosi.useMargin'),
          fixed: false,
          format: {
            type: 'money'
          },
          width: 100
        },
        {
          prop: 'hedgeFlag',
          label: this.$t('derivative.futuresSubPosi.hedgeFlag'),
          fixed: false,
          format: {
            type: 'dict',
            dict: this.$t('datadict.futureHedgeType')
          },
          width: 80,
          align: 'center'
        },
        {
          prop: 'mainName',
          label: this.$t('derivative.futuresSubPosi.mainName'),
          fixed: false,
          width: 100
        },
        {
          prop: 'dataSourceType',
          label: this.$t('derivative.futuresSubPosi.dataSourceType'),
          fixed: false,
          format: {
            type: 'dict',
            dict: this.$t('datadict.futureDataSourceType')
          },
          width: 100,
          align: 'center'
        }
      ],
      expandStatus: process.env.EXPAND_FLG,
      tableHeight: 0,
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      currentRow: null,
      colMap: {
        tradingDay: this.$t('derivative.futuresSubPosi.tradingDay'),
        derivativeSubAccount: this.$t(
          'derivative.futuresSubPosi.derivativeSubAccount'
        ),
        projectName: this.$t('derivative.futuresSubPosi.projectName'),
        futuresContractCode: this.$t(
          'derivative.futuresSubPosi.futuresContractCode'
        ),
        posiDirection: this.$t('derivative.futuresSubPosi.posiDirection'),
        position: this.$t('derivative.futuresSubPosi.position'),
        positionPrice: this.$t('derivative.futuresSubPosi.positionPrice'),
        preSettlementPrice: this.$t(
          'derivative.futuresSubPosi.preSettlementPrice'
        ),
        settlementPrice: this.$t('derivative.futuresSubPosi.settlementPrice'),
        positionProfit: this.$t('derivative.futuresSubPosi.positionProfit'),
        useMargin: this.$t('derivative.futuresSubPosi.useMargin'),
        hedgeFlag: this.$t('derivative.futuresSubPosi.hedgeFlag'),
        mainName: this.$t('derivative.futuresSubPosi.mainName'),
        dataSourceType: this.$t('derivative.futuresSubPosi.dataSourceType')
      },
      tableKey: 0,
      tableHeaders: [],
      tableId: 'futuresSubPosi',
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
      tableData: [],
      total: null,
      dialogId: null,
      operateType: '',
      multipleSelection: [],
      dialogVisible: false,
      dateStartBefore: {},
      dateEndBefore: {},
      projectNameList: [],
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          tradingDayFrom: '',
          tradingDayTo: '',
          derivativeSubAccount: '',
          projectName: '',
          futuresContractCode: '',
          posiDirection: '',
          tradeId: ''
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
    derivativeSubAccountList,
    contractCodeList
  },
  mounted() {
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
        this.getList()
      }
    },
    // 删除多行
    deleteItem() {
      if (this.multipleSelection.length > 0) {
        const deleteArr = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const select = this.multipleSelection[i]
          deleteArr.push({
            id: select.id,
            versionNum: select.versionNum
          })
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
            this.confirmDelete([
              {
                id: row.id,
                versionNum: row.versionNum
              }
            ])
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
      this.dialogVisible = true
      this.operateType = 'add'
    },
    // 编辑
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
      // 如果选中的明细行中 “交易日期”< 系统日期(已隐藏)
      // 如果选中的明细行中，存在数据来源为CTP的数据，报错 TODO（第N行）?
      if (row.dataSourceType === 'C') {
        this.$notify(
          notifyInfo({
            msg: this.$t('数据来源为CTP的数据不可修改。!')
          })
        )
        return
      }
      this.dialogVisible = true
      this.operateType = 'update'
      this.dialogId = row.id
    },

    // 关闭弹窗回调
    dialogHandler() {
      this.dialogVisible = false
      this.getList()
    },
    // 导数据
    gotoLoadFile() {
      this.$router.push({
        name: 'futuresSubImport'
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
        fileName: this.$t('derivative.futuresSubPosi.title'),
        header: [
          this.$t('derivative.futuresSubPosi.tradingDay'),
          this.$t('derivative.futuresSubPosi.derivativeSubAccount'),
          this.$t('derivative.futuresSubPosi.projectName'),
          this.$t('derivative.futuresSubPosi.futuresContractCode'),
          this.$t('derivative.futuresSubPosi.posiDirection'),
          this.$t('derivative.futuresSubPosi.position'),
          this.$t('derivative.futuresSubPosi.positionPrice'),
          this.$t('derivative.futuresSubPosi.preSettlementPrice'),
          this.$t('derivative.futuresSubPosi.settlementPrice'),
          this.$t('derivative.futuresSubPosi.positionProfit'),
          this.$t('derivative.futuresSubPosi.useMargin'),
          this.$t('derivative.futuresSubPosi.hedgeFlag'),
          this.$t('derivative.futuresSubPosi.mainName'),
          this.$t('derivative.futuresSubPosi.dataSourceType')
        ],
        filterVal: [
          'tradingDay',
          'derivativeSubAccount',
          'projectName',
          'futuresContractCode',
          {
            val: 'posiDirection',
            dicCode: this.$t('datadict.dvtPosiDirection')
          },
          'position',
          'positionPrice',
          'preSettlementPrice',
          'settlementPrice',
          'positionProfit',
          'useMargin',
          { val: 'hedgeFlag', dicCode: this.$t('datadict.futureHedgeType') },
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

<template>
  <div class='app-container'>
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresPosi.tradingDay')" prop='tradingDay'>
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
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresPosi.derivativeAccount')" prop='derivativeAccount'>
              <derivative-accountList clearable v-model="listQuery.data.derivativeAccount" :placeholder="$t('biz.placeholder.input')"></derivative-accountList>
            </el-form-item>
          </el-col>
          <!-- 合约 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresPosi.futuresContractCode')" prop='futuresContractCode'>
              <contract-codeList clearable v-model="listQuery.data.futuresContractCode" :placeholder="$t('biz.placeholder.input')"></contract-codeList>
            </el-form-item>
          </el-col>
          <!-- 方向 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresPosi.posiDirection')" prop='posiDirection'>
              <el-select v-model="listQuery.data.posiDirection" clearable filterable placeholder="" :disabled="type==='view'">
                <el-option v-for="item in $t('datadict.dvtPosiDirection')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 数据来源 -->
          <template v-if="expandStatus">
            <el-col :span="6">
              <el-form-item :label="$t('derivative.futuresPosi.dataSourceType')" prop='dataSourceType'>
                <el-select v-model="listQuery.data.dataSourceType" clearable filterable placeholder="" :disabled="type==='view'">
                  <el-option v-for="item in $t('datadict.futureDataSourceType2')" :key="item.value" :label="item.label" :value="item.value">
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
    <edit-dialog v-el-drag-dialog v-if='dialogVisible' @close='dialogHandler' :type='dialogType' :id='dialogId'></edit-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import editDialog from './editDialog'
import exportExcel from '@/utils/frame/base/downloadExcel'
import { parseTime } from '@/utils/frame/base/index'
import { getList, doDelete } from '@/api/frame/rm/derivative/futuresPosi'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import elementFun from '@/utils/frame/base/elementFun'
import derivativeAccountList from '@/views/frame/rm/derivative/components/futureAcount'
import contractCodeList from '@/views/frame/rm/derivative/components/contractCodeList'
import request from '@/utils/frame/base/request'

export default {
  name: 'futuresPosi',
  data() {
    return {
      expandStatus: process.env.EXPAND_FLG,
      tableHeight: 0,
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      currentRow: null,
      key: 1,
      tableHeaders: [],
      tableId: 'futuresPosi',
      // 当前展示的头
      formThead: [],
      // 表头数据
      tableCols: [
        {
          prop: 'tradingDay',
          label: this.$t('derivative.futuresPosi.tradingDay'),
          fixed: false,
          align: 'center',
          width: '100',
          format: {
            func: 'dateFormat',
            dict: 'YYYY-MM-DD'
          }
        },
        {
          prop: 'derivativeAccount',
          label: this.$t('derivative.futuresPosi.derivativeAccount'),
          width: '100',
          fixed: false
        },
        {
          prop: 'futuresContractCode',
          label: this.$t('derivative.futuresPosi.futuresContractCode'),
          width: '100',
          fixed: false
        },
        {
          prop: 'posiDirection',
          label: this.$t('derivative.futuresPosi.posiDirection'),
          fixed: false,
          width: '80',
          align: 'center',
          format: {
            dict: this.$t('datadict.dvtPosiDirection')
          }
        },
        {
          prop: 'position',
          label: this.$t('derivative.futuresPosi.position'),
          fixed: false,
          width: '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 2
          }
        },
        {
          prop: 'positionPrice',
          label: this.$t('derivative.futuresPosi.positionPrice'),
          fixed: false,
          width: '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'preSettlementPrice',
          label: this.$t('derivative.futuresPosi.preSettlementPrice'),
          fixed: false,
          width: '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'settlementPrice',
          label: this.$t('derivative.futuresPosi.settlementPrice'),
          fixed: false,
          width: '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'positionProfit',
          label: this.$t('derivative.futuresPosi.positionProfit'),
          fixed: false,
          width: '100',
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'useMargin',
          label: this.$t('derivative.futuresPosi.useMargin'),
          fixed: false,
          width: '100',
          align: 'right'
        },
        {
          prop: 'hedgeFlag',
          label: this.$t('derivative.futuresPosi.hedgeFlag'),
          fixed: false,
          align: 'center',
          format: {
            dict: this.$t('datadict.futureHedgeType')
          }
        },
        {
          prop: 'mainName',
          label: this.$t('derivative.futuresPosi.mainName'),
          width: '100',
          fixed: false
        },
        {
          prop: 'dataSourceType',
          label: this.$t('derivative.futuresPosi.dataSourceType'),
          fixed: false,
          align: 'center',
          width: '100',
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
      // 当前系统时间
      date: parseTime(new Date(), '{y}{m}{d}'),
      loading: false,
      status: false,
      type: '',
      tableData: [],
      total: null,
      dialogId: null,
      dateStartBefore: {},
      dateEndBefore: {},
      multipleSelection: [],
      dialogVisible: false,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          tradingDayFrom: '',
          tradingDayTo: '',
          derivativeAccount: '',
          futuresContractCode: '',
          posiDirection: '',
          tradeId: '',
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
    contractCodeList
  },
  beforeMount() {
    // 列设置
    this.formThead = this.tableCols
    this.checkChange()
  },
  mounted() {
    // 初始化数据
    this.getList()
  },
  methods: {
    ...elementFun,
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
    // 列表请求
    getList() {
      this.loading = true
      getList(this.listQuery, this.func)
        .then(response => {
          this.tableData = response.data
          this.total = response.total
          this.tableData.forEach(element => {
            if (element.position === 0) {
              element.position = ''
            }
          })
          if (this.total && this.total > 0) {
            this.emptyTextVisible = false
          } else {
            this.emptyTextVisible = true
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
      this.dialogType = 'add'
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
        name: 'futuresAccountImport',
        params: {
          type: 'add'
        }
      })
    },
    // 导出
    handleDownload() {
      exportExcel({
        fileName: this.$t('derivative.futuresPosi.title'),
        header: [
          this.$t('derivative.futuresPosi.tradingDay'),
          this.$t('derivative.futuresPosi.derivativeAccount'),
          this.$t('derivative.futuresPosi.futuresContractCode'),
          this.$t('derivative.futuresPosi.posiDirection'),
          this.$t('derivative.futuresPosi.position'),
          this.$t('derivative.futuresPosi.positionPrice'),
          this.$t('derivative.futuresPosi.preSettlementPrice'),
          this.$t('derivative.futuresPosi.settlementPrice'),
          this.$t('derivative.futuresPosi.positionProfit'),
          this.$t('derivative.futuresPosi.useMargin'),
          this.$t('derivative.futuresPosi.hedgeFlag'),
          this.$t('derivative.futuresPosi.mainName'),
          this.$t('derivative.futuresPosi.dataSourceType')
        ],
        filterVal: [
          'tradingDay',
          'derivativeAccount',
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

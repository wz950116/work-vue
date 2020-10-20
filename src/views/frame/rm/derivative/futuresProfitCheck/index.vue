<template>
  <div class="app-container">
    <!-- 头部 -->
    <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
        <el-row :gutter="20" style='width:94%;'>
          <!-- 期货账号 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresProfitCheck.derivativeAccount')" prop="derivativeAccount">
              <!-- <input-validate v-model.trim="listQuery.data.derivativeAccount" :placeholder="$t('biz.placeholder.input')"></input-validate> -->
              <derivative-accountList clearable v-model="listQuery.data.derivativeAccount" :placeholder="$t('biz.placeholder.input')"></derivative-accountList>
            </el-form-item>
          </el-col>
          <!-- 交易日期 -->
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresProfitCheck.tradingDay')" prop='signDate'>
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

        </el-row>
        <!-- 右侧搜索按钮 -->
        <div class="search-btn" v-permission="['query']">
          <el-button type="primary" @click="getList" v-db-click>
            {{$t('biz.lbl.search')}}
          </el-button>
        </div>
        <!-- 展开收起 -->
        <div class='expand' @click='expand' v-show='false'>
          <i v-if='expandStatus' class='el-icon-arrow-up'></i>
          <i v-else class='el-icon-arrow-down'></i>
        </div>
      </el-form>
    </header>

    <!-- 列表内容 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <!-- 顶部按钮 -->
      <div class="top-operate">
        <el-row type='flex'>
          <upload-excel-component v-permission="['import']" :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('derivative.futuresProfitCheck.btn')" style='margin-right:3px;' />
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
          <el-button v-db-click size="mini" v-permission="['download']" @click='download' style='margin-right:3px;'>
            <svg-icon icon-class="线性-下载"></svg-icon>{{this.$t('biz.btn.download')}}
          </el-button>

        </el-row>
      </div>
      <!-- 成交明细 -->
      <el-table :key="key" stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="list" :height='tableHeight' @current-change="handleSelectRow">
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
              <!-- <span v-else-if='col.format.func==="dateFormat"'>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict) }}</span>
              <span v-else-if='col.format.func==="thousands"'>{{ scope.row[col.prop] | moneyFilter | thousands }}</span>
              <span v-else>{{ scope.row[col.prop] | dataDictFormat(col.format.dict) }}</span> -->
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
        <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>

    </main>
  </div>
</template>

<script>
// 调用Vue全局过滤器
import Vue from 'vue'
import { mapGetters } from 'vuex'
import elementFun from '@/utils/frame/base/elementFun'
import { parseTime } from '@/utils/frame/base/index'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import exportExcel from '@/utils/frame/base/downloadExcel'
import * as futuresProfitCheck from '@/api/frame/rm/derivative/futuresProfitCheck'
import {
  toDateFromString, // 验证时间是否有效
  verifyNamber // 验证是数字
} from '@/utils/frame/base/validate'
import derivativeAccountList from '@/views/frame/rm/derivative/components/futureAcount'
import excel_DvtFuturesProfitCheck from '@/assets/frame/excel/dvt/DvtFuturesProfitCheck.xlsx'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'futuresProfitCheck',
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      rules: {},
      // 是否显示暂无数据
      emptyTextVisible: true,
      // 表格高度
      tableHeight: 0,
      key: 1,
      tableHeaders: [],
      tableId: 'futuresProfitCheck',
      // 当前展示的头
      formThead: [],
      // 表头数据
      tableCols: [
        {
          prop: 'derivativeAccount',
          label: this.$t('derivative.futuresProfitCheck.derivativeAccount'),
          width: 120,
          fixed: false
        },
        {
          prop: 'tradingDay',
          label: this.$t('derivative.futuresProfitCheck.tradingDay'),
          fixed: false,
          align: 'center',
          width: 100,
          format: {
            func: 'dateFormat',
            dict: 'YYYY-MM-DD'
          }
        },
        {
          prop: 'ctrmPositionProfit',
          label: this.$t('derivative.futuresProfitCheck.ctrmPositionProfit'),
          fixed: false,
          align: 'right',
          width: 100,
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'ctrmPositionProfitOffset',
          align: 'right',
          width: 100,
          format: {
            func: 'thousands',
            dict: 4
          },
          label: this.$t(
            'derivative.futuresProfitCheck.ctrmPositionProfitOffset'
          ),
          fixed: false
        },
        {
          prop: 'ctrmCloseProfit',
          label: this.$t('derivative.futuresProfitCheck.ctrmCloseProfit'),
          width: 100,
          fixed: false
        },
        {
          prop: 'stdCloseProfit',
          label: this.$t('derivative.futuresProfitCheck.stdCloseProfit'),
          fixed: false,
          width: 100,
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'brokerPositionProfit',
          label: this.$t('derivative.futuresProfitCheck.brokerPositionProfit'),
          fixed: false,
          width: 100,
          align: 'right',
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'brokerPositionProfitOffset',
          label: this.$t(
            'derivative.futuresProfitCheck.brokerPositionProfitOffset'
          ),
          fixed: false,
          align: 'right',
          width: 100,
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'brokerCloseProfit',
          label: this.$t('derivative.futuresProfitCheck.brokerCloseProfit'),
          fixed: false,
          align: 'right',
          width: 100,
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'brokerCloseProfitOffset',
          label: this.$t(
            'derivative.futuresProfitCheck.brokerCloseProfitOffset'
          ),
          fixed: false,
          align: 'right',
          width: 100,
          format: {
            func: 'thousands',
            dict: 4
          }
        },
        {
          prop: 'mainName',
          label: this.$t('derivative.futuresProfitCheck.mainName'),
          width: 100,
          fixed: false
        }
      ],
      // 列设置
      checked: [],
      showTabColSetDialog: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      tempExcelPath: excel_DvtFuturesProfitCheck,
      activeName: 'businessDetails',
      loading: false,
      status: false,
      total: 0,
      flg: false,
      list: [],
      dateStartBefore: {},
      dateEndBefore: {},
      listobj: [],
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        sorString: '',
        data: {
          derivativeAccount: '',
          tradingDay: '',
          tradingDayFrom: '',
          tradingDayTo: ''
        }
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
  components: {
    UploadExcelComponent,
    derivativeAccountList
  },
  watch: {
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
  beforeMount() {
    // 列设置
    this.formThead = this.tableCols
    this.checkChange()
  },
  mounted() {
    // 渲染表格数据
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
    download() {
      const url = this.tempExcelPath
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '期货盈亏核对导入模板.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    stateShow(val) {
      this.showTabColSetDialog = val.show
    },
    // 重置查询表单
    resetForm() {
      if (this.$refs.queryForm) {
        this.listQuery.data.tradingDayFrom = ''
        this.listQuery.data.tradingDayTo = ''
        this.$refs.queryForm.resetFields()
        this.getList()
      }
    },
    // 获取初始化数据
    getList() {
      this.loading = true
      const params = this.listQuery
      params.funcModule = this.$t('route.' + this.$route.meta.title)
      params.funcOperation = this.$t('biz.btn.search')
      futuresProfitCheck
        .list(params)
        .then(response => {
          this.total = response.total
          this.list = response.data
          if (this.total > 0) {
            this.emptyTextVisible = false
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
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
      if (header[0] !== '期货公司结算单') {
        this.$notify.error({
          title: '错误',
          message: '导入模板错误',
          position: 'bottom-right'
        })
        return
      }
      if (results) {
        const obj = {}
        this.pageLoading = true
        for (var j in results) {
          for (var v in results[j]) {
            results[j][v] = results[j][v].trim()
            if (results[j][v].indexOf(',') !== -1) {
              results[j][v] = results[j][v].replace(/,/g, '')
            }
          }
        }
        obj.derivativeAccount = results[0]['__EMPTY'] || ''
        obj.tradingDay = results[0]['__EMPTY_2'] || ''
        obj.mainName = results[0]['__EMPTY_4'] || ''
        obj.brokerPositionProfit = results[1]['__EMPTY'] || ''
        obj.brokerCloseProfit = results[1]['__EMPTY_2'] || ''
        obj.tradingDay = parseTime(obj.tradingDay, '{y}{m}{d}')
        for (var i in obj) {
          const ele = obj[i]
          if (ele === undefined || ele === '') {
            this.$notify.error({
              title: '错误',
              message: '内容不能为空',
              position: 'bottom-right'
            })
            return
          }
          if (i === 'tradingDay' && ele !== '') {
            if (!toDateFromString(ele)) {
              this.$notify.error({
                title: '错误',
                message: '不是有效的日期',
                position: 'bottom-right'
              })
              return
            }
          }

          if (
            (i === 'brokerPositionProfit' &&
              ele !== '' &&
              !verifyNamber(ele)) ||
            (i === 'brokerCloseProfit' && ele !== '' && !verifyNamber(ele))
          ) {
            this.$notify.error({
              title: '错误',
              message:
                this.$t('derivative.futuresProfitCheck.' + i) + '不是数字',
              position: 'bottom-right'
            })
            return
          }
        }

        this.listobj.push(obj)
        // this.list.push(obj)
        const params = {
          data: this.listobj,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.import')
        }
        futuresProfitCheck.getImport(params).then(response => {
          this.$notify(
            notifySuccess({
              msg: '数据导入成功' // 提示新增成功
            })
          )
          this.getList()
        })
      }
    },

    // 导出excel
    exportfunc() {
      this.loading = true
      this.listQuery.isPage = false
      return futuresProfitCheck.list(this.listQuery, this.func)
    },
    callBackfunc() {
      this.listQuery.isPage = true
      this.loading = false
    },
    handleDownload() {
      exportExcel({
        fileName: this.$t('derivative.futuresProfitCheck.title'),
        header: [
          this.$t('derivative.futuresProfitCheck.derivativeAccount'),
          this.$t('derivative.futuresProfitCheck.tradingDay'),
          this.$t('derivative.futuresProfitCheck.ctrmPositionProfit'),
          this.$t('derivative.futuresProfitCheck.ctrmPositionProfitOffset'),
          this.$t('derivative.futuresProfitCheck.ctrmCloseProfit'),
          this.$t('derivative.futuresProfitCheck.ctrmCloseProfitOffset'),
          this.$t('derivative.futuresProfitCheck.stdPositionProfit'),
          this.$t('derivative.futuresProfitCheck.stdCloseProfit'),
          this.$t('derivative.futuresProfitCheck.brokerPositionProfit'),
          this.$t('derivative.futuresProfitCheck.brokerPositionProfitOffset'),
          this.$t('derivative.futuresProfitCheck.brokerCloseProfit'),
          this.$t('derivative.futuresProfitCheck.brokerCloseProfitOffset')
        ],
        filterVal: [
          'derivativeAccount',
          'tradingDay',
          'ctrmPositionProfit',
          'ctrmPositionProfitOffset',
          'ctrmCloseProfit',
          'ctrmCloseProfitOffset',
          'stdPositionProfit',
          'stdCloseProfit',
          'brokerPositionProfit',
          'brokerPositionProfitOffset',
          'brokerCloseProfit',
          'brokerCloseProfitOffset'
        ],
        exportfunc: this.exportfunc,
        callBackfunc: this.callBackfunc
      })
    } // 导出
  }
}
</script>

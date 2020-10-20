<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' style='width:1200px;'>
      <!-- 头部 -->
      <TitleContain v-if="'view'==this.type" :titleName='$t("quotation.futuresPriceAdjust.dialogTitle")' @TitleFun="$emit('closeHandler')" />
      <TitleContain v-else :titleName='$t("quotation.futuresPriceAdjust.dialogTitle")' @TitleFun="cancel" />
      <!-- 内容 -->
      <header :class="{'showStyles': status}" :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
        <div class='form-title'>
          {{this.$t('biz.btn.search')}}
          <div class="form-title-right">
            <div @click="resetForm">_ {{this.$t('biz.btn.clear')}}</div>
            <div v-if="!status" @click="status = !status">
              <i class="el-icon-caret-bottom"></i>{{this.$t('biz.btn.expand')}}</div>
            <div v-if="status" @click="status = !status">
              <i class="el-icon-caret-top"></i>{{this.$t('biz.btn.contract')}}</div>
          </div>
        </div>
        <el-form :model="listQuery.data" ref='queryForm' label-position="left" class="header-form-inline" :class="['header-form-inline', {'header-form-inline-hide': !status}]">
          <el-row :gutter="0">
            <el-col :span="7">
              <el-form-item :label="$t('quotation.futuresPriceAdjust.priceDate')" prop='priceDate'>
                <el-date-picker v-model="listQuery.data.priceDate" type="date" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format="yyyyMMdd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('quotation.futuresPriceAdjust.exchangeId')" prop='exchangeId'>
                <exchange v-model="listQuery.data.exchangeId" :dataVal="(listQuery.data.exchangeId || '')" :queryData="{usingFlag:'1'}"></exchange>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('quotation.futuresPriceAdjust.varietiesId')" prop='futuresVarietiesId'>
                <futures-varieties v-model="listQuery.data.futuresVarietiesId" showType='name' :dataVal="(listQuery.data.futuresVarietiesName || '')"></futures-varieties>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('quotation.futuresPriceAdjust.futuresContractId')" prop='futuresContractId'>
                <futures-contract v-model="listQuery.data.futuresContractId" showType='name' :dataVal="(listQuery.data.futuresContractId || '')"></futures-contract>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 右侧搜索按钮 -->
          <div class="search-btn">
            <el-button type="primary" @click="onSubmit" size="medium">
              {{this.$t('biz.lbl.search')}}
            </el-button>
          </div>
        </el-form>
      </header>

      <!-- 列表内容 -->
      <main :class="{'activeTops': status}" :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
        <el-tabs v-model="activeName" type="border-card">
          <!-- 待选 -->
          <el-tab-pane :label="$t('quotation.futuresPriceAdjust.selectList')" name="selectList">
            <el-table :data="waitData" stripe v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" border class='table-content tb-edit' ref="waitTable" style="border:1px solid" height='400' @row-click="handleCurrent" @selection-change="handleSelectionChange">
              <el-table-column align='center' type="index" width="50" label=' ' fixed></el-table-column>
              <el-table-column type="selection" width="42" fixed></el-table-column>
              <el-table-column prop='exchangeName' :label="$t('quotation.futuresPriceAdjust.exchangeName')" min-width='160'></el-table-column>
              <el-table-column prop='futuresVarietiesName' :label="$t('quotation.futuresPriceAdjust.futuresVarietiesName')" min-width='120'></el-table-column>
              <el-table-column prop='futuresContractName' :label="$t('quotation.futuresPriceAdjust.futuresContractName')" min-width='120'></el-table-column>
              <el-table-column prop='futuresContractCode' :label="$t('quotation.futuresPriceAdjust.futuresContractCode')" min-width='120'></el-table-column>
              <el-table-column align="right" prop='openPrice' :label="$t('quotation.futuresPriceAdjust.openPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.openPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" prop='closingPrice' :label="$t('quotation.futuresPriceAdjust.closingPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.closingPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" prop='highestPrice' :label="$t('quotation.futuresPriceAdjust.highestPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.highestPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" prop='lowestPrice' :label="$t('quotation.futuresPriceAdjust.lowestPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.lowestPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" prop='settlementPrice' :label="$t('quotation.futuresPriceAdjust.settlementPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.settlementPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align='center' prop='currencyName' :label="$t('quotation.futuresPriceAdjust.currencyName')" min-width='80'>
              </el-table-column>
              <el-table-column align='center' prop='date' :label="$t('quotation.futuresPriceAdjust.priceDate')" min-width='120'>
                <template slot-scope='scope'>
                  <span>{{scope.row.priceDate | dateFormat}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 已选 -->
          <el-tab-pane :label="$t('quotation.futuresPriceAdjust.detailList')" name="detailList">
            <el-table :data="storeData" stripe v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" border class='table-content tb-edit' ref="selectTable" style="border: 1px solid" height='400'>
              <el-table-column align='center' type="index" width="50" label=' ' fixed></el-table-column>
              <el-table-column prop='exchangeName' :label="$t('quotation.futuresPriceAdjust.exchangeName')" min-width='160'></el-table-column>
              <el-table-column prop='futuresVarietiesName' :label="$t('quotation.futuresPriceAdjust.futuresVarietiesName')" min-width='120'></el-table-column>
              <el-table-column prop='futuresContractName' :label="$t('quotation.futuresPriceAdjust.futuresContractName')" min-width='120'></el-table-column>
              <el-table-column prop='futuresContractCode' :label="$t('quotation.futuresPriceAdjust.futuresContractCode')" min-width='120'></el-table-column>
              <el-table-column align="right" prop='openPrice' :label="$t('quotation.futuresPriceAdjust.openPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.openPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" prop='closingPrice' :label="$t('quotation.futuresPriceAdjust.closingPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.closingPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" prop='highestPrice' :label="$t('quotation.futuresPriceAdjust.highestPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.highestPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" prop='lowestPrice' :label="$t('quotation.futuresPriceAdjust.lowestPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.lowestPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align="right" prop='settlementPrice' :label="$t('quotation.futuresPriceAdjust.settlementPrice')" min-width='150' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.settlementPrice | numFilter(8) | thousandth}}</span>
                </template>
              </el-table-column>
              <el-table-column align='center' prop='currencyName' :label="$t('quotation.futuresPriceAdjust.currencyName')" min-width='80'>
              </el-table-column>
              <el-table-column align='center' prop='date' :label="$t('quotation.futuresPriceAdjust.priceDate')" min-width='120'>
                <template slot-scope='scope'>
                  <span>{{scope.row.priceDate | dateFormat}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div class='mainContainer'>
          <!-- 分页 -->
          <el-pagination background class="PageTions" layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 , 100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </main>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click='cancel' v-if="type!=='view'">{{ $t('biz.btn.cancel') }}</el-button>
        <el-button type="primary" @click="nextClick">{{ $t('biz.btn.next') }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TitleContain from '@/components/frame/TitleContain'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import exchange from '@/views/frame/base/data/components/Exchange'
import futuresVarieties from '@/views/frame/base/data/components/FuturesVarieties'
import futuresContract from '@/views/frame/base/data/components/FuturesContract'
import { getDialogList } from '@/api/frame/rm/derivative/futuresPriceAdjust'

export default {
  name: 'creditEdit',
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      type: this.$route.query.type,
      activeName: 'selectList',
      productCategoryList: [],
      dialogVisible: true,
      loading: false,
      status: false,
      total: null,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          futuresContractId: '',
          futuresVarietiesId: '',
          exchangeId: '',
          priceDate: '',
          usingFlag: '1'
        },
        sorString: ''
      },
      waitData: [],
      selectData: this.myDetailData,
      storeData: this.myDetailData // 用于储存所有已选
    }
  },
  props: {
    myDetailData: Array
  },
  components: {
    exchange,
    futuresVarieties,
    futuresContract,
    TitleContain
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  mounted() {
    this.selectData.forEach(row => {
      row.uniqueInfo = row.priceDate + row.futuresContractCode
    })
    this.storeData.forEach(row => {
      row.uniqueInfo = row.priceDate + row.futuresContractCode
    })
    this.getList()
  },
  methods: {
    getList() {
      getDialogList(this.listQuery, this.func)
        .then(response => {
          this.loading = false
          this.waitData = response.data
          this.total = response.total
          const ids = this.storeData.map(v => {
            return v.uniqueInfo
          })
          const selectRows = this.waitData.filter(row => {
            return ids.includes(row.uniqueInfo)
          })
          this.$nextTick(() => {
            this.toggleSelection(selectRows)
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 重置查询表单
    resetForm() {
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields()
        this.getList()
      }
    },
    // 查询
    onSubmit() {
      this.loading = true
      this.getList()
    },
    // 在选择列表中数据
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.waitTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.waitTable.clearSelection()
      }
    },
    // 点击当前行选中状态
    handleCurrent(row, event, column) {
      this.$refs.waitTable.toggleRowSelection(row)
    },
    // 处理勾选后
    handleSelectionChange(val) {
      this.selectData = val
      const ids = this.waitData.map(row => {
        return row.uniqueInfo
      })
      const tmpData = []
      this.storeData.forEach(i => {
        if (!ids.includes(i.uniqueInfo)) {
          tmpData.push(i)
        }
      })
      this.storeData = tmpData.concat(this.selectData)
      // 通过操作dom更改选中行底色
      this.$nextTick(() => {
        if (!this.$refs.waitTable) return
        $(this.$refs.waitTable.$el)
          .find('.el-table__row td')
          .removeClass('select-row-bg-color')
        $(this.$refs.waitTable.$el)
          .find('.is-checked')
          .parents('.el-table__row')
          .find('td')
          .addClass('select-row-bg-color')
      })
    },
    nextClick() {
      if (this.storeData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('请选择数据!')
          })
        )
      } else {
        this.storeData.forEach(element => {
          element.openPriceOld = element.openPrice
          element.closingPriceOld = element.closingPrice
          element.highestPriceOld = element.highestPrice
          element.lowestPriceOld = element.lowestPrice
          element.settlementPriceOld = element.settlementPrice
          element.id = null
        })
        this.$emit('close', this.storeData)
      }
    },
    // 页码跳转
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.selectData = []
      this.listQuery.current = val
      this.getList()
    },
    // 取消
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.$emit('close')
        })
        .catch(() => {})
    }
  }
}
</script>

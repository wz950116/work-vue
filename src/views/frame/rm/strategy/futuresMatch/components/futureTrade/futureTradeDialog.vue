<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '1170px' : '1330px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <!-- 头部 -->
      <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
        <!-- form的版面 -->
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <!-- 交易日期 -->
            <template>
              <el-col :span="7">
                <el-form-item :label="$t('derivative.futuresAccountTrade.tradingDay')" prop='tradingDay'>
                  <el-row :gutter="0">
                    <el-col :span="11">
                      <el-date-picker v-model="listQuery.data.tradingDayFrom" type="date" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                      </el-date-picker>
                    </el-col>
                    <el-col :span="2" align='center'>~</el-col>
                    <el-col :span="11">
                      <el-date-picker v-model="listQuery.data.tradingDayTo" type="date" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                      </el-date-picker>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <!-- 期货账号 -->
              <el-col :span="7">
                <el-form-item :label="$t('derivative.futuresAccountTrade.derivativeAccount')" prop='derivativeAccount'>
                  <base-select v-model="listQuery.data.derivativeAccount" :attrs="{data: 'DERIVATIVE_ACCOUNT',clearable: true}"></base-select>
                </el-form-item>
              </el-col>
              <!-- 合约 -->
              <el-col :span="7">
                <el-form-item :label="$t('derivative.futuresAccountTrade.futuresContractCode')" prop='futuresContractCode'>
                  <base-select v-model="listQuery.data.futuresContractCode" :attrs="{data: 'FUTURES_CONTRACT',filterable: true,disabled: disabled,clearable: true,params:{futuresVarietiesCode: productCode}}"></base-select>
                </el-form-item>
              </el-col>
            </template>
            <template v-if="expandStatus">
              <!-- 开平 -->
              <el-col :span="7">
                <el-form-item :label="$t('derivative.futuresAccountTrade.offsetFlag')" prop='offsetFlag'>
                  <el-select v-model="listQuery.data.offsetFlag" clearable filterable :placeholder="$t('biz.placeholder.choose')" :disabled="disabled">
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
            <el-button type="primary" @click="listData" v-db-click>
              {{this.$t('biz.lbl.search')}}
            </el-button>
          </div>
          <!-- 展开收起 -->
          <!-- <div class='expand' @click='expand' v-show='true'>
            <i v-if='expandStatus' class='el-icon-arrow-up'></i>
            <i v-else class='el-icon-arrow-down'></i>
          </div> -->
        </el-form>
      </header>

      <main>
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" height='384' @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column type="selection" width="45" align='center'></el-table-column>
          <el-table-column width="100" :label="$t('derivative.futuresAccountTrade.tradingDay')" prop="tradingDay"></el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.derivativeAccount')" prop="derivativeAccount"></el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.derivativeSubAccount')" prop="derivativeSubAccount"></el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.futuresContractCode')" prop="futuresContractCode"></el-table-column>
          <el-table-column align="center" width="100" :label="$t('derivative.futuresAccountTrade.orderSysId')" prop="orderSysId">
          </el-table-column>
          <el-table-column align="center" width="80" :label="$t('derivative.futuresAccountTrade.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="80" :label="$t('derivative.futuresAccountTrade.offsetFlag')" prop="offsetFlag">
            <template slot-scope="scope">
              <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.futureOffsetType'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('derivative.futuresAccountTrade.price')" prop="price">
            <template slot-scope="scope">
              {{scope.row.price | priceFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.volume')" prop="volume">
            <template slot-scope="scope">
              {{scope.row.volume | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.amount')" prop="amount">
            <template slot-scope="scope">
              {{scope.row.amount | moneyFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.commission')" prop="commission">
            <template slot-scope="scope">
              {{scope.row.commission | moneyFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.hedgeFlag')" prop="hedgeFlag">
            <template slot-scope="scope">
              <span>{{scope.row.hedgeFlag | dataDictFormat($t('datadict.futureHedgeType'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.tradeId')" prop="tradeCode"></el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.mainName')" prop="mainName"></el-table-column>
          <el-table-column width="120" :label="$t('derivative.futuresAccountTrade.dataSourceType')" prop="dataSourceType">
            <template slot-scope="scope">
              <span>{{scope.row.dataSourceType | dataDictFormat($t('datadict.futureDataSourceType'))}}</span>
            </template>
          </el-table-column>
        </el-table>
      </main>

      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="cancel">
          {{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type='primary' v-db-click size="mini" @click="save">
          {{$t('biz.btn.choose')}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {},
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      tableData: [],
      multipleSelection: [],
      loading: false,
      height: 200,
      disabled: false,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          productCode: this.productCode,
          futuresContractCode: this.contractCode,
          tradeNature: this.tradeNature,
          offsetFlag: this.offsetFlag,
          direction: this.direction,
          tradingDayFrom: null,
          tradingDayTo: null,
          derivativeAccount: this.derivativeAccount
        },
        defaultSortString: 'id.desc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.futureMatch.dialog.futureTrade')
    }
  },
  props: ['productCode', 'contractCode', 'tradeNature', 'offsetFlag', 'direction'],
  mounted() {
    if (this.tradeNature === '3') {
      this.$set(this.listQuery.data, 'productCode', this.productCode)
      this.$set(this.listQuery.data, 'futuresContractCode', this.contractCode)
      this.$set(this.listQuery.data, 'offsetFlag', this.offsetFlag)
      this.$set(this.listQuery.data, 'direction', this.direction)
      this.disabled = true
    } else {
      this.$set(this.listQuery.data, 'productCode', this.productCode)
      this.$set(this.listQuery.data, 'futuresContractCode', this.contractCode)
      this.disabled = false
    }
    this.listData()
  },
  methods: {
    listData() {
      request({
        url: '/api/dvt/dvtFutureTrade/listByParams',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.tableData.forEach((i, index) => {
          i.tradeCode = i.tradeId
          i.tradeId = i.id
          i.rowNum = index
          i.id = ''
          i.versionNum = ''
          if (i.matchLots) {
            i.canMatchLots = i.volume - i.matchLots
          } else {
            i.canMatchLots = i.volume
          }
          i.matchLots = 0
        })
      })
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (this.multipleSelection.length === 0) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.multipleSelection)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDbclick(data) {
      this.$emit('confirm', [data])
    },
    // 展开收起
    expand() {
      this.expandStatus = !this.expandStatus
      this.tableComputed()
    },
    // 计算列表高度
    tableComputed() {
      this.$nextTick(() => {
        const getElHeadHeight = window.getComputedStyle(document.getElementById('elHead')).height.split('px')[0]
        this.tableHeight = this.clientWidth < 1366 ? this.clientHeight - getElHeadHeight - 188 : this.clientHeight - getElHeadHeight - 172
      })
    }
  }
}
</script>

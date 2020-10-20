<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <main>
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" height='450' @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column type="selection" width="45" align='center'></el-table-column>
          <el-table-column width="100" :label="$t('derivative.externalTrade.tradingDay')" prop="tradingDay"></el-table-column>
          <el-table-column width="120" :label="$t('derivative.externalTrade.derivativeAccount')" prop="derivativeAccount"></el-table-column>
          <el-table-column width="120" :label="$t('derivative.externalTrade.derivativeSubAccount')" prop="derivativeSubAccount"></el-table-column>
          <el-table-column width="120" :label="$t('derivative.externalTrade.futuresContractCode')" prop="futuresContractCode"></el-table-column>
          <el-table-column align="center" width="100" :label="$t('derivative.externalTrade.tradeId')" prop="tradeId"></el-table-column>
          <el-table-column align="center" width="80" :label="$t('derivative.externalTrade.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="80" :label="$t('derivative.externalTrade.price')" prop="price">
            <template slot-scope="scope">
              {{scope.row.price | priceFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('derivative.externalTrade.volume')" prop="volume">
            <template slot-scope="scope">
              {{scope.row.volume | priceFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('derivative.externalTrade.commission')" prop="commission">
            <template slot-scope="scope">
              {{scope.row.commission | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('derivative.externalTrade.adjustFee')" prop="adjustFee">
            <template slot-scope="scope">
              {{scope.row.adjustFee | moneyFilter | thousands}}
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
      tableData: [],
      multipleSelection: [],
      loading: false,
      height: 200,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {},
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
  props: ['productCode', 'contractCode', 'tradeNature', 'direction'],
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      if (this.tradeNature === '3') {
        this.listQuery.data.futuresContractCode = this.productCode
        this.listQuery.data.futuresContractCode = this.contractCode
        this.listQuery.data.direction = this.direction
      } else {
        this.listQuery.data.productCode = this.productCode
        this.listQuery.data.futuresContractCode = this.contractCode
      }

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
    }
  }
}
</script>

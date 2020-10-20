<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <main>
        <el-table stripe border class='table-content' ref="strategyInfo" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" height='450' @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <!-- 类型16 -->
          <el-table-column v-if="['1','6'].includes(this.strategyNature)" width="90" :label="$t('strategy.strategyManagement.tab.itemClass')" prop="itemClass">
            <template slot-scope="scope">
              <span>{{scope.row.itemClass | dataDictFormat($t('datadict.itemClass'))}}</span>
            </template>
          </el-table-column>
          <!-- 品种1246 -->
          <el-table-column width="120" :label="$t('strategy.strategyManagement.tab.productCode')" prop="productName"></el-table-column>
          <!-- 方向1246 -->
          <el-table-column v-if="['1','2','4','6'].includes(this.strategyNature)" width="80" :label="$t('strategy.strategyManagement.tab.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <!-- 合约2 -->
          <el-table-column v-if="this.strategyNature==='2'" width="120" align="right" :label="$t('strategy.strategyManagement.tab.contractCode')" prop="contractCode"></el-table-column>
          <!-- 价格126 -->
          <el-table-column v-if="['1','2','6'].includes(this.strategyNature)" width="120" align="right" :label="$t('strategy.strategyManagement.tab.price')" prop="price"></el-table-column>
          <!-- 每组数量126 -->
          <el-table-column v-if="['1','2','6'].includes(this.strategyNature)" width="120" align="right" :label="$t('strategy.strategyManagement.tab.quantity')" prop="quantity">
            <template slot-scope="scope">
              {{scope.row.quantity | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <!-- 最大开仓手数1246 -->
          <el-table-column width="120" align="right" :label="$t('strategy.strategyManagement.tab.maxHands')" prop="maxHands"></el-table-column>

          <!-- 最大开仓量1246 -->
          <el-table-column width="120" align="right" :label="$t('strategy.strategyManagement.tab.maxPostion')" prop="maxPostion">
            <template slot-scope="scope">
              {{scope.row.maxPostion | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <!-- 单位1246 -->
          <el-table-column width="90" :label="$t('strategy.strategyManagement.tab.unitCode')" prop="unitCode">
            <template slot-scope="scope">
              <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
            </template>
          </el-table-column>
          <!-- 估值基准16 -->
          <el-table-column v-if="['1','6'].includes(this.strategyNature)" width="140" align="right" :label="$t('strategy.strategyManagement.tab.valuationCode')" prop="valuationName"></el-table-column>
          <!-- 市场1246 -->
          <el-table-column width="140" align="right" :label="$t('strategy.strategyManagement.tab.marketCode')" prop="marketName"></el-table-column>
          <!-- 币种1246 -->
          <el-table-column width="90" align="right" :label="$t('strategy.strategyManagement.tab.currencyCode')" prop="currencyName">
          </el-table-column>
          <!-- 备注1 -->
          <el-table-column v-if="['1','6'].includes(this.strategyNature)" width="160" align="right" :label="$t('strategy.strategyManagement.tab.remark')" prop="remark"></el-table-column>
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
      multipleSelection: {},
      loading: true,
      height: 200,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          strategyCode: this.strategyCode,
          itemClass: this.itemClass,
          auditStatus: '3'
        },
        sortString: 'strategyCode.desc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.strategyManagement.dialog.detail')
    }
  },
  props: {
    strategyCode: {
      type: String,
      default: ''
    },
    strategyNature: {
      type: String,
      default: ''
    },
    itemClass: {
      type: Array,
      default: ['2']
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      request({
        url: '/api/strg/strgInstrDetail/listByCode',
        method: 'POST',
        data: {
          data: {
            instructionCode: this.strategyCode,
            itemClassList: this.itemClass,
            virtual: true,
            StrgLevel: '4'
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(request => {
        this.tableData = request.data
        this.tableData.forEach((i, index) => {
          i.detailId = i.id
          i.rowNum = index
          i.id = ''
          i.versionNum = ''
          i.maxPostion = i.reservedNum2
          i.quantity = i.reservedNum1
          i.unitCode = '1'
          i.matchLots = 0
          i.maxHands = i.lots
          i.marketName = i.exchangeName
        })
        this.loading = false
      })
    },
    cancel() {
      this.$emit('closeHandlerDialog')
    },
    save() {
      if (!this.multipleSelection) {
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
      this.$emit('confirm', data)
    }
  }
}
</script>

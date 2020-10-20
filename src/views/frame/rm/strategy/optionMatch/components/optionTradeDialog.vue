<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <!-- 头部 -->
      <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
        <!-- form的版面 -->
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="7">
              <el-form-item :label="$t('strategy.optionMatch.list.contractCode')" prop='optionContract'>
                <base-select v-model="listQuery.data.optionContract" :attrs="{data: 'OPTION_CONTRACT',clearable: true, disabled: true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('strategy.optionMatch.list.tradingDay')" prop='tradingDay'>
                <el-date-picker v-model="listQuery.data.tradingDay" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('strategy.optionMatch.list.optionOffset')" prop='optionOffset'>
                <el-select v-model="listQuery.data.optionOffset" :placeholder="$t('biz.placeholder.choose')" :disabled="true">
                  <el-option v-for="item in $t('datadict.optionOffset')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn" v-permission="['query']">
            <el-button type="primary" @click="listData" v-db-click>
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

      <main>
        <el-table stripe border highlight-current-row ref="instrDetail" class='table-content tb-edit' :data="tableData" style="border:1px solid;" height='400' @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
          <el-table-column type="selection" width="45" align='center'></el-table-column>
          <el-table-column :label="$t('strategy.optionMatch.list.contractCode')" width="240" prop="optionContract"></el-table-column>
          <el-table-column align="center" width="80" :label="$t('strategy.optionMatch.list.optionOffset')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.optionOffset | dataDictFormat($t('datadict.optionOffset'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="80" :label="$t('strategy.optionMatch.list.currencyName')" prop="currencyName"></el-table-column>
          <el-table-column align="center" width="80" :label="$t('strategy.optionMatch.list.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="80" :label="$t('strategy.optionMatch.list.callPut')" prop="callPut">
            <template slot-scope="scope">
              <span>{{scope.row.callPut | dataDictFormat($t('datadict.callPut'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('strategy.optionMatch.list.strikePrice')" prop="strikePrice">
            <template slot-scope='scope'>
              <span>{{scope.row.strikePrice | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('strategy.optionMatch.list.price')" prop="price">
            <template slot-scope='scope'>
              <span>{{scope.row.price | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('strategy.optionMatch.list.volume')" prop="volume">
            <template slot-scope='scope'>
              <span>{{scope.row.volume | quantityFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.optionMatch.list.counterpartyName')" width="120" prop="counterpartyName"></el-table-column>
          <el-table-column :label="$t('strategy.optionMatch.list.derivativeAccount')" width="120" prop="derivativeAccount"></el-table-column>
          <el-table-column align="center" width="120" :label="$t('strategy.optionMatch.list.tradingDay')" prop="tradingDay">
            <template slot-scope='scope'>
              <span>{{scope.row.tradingDay | dateFormat}}</span>
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
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      multipleSelection: {},
      tableData: [],
      loading: true,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          tradeFlag: '1'
        },
        defaultSortString: 'id.desc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.optionMatch.dialog.optionTrade')
    }
  },
  props: ['instructionInfo'],
  mounted() {
    this.listData()
  },
  watch: {
    instructionCode(val) {
      this.listData()
    }
  },
  methods: {
    expand() {
      this.expandStatus = !this.expandStatus
      this.tableComputed()
    },
    // 计算列表高度
    tableComputed() {
      this.$nextTick(() => {
        const elHead = document.getElementById('elHead')
        if (elHead) {
          const getElHeadHeight = window.getComputedStyle(elHead).height.split('px')[0]
          if (this.$parent.$refs.qmTable) {
            this.$parent.$refs.qmTable.tableHeight = this.clientWidth < 1366 ? (this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 378 : this.clientHeight - getElHeadHeight - 348) : this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 361 : this.clientHeight - getElHeadHeight - 331
          }
        }
      })
    },
    listData() {
      this.listQuery.data.optionContract = this.instructionInfo.contractCode
      this.listQuery.data.direction = this.instructionInfo.direction
      this.listQuery.data.callPut = this.instructionInfo.callPut
      this.listQuery.data.optionOffset = this.instructionInfo.optionOffset
      this.loading = true
      request({
        url: '/api/derivative/dvtOptionTrade/page',
        method: 'POST',
        data: this.listQuery
      }).then(response => {
        this.tableData = response.data
        this.tableData.forEach((i, index) => {
          i.tradeId = i.id
          i.rowNum = index
          i.id = ''
          i.versionNum = ''
          i.unitCode = '11'
          i.noMatchLots = parseInt(i.lots) - parseInt(i.matchLots)
        })
        this.loading = false
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    cancel() {
      this.$emit('closeHandlerDialog')
    },
    save() {
      if (!this.multipleSelection) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.multipleSelection)
    },
    handleDbclick(data) {
      this.$emit('confirm', [data])
    }
  }
}
</script>

<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '700px' : '850px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <main>
        <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='374' @selection-change="selectionChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column align='center' type="selection" width="42" fixed></el-table-column>
          <el-table-column width="120" :label="$t('strategy.futuresSpotMatch.list.orderSysId')" prop="orderSysId"></el-table-column>
          <el-table-column width="120" :label="$t('strategy.futuresSpotMatch.list.futuresContractCode')" prop="futuresContractCode"></el-table-column>
          <el-table-column align="center" width="80" :label="$t('strategy.futuresSpotMatch.list.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="80" :label="$t('strategy.futuresSpotMatch.list.offsetFlag')" prop="offsetFlag">
            <template slot-scope="scope">
              <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('strategy.futuresSpotMatch.list.matchLots')" prop="matchLots"></el-table-column>
          <el-table-column align="right" width="120" :label="$t('strategy.futuresSpotMatch.list.price')" prop="price"></el-table-column>
          <el-table-column width="120" :label="$t('strategy.futuresSpotMatch.list.derivativeAccount')" prop="derivativeAccount"></el-table-column>
          <el-table-column width="120" :label="$t('strategy.futuresSpotMatch.list.derivativeSubAccount')" prop="derivativeSubAccount"></el-table-column>
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
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'

export default {
  data() {
    return {
      tableData: [],
      selectData: []
    }
  },
  props: {
    strategyCode: String,
    titleName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  mounted() {
    this.listData()
  },
  methods: {
    handleDbclick(data) {
      this.$emit('confirm', data)
    },
    listData() {
      request({
        url: '/api/strategy/strgCompMatch/listTrade',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.strategyCode
        }
      }).then(response => {
        this.tableData = response.data
      })
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (this.selectData.length === 0) {
        if (!this.buyCurrentRow) {
          this.$notify(
            notifyInfo({
              msg: this.$t('biz.msg.noRowSelected')
            })
          )
          return
        }
      }
      this.$emit('confirm', this.selectData)
    },
    selectionChange(val) {
      this.selectData = val
    }
  }
}
</script>

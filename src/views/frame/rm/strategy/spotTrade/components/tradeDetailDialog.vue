<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '800px' : '950px'}">
      <!-- 头部 -->
      <title-contain :titleName='title' @TitleFun="cancel" />

      <main>
        <div v-if="tradeNature === '1'">
          <spotArbitrageDetail :tableData="detailData" @select="detailSelect" v-if="strategyNature==='3'" @dbclick="dbclick"></spotArbitrageDetail>
          <spotUnilateralDetail :tableData="detailData" @select="detailSelect" v-if="strategyNature==='5'" @dbclick="dbclick"></spotUnilateralDetail>
          <hedgeDetail :tableData="detailData" @select="detailSelect" v-if="['1','6'].includes(strategyNature)" @dbclick="dbclick"></hedgeDetail>
        </div>
        <div v-if="tradeNature === '2'">
          <futuresSpotHedge v-if="['1','6'].includes(strategyNature)" @select="detailSelect" :tableData="detailData" :tradeNature="tradeNature" @dbclick="dbclick"></futuresSpotHedge>
          <spotHedge v-if="strategyNature === '3'" @select="detailSelect" :tableData="detailData" @dbclick="dbclick"></spotHedge>
          <spotSingle v-if="strategyNature === '5'" @select="detailSelect" :tableData="detailData" @dbclick="dbclick"></spotSingle>
        </div>
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
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import hedgeDetail from '@/views/frame/rm/strategy/spotTrade/components/hedgeDetail'
import spotArbitrageDetail from '@/views/frame/rm/strategy/spotTrade/components/spotArbitrageDetail'
import spotUnilateralDetail from '@/views/frame/rm/strategy/spotTrade/components/spotUnilateralDetail'
import futuresSpotHedge from '@/views/frame/rm/strategy/plan/component/futuresSpotHedge'
import spotHedge from '@/views/frame/rm/strategy/plan/component/spotHedge'
import spotSingle from '@/views/frame/rm/strategy/plan/component/spotSingle'

export default {
  components: {
    hedgeDetail,
    spotArbitrageDetail,
    spotUnilateralDetail,
    futuresSpotHedge,
    spotHedge,
    spotSingle
  },
  data() {
    return {
      selectData: [],
      detailData: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  props: {
    planCode: {
      type: String,
      default: ''
    },
    strategyNature: {
      type: String,
      default: ''
    },
    tradeNature: {
      type: String,
      default: ''
    },
    title: String
  },
  mounted() {
    var itemClass = ''
    if (this.strategyNature === '1' || this.strategyNature === '6') {
      itemClass = '1'
    }
    request({
      url: '/api/strategy/strgPlan/listDetail',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          planCode: this.planCode,
          itemClass: itemClass
        }
      }
    }).then(request => {
      this.detailData = request.data
      this.detailData.forEach(e => {
        this.$set(e, 'matchQuantity', 0)
      })
    })
  },
  methods: {
    dbclick(data) {
      this.$emit('confirm', data)
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (this.selectData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.selectData)
    },
    detailSelect(val) {
      this.selectData = val
    }
  }
}
</script>

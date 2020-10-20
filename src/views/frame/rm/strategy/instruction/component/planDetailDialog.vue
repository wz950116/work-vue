<template>
  <main>
    <futuresSpotHedge v-if="strategyNature === '1'" :tableData="detailData" :height="height" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></futuresSpotHedge>
    <futuresHedge v-if="strategyNature === '2'" :tableData="detailData" :height="height" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></futuresHedge>
    <spotHedge v-if="strategyNature === '3'" :tableData="detailData" :height="height" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></spotHedge>
    <futuresSingle v-if="strategyNature === '4'" :tableData="detailData" :height="height" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></futuresSingle>
    <spotSingle v-if="strategyNature === '5'" :tableData="detailData" :height="height" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></spotSingle>
    <futuresSpotHedge v-if="strategyNature === '6'" :tableData="detailData" :height="height" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></futuresSpotHedge>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import futuresSpotHedge from '@/views/frame/rm/strategy/instruction/component/futuresSpotHedge'
import futuresHedge from '@/views/frame/rm/strategy/instruction/component/futuresHedge'
import spotHedge from '@/views/frame/rm/strategy/instruction/component/spotHedge'
import spotSingle from '@/views/frame/rm/strategy/instruction/component/spotSingle'
import futuresSingle from '@/views/frame/rm/strategy/instruction/component/futuresSingle'

export default {
  components: {
    futuresSpotHedge,
    futuresHedge,
    spotHedge,
    spotSingle,
    futuresSingle
  },
  data() {
    return {
      detailData: [],
      selectData: {},
      height: 450,
      loading: true
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.plan.dialog.title')
    }
  },
  props: [
    'tradeNature',
    'strategyNature',
    'strategyNatures',
    'planCode',
    'itemClass'
  ],

  mounted() {
    this.listData()
  },
  methods: {
    closeHandlerDialog() {
      this.$emit('closeHandlerDialog')
    },
    confirm(val) {
      this.$emit('confirm', val)
    },

    listData() {
      request({
        url: '/api/strategy/strgPlan/listDetail',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            planCode: this.planCode,
            itemClass: this.itemClass
          }
        }
      }).then(request => {
        this.detailData = request.data
      })
    }
  }
}
</script>

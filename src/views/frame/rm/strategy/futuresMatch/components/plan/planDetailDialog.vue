<template>
  <main>
    <futuresSpotHedge v-if="strategyNature === '1'" :tableData="detailData" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></futuresSpotHedge>
    <futuresHedge v-if="strategyNature === '2'" :tableData="detailData" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></futuresHedge>
    <futuresSingle v-if="strategyNature === '4'" :tableData="detailData" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></futuresSingle>
    <futuresSpotHedge v-if="strategyNature === '6'" :tableData="detailData" @closeHandlerDialog='closeHandlerDialog' @confirm='confirm'></futuresSpotHedge>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import futuresSpotHedge from '@/views/frame/rm/strategy/futuresMatch/components/plan/futuresSpotHedge'
import futuresHedge from '@/views/frame/rm/strategy/futuresMatch/components/plan/futuresHedge'
import futuresSingle from '@/views/frame/rm/strategy/futuresMatch/components/plan/futuresSingle'

export default {
  components: {
    futuresSpotHedge,
    futuresHedge,
    futuresSingle
  },
  data() {
    return {
      detailData: [],
      selectData: {},
      loading: true
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.plan.dialog.title')
    }
  },
  props: ['tradeNature', 'strategyNature', 'strategyNatures', 'planCode', 'itemClass'],

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
        url: '/api/strg/strgInstrDetail/listByCode',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            instructionCode: this.planCode,
            itemClassList: this.itemClass,
            virtual: true
          }
        }
      }).then(request => {
        this.detailData = request.data
        this.detailData.forEach((i, index) => {
          i.detailId = i.id
          i.rowNum = index
          i.id = ''
          i.versionNum = ''
          i.minQuantity = i.reservedNum4
          i.maxQuantity = i.reservedNum1
          i.minPrice = i.price
          i.maxPrice = i.priceDiff
          i.quantity = i.reservedNum2
          i.floatRatio = i.reservedNum3
          i.unitCode = '1'
        })
        this.loading = false
      })
    }
  }
}
</script>

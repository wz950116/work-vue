<template>
  <div>
    <hedging ref="strategyInfo1" v-if="['1','6'].includes(strategyNature)" :itemClass="itemClass" :strategyCode='strategyCode' :strategyNature='strategyNature' :type='optType' :tradeBatchDto='tradeBatchDto' @itemClassChange="itemClassChange"></hedging>
    <futuresUnilateral ref="strategyInfo1" v-if="'4'===strategyNature" :itemClass="itemClass" :strategyCode='strategyCode' :strategyNature='strategyNature' :type='optType' :tradeBatchDto='tradeBatchDto' @itemClassChange="itemClassChange"></futuresUnilateral>
    <futuresArbitrage ref="strategyInfo1" v-if="'2'===strategyNature" :itemClass="itemClass" :strategyCode='strategyCode' :strategyNature='strategyNature' :type='optType' :tradeBatchDto='tradeBatchDto' @itemClassChange="itemClassChange"></futuresArbitrage>
  </div>
</template>

<script>
import hedging from '@/views/frame/rm/strategy/futuresMatch/components/strategy/hedging'
import futuresUnilateral from '@/views/frame/rm/strategy/futuresMatch/components/strategy/futuresUnilateral'
import futuresArbitrage from '@/views/frame/rm/strategy/futuresMatch/components/strategy/futuresArbitrage'
export default {
  components: {
    hedging,
    futuresUnilateral,
    futuresArbitrage
  },
  data() {
    return {}
  },
  props: [
    'strategyNature',
    'strategyCode',
    'optType',
    'tradeBatchDto',
    'itemClass'
  ],
  methods: {
    itemClassChange(val) {
      this.$emit('itemClassChange', val)
    }
  }
}
</script>

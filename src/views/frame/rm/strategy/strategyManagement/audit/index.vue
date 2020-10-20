<template>
  <div>
    <hedging v-if="!formData.parentStrategyCode &&['1'].includes(formData.strategyNature)"></hedging>
    <futuresArbitrage v-if="!formData.parentStrategyCode &&['2'].includes(formData.strategyNature)"></futuresArbitrage>
    <spotArbitrage v-if="!formData.parentStrategyCode &&['3'].includes(formData.strategyNature)"></spotArbitrage>
    <futuresUnilateral v-if="!formData.parentStrategyCode &&['4'].includes(formData.strategyNature)"></futuresUnilateral>
    <spotUnilateral v-if="!formData.parentStrategyCode &&['5'].includes(formData.strategyNature)"></spotUnilateral>
    <other v-if="!formData.parentStrategyCode && ['6'].includes(formData.strategyNature)"></other>
    <optimizationStrategy v-if="formData.parentStrategyCode" :strategyNature='formData.strategyNature' :strategyNatureParent='formData.strategyTypeParent'></optimizationStrategy>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import futuresArbitrage from '@/views/frame/rm/strategy/strategyManagement/futuresArbitrage/add'
import futuresUnilateral from '@/views/frame/rm/strategy/strategyManagement/futuresUnilateral/add'
import hedging from '@/views/frame/rm/strategy/strategyManagement/hedging/add'
import other from '@/views/frame/rm/strategy/strategyManagement/other/add'
import spotArbitrage from '@/views/frame/rm/strategy/strategyManagement/spotArbitrage/add'
import spotUnilateral from '@/views/frame/rm/strategy/strategyManagement/spotUnilateral/add'
import optimizationStrategy from '@/views/frame/rm/strategy/strategyManagement/optimizationStrategy/add'
export default {
  components: {
    futuresArbitrage,
    futuresUnilateral,
    hedging,
    other,
    spotArbitrage,
    spotUnilateral,
    optimizationStrategy
  },
  data() {
    return {
      formData: {}
    }
  },
  props: {
    tableData: {
      type: Array
    },
    height: {
      type: Number,
      default: 400
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      request({
        url: '/api/strg/strategy/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
      })
    }
  }
}
</script>

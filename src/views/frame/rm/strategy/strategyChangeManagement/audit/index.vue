<template>
  <div>
    <hedging v-if="['1'].includes(formData.strategyNature)" :flagFF="'0'"></hedging>
    <futuresArbitrage v-if="['2'].includes(formData.strategyNature)" :flagFF="'0'"></futuresArbitrage>
    <spotArbitrage v-if="['3'].includes(formData.strategyNature)" :flagFF="'0'"></spotArbitrage>
    <futuresUnilateral v-if="['4'].includes(formData.strategyNature)" :flagFF="'0'"></futuresUnilateral>
    <spotUnilateral v-if="['5'].includes(formData.strategyNature)" :flagFF="'0'"></spotUnilateral>
    <other v-if="['6'].includes(formData.strategyNature)" :flagFF="'0'"></other>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import futuresArbitrage from '@/views/frame/rm/strategy/strategyChangeManagement/futuresArbitrage/add'
import futuresUnilateral from '@/views/frame/rm/strategy/strategyChangeManagement/futuresUnilateral/add'
import hedging from '@/views/frame/rm/strategy/strategyChangeManagement/hedging/add'
import other from '@/views/frame/rm/strategy/strategyChangeManagement/other/add'
import spotArbitrage from '@/views/frame/rm/strategy/strategyChangeManagement/spotArbitrage/add'
import spotUnilateral from '@/views/frame/rm/strategy/strategyChangeManagement/spotUnilateral/add'
export default {
  components: {
    futuresArbitrage,
    futuresUnilateral,
    hedging,
    other,
    spotArbitrage,
    spotUnilateral
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
        url: '/api/strg/strgStrategyChg/get',
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

<template>
  <div>
    <futuresSpotHedgeEditForm v-if="['1','6'].includes(formData.strategyNature)" :change="true"></futuresSpotHedgeEditForm>
    <futuresHedgeEditForm v-if="['2'].includes(formData.strategyNature)" :change="true"></futuresHedgeEditForm>
    <spotHedgeEditForm v-if="['3'].includes(formData.strategyNature)" :change="true"></spotHedgeEditForm>
    <futuresSingleEditForm v-if="['4'].includes(formData.strategyNature)" :change="true"></futuresSingleEditForm>
    <spotSingleEditForm v-if="['5'].includes(formData.strategyNature)" :change="true"></spotSingleEditForm>
  </div>
</template>

<script>

import request from '@/utils/frame/base/request'
import futuresHedgeEditForm from '@/views/frame/rm/strategy/plan/futuresHedge/hedgeEditForm'
import spotHedgeEditForm from '@/views/frame/rm/strategy/plan/spotHedge/hedgeEditForm'
import futuresSingleEditForm from '@/views/frame/rm/strategy/plan/futuresSingle/singleEditForm'
import spotSingleEditForm from '@/views/frame/rm/strategy/plan/spotSingle/singleEditForm'
import futuresSpotHedgeEditForm from '@/views/frame/rm/strategy/plan/futuresSpotHedge/futuresSpotHedgeEditForm'

export default {
  components: {
    futuresHedgeEditForm,
    spotHedgeEditForm,
    futuresSingleEditForm,
    spotSingleEditForm,
    futuresSpotHedgeEditForm
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
        url: '/api/strategy/strgPlanChg/get',
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

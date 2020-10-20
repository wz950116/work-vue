<template>
  <div>
    <instruction :typeFlagF='flag'></instruction>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import instruction from '@/views/frame/rm/strategy/instruction/add'
export default {
  components: {
    instruction
  },
  data() {
    return {
      formData: {},
      flag: ''
    }
  },
  props: {},
  mounted() {
    this.getData()
  },

  methods: {
    getData() {
      request({
        url: '/api/strg/instruction/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        if (this.formData.strategyCode === this.formData.planCode) {
          this.flag = '1'
        } else {
          this.flag = '0'
        }
      })
    }
  }
}
</script>

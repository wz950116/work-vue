<!-- 调整原因(期货价格调整单) -->
<template>
  <div>
    <el-input v-model="inputData" type="textarea" :rows="20" :placeholder="$t('biz.placeholder.input')" :disabled="true" resize='none' maxlength='500'></el-input>
  </div>

</template>

<script>
import * as futuresPriceAdjust from '@/api/frame/rm/derivative/futuresPriceAdjust'

export default {
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      inputData: this.remark
    }
  },
  props: {
    id: String,
    disabled: {
      type: Boolean,
      default: true
    },
    remark: String
  },
  model: {
    prop: 'remark',
    event: 'remark'
  },
  watch: {
    remark(value) {
      this.inputData = value
    },
    id(newValue) {
      if (newValue) this.getData()
    },
    inputData(value) {
      this.$emit('remark', value)
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.id) {
        futuresPriceAdjust.get(this.id, this.func).then(response => {
          this.inputData = response.data.futureAdjustDto.remark
        }).catch(() => { })
      }
    }
  }
}
</script>

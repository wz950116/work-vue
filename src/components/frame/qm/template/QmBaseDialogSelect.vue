<template>
  <div>
    <el-input v-model="inputVal" v-bind='attrs' :size='size' :placeholder="$t('biz.placeholder.choose')" suffix-icon="el-icon-search" @focus='handleShowSelect' @clear='clearFn'></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVal: this.value
    }
  },
  model: {
    prop: 'value',
    event: 'evn'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    attrs: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    value(newVal) {
      this.inputVal = newVal
    }
  },
  methods: {
    change(evl) {
      this.$emit('evn', evl)
    },
    handleShowSelect() {
      this.$emit('handleSelect')
    },
    clearFn() {
      this.$emit('evn', '')
      // 清除自定义回调
      this.$emit('clear')
    }
  }
}
</script>

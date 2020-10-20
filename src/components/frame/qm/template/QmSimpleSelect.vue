<template>
  <div>
    <el-select v-model="newValue" v-bind='attrs' v-on="events" :size='size' :placeholder="$t('biz.placeholder.choose')" @change="change" @visible-change="visibleChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :disabled="item.disabled" :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      newValue: this.value
    }
  },
  model: {
    prop: 'value',
    event: 'event'
  },
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    attrs: {
      type: Object,
      default() {
        return {}
      }
    },
    events: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    value(newVal) {
      this.newValue = newVal
      this.changeVal(newVal)
    }
  },
  methods: {
    change(evl) {
      this.$emit('event', evl)
      this.$emit('change', evl)
    },
    visibleChange(evl) {
      this.$emit('visibleChange', evl)
    },
    changeVal(newVal) {
      this.newValue = newVal
    }
  }
}
</script>

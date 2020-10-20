
<template>
  <el-select :clearable="clearable" @change="change" v-model="checkItem" :filterable="filterable" :placeholder="$t('biz.placeholder.choose')" :disabled="disabled">
    <el-option v-for="item in derivativeAccountList" :key="item.id" :label="item.derivativeAccountName" :value="item.key">
    </el-option>
  </el-select>
</template>
<script>
// 期货账号
import { listDerivativeAccount } from '@/api/frame/rm/derivative/futuresPosi'
export default {
  data() {
    return {
      loading: false,
      derivativeAccountList: [],
      checkItem: this.value
    }
  },
  props: {
    value: {
      type: [String, Array],
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        this.checkItem = null
      } else {
        this.checkItem = newValue
      }
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  mounted() {
    // 渲染数据
    this.getList()
  },
  methods: {
    // 列表请求
    getList() {
      this.loading = true
      listDerivativeAccount().then(response => {
        this.derivativeAccountList = response.data
      })
    },
    change(evl) {
      this.$emit('change', evl)
    }
  }
}
</script>

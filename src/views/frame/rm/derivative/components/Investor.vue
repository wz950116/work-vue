<template>
  <el-select v-model="checkItem" @change="change" :clearable="clearable" :filterable="filterable" allow-create default-first-option :disabled="disabled" :size="size" :multiple="multiple" collapse-tags>
    <el-option v-for="item in listData" :key="item.id" :label="item.customerName" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import { getList } from '@/api/frame/rm/derivative/futuresAccountTrade'

export default {
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      loading: false,
      status: false,
      listData: [],
      checkItem: this.value,
      listQuery: {
        isPage: false,
        data: {},
        defaultSortString: 'supplierName.desc',
        funcModule: this.$t('route.' + this.$route.meta.title),

        funcOperation: this.$t('biz.btn.search')
      }
    }
  },
  props: {
    value: {
      type: [String, Array]
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
    size: {
      type: String,
      default: 'medium'
    },
    queryConditions: {
      type: Object,
      default() {
        return {}
      }
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
    event: 'setinvestorId'
  },
  mounted() {
    // 渲染数据
    this.getList()
  },
  methods: {
    // 列表请求
    getList() {
      this.loading = true

      this.listQuery.data = this.queryConditions
      this.listQuery.data.usingFlag = '1'
      getList(this.listQuery, this.func)
        .then(response => {
          this.loading = false
          this.listData = response.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    change(evl) {
      this.$emit('setinvestorId', evl)
    }
  }
}
</script>

<template>
  <el-select :placeholder="$t('biz.placeholder.choose')" v-model="checkItem" @change="change" :disabled="disabled" :clearable="clearable" :filterable="filterable" :size='size'>
    <el-option v-for="item in listData" :key="item.exchangeCode" :label="item.exchangeName" :value="item.exchangeCode"></el-option>
  </el-select>
</template>

<script>
import exchangeApi from '@/api/frame/base/data/exchange'

export default {
  data() {
    return {
      flag: true,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      checkItem: this.value,
      listData: [],
      listQuery: {
        isPage: false,
        data: {},
        defaultSortString: 'usingFlag.desc,createDate.desc'
      }
    }
  },
  props: {
    value: {
      type: String,
      default: null
    },
    queryData: {
      type: Object,
      default() {
        return {
          usingFlag: '1',
          exchangeType: '1'
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        this.checkItem = null
      } else {
        if (this.listData && this.listData.length > 0) {
          this.changeVal(newValue)
        }
      }
    }
  },
  model: {
    prop: 'value',
    event: 'exchangeId'
  },
  components: {},
  computed: {},
  mounted() {
    // 渲染表格数据
    this.getList()
  },
  methods: {
    getDeleteData(a, b) {
      exchangeApi.getDeleteData(a, b).then(response => {
        if (response.data) {
          this.listData.push(response.data)
        }
        this.listData.forEach(item => {
          if (this.checkItem === item.exchangeCode) {
            this.$emit('change', item)
          }
        })
      })
    },
    // 列表请求
    getList() {
      this.listQuery.data = Object.assign(this.queryData, this.listQuery.data)
      this.func.funcOperation = this.$t('biz.btn.search')
      exchangeApi
        .getList(this.listQuery, this.func)
        .then(response => {
          this.listData = response.data
          if (this.value) this.changeVal(this.value)
        })
        .catch(() => {})
    },
    change(evl) {
      this.$emit('exchangeId', evl)
      if (evl) {
        this.listData.forEach(item => {
          if (evl === item.exchangeCode) {
            this.$emit('change', item)
          }
        })
      }
    },
    changeVal(newValue) {
      let isNull = false // 是否已被删除
      const ids = this.listData.map(item => {
        return item.exchangeCode
      }) // 下拉选id集合
      isNull = !ids.includes(newValue)
      if (isNull && this.disabled) {
        exchangeApi.getDeleteData(newValue, this.func).then(response => {
          if (response.data) {
            this.checkItem = response.data.exchangeName
            this.change(newValue)
          }
        })
      } else if (isNull && !this.disabled) {
        this.checkItem = ''
        this.$emit('exchangeId', '')
      } else {
        this.checkItem = newValue
      }
      this.listData.forEach(item => {
        if (newValue === item.exchangeCode) {
          this.$emit('change', item)
        }
      })
    }
  }
}
</script>

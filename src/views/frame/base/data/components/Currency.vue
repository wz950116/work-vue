<template>
  <el-select :placeholder="$t('biz.placeholder.choose')" v-model="checkItem" @change="change" :disabled="disabled" :clearable="clearable" :filterable="filterable" :size='size'>
    <el-option v-for="item in listData" :key="item.currencyCode" :label="item.currencyName" :value="item.currencyCode"></el-option>
  </el-select>
</template>

<script>
import currencyApi from '@/api/frame/base/data/currency'

export default {
  data() {
    return {
      flag: true,
      checkItem: this.value,
      currencyInfo: null,
      listData: [],
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      listQuery: {
        isPage: false,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {},
        defaultSortString: 'createDate.desc'
      }
    }
  },
  props: {
    value: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    queryData: {
      type: Object,
      default() {
        return {}
      }
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
    event: 'currencyId'
  },
  mounted() {
    // 渲染数据
    this.getList()
  },
  methods: {
    getDeleteData(a, b) {
      currencyApi.getDeleteData(a, b).then(response => {
        if (response.data) {
          this.listData.push(response.data)
        }
      })
    },
    // 列表请求
    getList() {
      this.listQuery.data = this.queryData
      this.func.funcOperation = this.$t('biz.btn.search')
      currencyApi
        .getList(this.listQuery, this.func)
        .then(response => {
          this.listData = response.data
          if (this.value) this.changeVal(this.value)
          this.$emit('currencyData', this.listData)
        })
        .catch(() => {})
    },
    change(evl) {
      this.getName(evl)
      this.$emit('setCurrencyInfo', this.currencyInfo)
      this.$emit('currencyId', evl)
    },
    getName(evl) {
      this.currencyInfo = null
      this.currencyInfo = this.listData.find(function(item) {
        return item.currencyCode === evl
      })
    },
    changeVal(newValue) {
      let isNull = false // 是否已被删除
      const ids = this.listData.map(item => {
        return item.currencyCode
      }) // 下拉选id集合
      isNull = !ids.includes(newValue)
      if (isNull && this.disabled) {
        currencyApi.getDeleteCodeData(newValue, this.func).then(response => {
          if (response.data) {
            this.checkItem = response.data.currencyName
            this.change(newValue)
          }
        })
      } else if (isNull && !this.disabled) {
        this.checkItem = ''
        this.$emit('currencyId', '')
      } else {
        this.checkItem = newValue
      }
    }
  }
}
</script>

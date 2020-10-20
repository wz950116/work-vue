<template>
  <el-select :placeholder="$t('biz.placeholder.choose')" v-model="checkItem" @change="change" :disabled="disabled" :clearable="clearable" :filterable="filterable">
    <el-option v-if='showType === "code"' v-for="item in listData" :key="item.id" :label="item.futuresVarietiesCode" :value="item.id"></el-option>
    <el-option v-if='showType === "name"' v-for="item in listData" :key="item.id" :label="item.futuresVarietiesName" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import { getList, getDeleteData } from '@/api/frame/base/data/futuresVarieties'

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
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        defaultSortString: 'usingFlag.desc,createDate.desc'
      },
      entity: {}
    }
  },
  props: {
    showType: {
      type: String,
      default: 'name'
    },
    value: {
      type: String,
      default: null
    },
    queryData: {
      type: Object,
      default() {
        return { usingFlag: '1' }
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
    event: 'futuresVarietiesId'
  },
  components: {},
  computed: {},
  mounted() {
    // 渲染表格数据
    this.getList()
  },
  methods: {
    getDeleteData(a, b) {
      getDeleteData(a, b).then(response => {
        if (response.data) {
          this.listData.push(response.data)
        }
        this.listData.forEach(item => {
          if (this.checkItem === item.id) {
            this.$emit('getFuturesVarietiesName', item)
          }
        })
      })
    },
    // 列表请求
    getList() {
      this.listQuery.data = Object.assign(this.queryData, this.listQuery.data)
      getList(this.listQuery, this.func)
        .then(response => {
          this.listData = response.data
          if (this.value) this.changeVal(this.value)
        })
        .catch(() => {})
    },
    change(evl) {
      this.$emit('futuresVarietiesId', evl)
      if (evl) {
        this.listData.forEach(item => {
          if (evl === item.id) {
            this.$emit('getFuturesVarietiesName', item)
          }
        })
      }
    },
    changeVal(newValue) {
      let isNull = false // 是否已被删除
      const ids = this.listData.map(item => {
        return item.id
      }) // 下拉选id集合
      isNull = !ids.includes(newValue)
      if (isNull && this.disabled) {
        getDeleteData(newValue, this.func).then(response => {
          if (response.data) {
            this.checkItem = response.data.futuresVarietiesName
            this.listData.push(response.data)
            this.change(newValue)
          }
        })
      } else if (isNull && !this.disabled) {
        this.checkItem = ''
        this.$emit('futuresVarietiesId', '')
      } else {
        this.checkItem = newValue
      }
      this.listData.forEach(item => {
        if (newValue === item.id) {
          this.$emit('getFuturesVarietiesName', item)
        }
      })
    }
  }
}
</script>

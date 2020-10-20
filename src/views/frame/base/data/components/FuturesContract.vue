<template>
  <el-select :placeholder="$t('biz.placeholder.choose')" v-model="checkItem" @change="change" :disabled="disabled" :clearable="clearable" :filterable="filterable">
    <el-option v-if='showType === "id"' v-for="item in listData" :key="item.id" :label="item.futuresVarietiesId" :value="item.id"></el-option>
    <el-option v-if='showType === "code"' v-for="item in listData" :key="item.id" :label="item.futuresContractCode" :value="item.id"></el-option>
    <el-option v-if='showType === "name"' v-for="item in listData" :key="item.id" :label="item.futuresContractName" :value="item.id"></el-option>
  </el-select>
</template>

<script>
import { getList, getDeleteData, getContractById } from '@/api/frame/base/data/futuresContract'

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
      }
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
    },
    deriType: {
      type: String,
      default: '0'
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
    },
    queryData(value) {
      this.getList(value)
    }
  },
  model: {
    prop: 'value',
    event: 'futuresContractId'
  },
  components: {},
  computed: {},
  mounted() {
    // 渲染表格数据
    this.getList(this.queryData)
  },
  methods: {
    getDeleteData(a, b) {
      getDeleteData(a, b).then(response => {
        if (response.data) {
          this.listData.push(response.data)
        }
      })
    },
    // 列表请求
    getList(value) {
      if (this.deriType === '0') {
        // 期货品种
        this.listQuery.data = value
        getList(this.listQuery, this.func)
          .then(response => {
            this.listData = response.data
            if (this.value) this.changeVal(this.value)
          })
          .catch(() => {})
      } else {
        // 期权品种
        this.listQuery.data = value
        getContractById(this.listQuery, this.func)
          .then(response => {
            this.listData = response.data
            if (this.value) this.changeVal(this.value)
          })
          .catch(() => {})
      }
    },
    change(evl) {
      this.$emit('futuresContractId', evl)
      if (evl) {
        this.listData.forEach(item => {
          if (evl === item.id) {
            this.$emit('getFuturesContractInfo', item)
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
            this.checkItem = response.data.futuresContractName
            this.change(newValue)
          }
        })
      } else if (isNull && !this.disabled) {
        this.checkItem = ''
        this.$emit('futuresContractId', '')
      } else {
        this.checkItem = newValue
      }
    }
  }
}
</script>
